const express = require('express');
const router = express.Router();
const getDb = require('./db');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Helpers
function toRow(item) {
  return {
    id: item.id,
    product_code: item.product_code,
    name: item.name,
    brand: item.brand,
    specification: item.specification,
    quantity: item.quantity,
    unit_price: item.unit_price,
    sell_price: item.sell_price,
    product_cost: item.product_cost,
    thumbnail_url: item.thumbnail_url
  };
}

// List inventory with optional search and category filter
router.get('/inventory', (req, res) => {
  const db = getDb();
  const { q = '', category = '' } = req.query;
  let rows;
  if (q) {
    const stmt = db.prepare("SELECT * FROM inventory_items WHERE name LIKE ? OR brand LIKE ? OR product_code LIKE ? ORDER BY name");
    const like = `%${q}%`;
    rows = stmt.all(like, like, like);
  } else if (category && category !== 'all') {
    const stmt = db.prepare("SELECT * FROM inventory_items WHERE brand = ? ORDER BY name");
    rows = stmt.all(category);
  } else {
    const stmt = db.prepare('SELECT * FROM inventory_items ORDER BY name');
    rows = stmt.all();
  }
  res.json(rows);
});

// Get single item
router.get('/inventory/:id', (req, res) => {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM inventory_items WHERE id = ?');
  const row = stmt.get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const images = db.prepare('SELECT url FROM item_images WHERE item_id = ? ORDER BY position').all(row.id).map(r => r.url);
  row.additional_images = images;
  res.json(row);
});

// Create item
router.post('/inventory', (req, res) => {
  const db = getDb();
  const data = req.body;
  const insert = db.prepare(`INSERT INTO inventory_items (product_code, name, brand, specification, quantity, unit_price, sell_price, product_cost, thumbnail_url)
    VALUES (@product_code, @name, @brand, @specification, @quantity, @unit_price, @sell_price, @product_cost, @thumbnail_url)`);
  try {
    const info = insert.run(data);
    const id = info.lastInsertRowid;
    if (Array.isArray(data.additionalImages)) {
      const insImg = db.prepare('INSERT INTO item_images (item_id, url, position) VALUES (?, ?, ?)');
      data.additionalImages.slice(0,5).forEach((u, i) => insImg.run(id, u, i));
    }
    res.json({ id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update item
router.put('/inventory/:id', (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const data = req.body;
  const stmt = db.prepare(`UPDATE inventory_items SET product_code=@product_code, name=@name, brand=@brand, specification=@specification, quantity=@quantity, unit_price=@unit_price, sell_price=@sell_price, product_cost=@product_cost, thumbnail_url=@thumbnail_url, updated_at=datetime('now') WHERE id=@id`);
  try {
    stmt.run({ ...data, id });
    // replace images if provided
    if (Array.isArray(data.additionalImages)) {
      const del = db.prepare('DELETE FROM item_images WHERE item_id=?');
      del.run(id);
      const insImg = db.prepare('INSERT INTO item_images (item_id, url, position) VALUES (?, ?, ?)');
      data.additionalImages.slice(0,5).forEach((u, i) => insImg.run(id, u, i));
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete item
router.delete('/inventory/:id', (req, res) => {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM inventory_items WHERE id=?');
  stmt.run(req.params.id);
  res.json({ ok: true });
});

// Deduct stock (used by order management) - transactional
router.post('/inventory/:id/deduct', (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const { amount = 0, reason = 'order' , reference } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'amount must be > 0' });
  const txn = db.transaction(() => {
    const cur = db.prepare('SELECT quantity FROM inventory_items WHERE id = ?').get(id);
    if (!cur) throw new Error('Item not found');
    if (cur.quantity - amount < 0) throw new Error('Insufficient stock');
    db.prepare('UPDATE inventory_items SET quantity = quantity - ?, updated_at = datetime("now") WHERE id = ?').run(amount, id);
    db.prepare('INSERT INTO stock_movements (inventory_item_id, change_amount, reason, reference) VALUES (?, ?, ?, ?)').run(id, -amount, reason, reference || null);
  });
  try {
    txn();
    // notify via socket
    const io = req.app.get('io');
    if (io) io.emit('stock-changed', { id, type: 'deduct', amount });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Adjust stock (add/subtract arbitrary amount)
router.post('/inventory/:id/adjust', (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const { amount = 0, reason = 'adjustment', reference } = req.body;
  if (amount === 0) return res.status(400).json({ error: 'amount must be non-zero' });
  const txn = db.transaction(() => {
    const cur = db.prepare('SELECT quantity FROM inventory_items WHERE id = ?').get(id);
    if (!cur) throw new Error('Item not found');
    const newQty = cur.quantity + amount;
    if (newQty < 0) throw new Error('Adjustment would cause negative stock');
    db.prepare('UPDATE inventory_items SET quantity = ?, updated_at = datetime("now") WHERE id = ?').run(newQty, id);
    db.prepare('INSERT INTO stock_movements (inventory_item_id, change_amount, reason, reference) VALUES (?, ?, ?, ?)').run(id, amount, reason, reference || null);
  });
  try {
    txn();
    const io = req.app.get('io');
    if (io) io.emit('stock-changed', { id, type: 'adjust', amount });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Low stock alerts
router.get('/alerts/low-stock', (req, res) => {
  const db = getDb();
  const threshold = Number(req.query.threshold || 5);
  const rows = db.prepare('SELECT * FROM inventory_items WHERE quantity <= ? ORDER BY quantity ASC').all(threshold);
  res.json(rows);
});

// Export CSV report
router.get('/export/inventory.csv', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM inventory_financials').all();
  const csvWriter = createCsvWriter({
    path: './inventory_export.csv',
    header: Object.keys(rows[0] || {}).map(k => ({ id: k, title: k }))
  });
  csvWriter.writeRecords(rows).then(() => {
    res.download('./inventory_export.csv');
  }).catch(err => res.status(500).json({ error: err.message }));
});

// Reporting endpoints
router.get('/report/summary', (req, res) => {
  const db = getDb();
  const totals = db.prepare('SELECT SUM(total_cost) as total_cost, SUM(total_sale_item) as total_sale, SUM(total_profit_item) as total_profit FROM inventory_financials').get();
  const avgCost = db.prepare('SELECT AVG(unit_price) as avg_unit_price FROM inventory_items').get();
  res.json({ totals, avgCost });
});

// Movement history
router.get('/inventory/:id/movements', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM stock_movements WHERE inventory_item_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json(rows);
});

module.exports = router;

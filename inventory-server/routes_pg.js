const express = require('express');
const router = express.Router();
const { pool } = require('./db_pg');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

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
router.get('/inventory', async (req, res) => {
  const { q = '', category = '' } = req.query;
  try {
    let result;
    if (q) {
      const like = `%${q}%`;
      result = await pool.query("SELECT * FROM inventory_items WHERE name ILIKE $1 OR brand ILIKE $1 OR product_code ILIKE $1 ORDER BY name", [like]);
    } else if (category && category !== 'all') {
      result = await pool.query('SELECT * FROM inventory_items WHERE brand = $1 ORDER BY name', [category]);
    } else {
      result = await pool.query('SELECT * FROM inventory_items ORDER BY name');
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single item
router.get('/inventory/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query('SELECT * FROM inventory_items WHERE id = $1', [id]);
    const row = rows[0];
    if (!row) return res.status(404).json({ error: 'Not found' });
    const imgs = await pool.query('SELECT url FROM item_images WHERE item_id = $1 ORDER BY position', [row.id]);
    row.additional_images = imgs.rows.map(r => r.url);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create item
router.post('/inventory', async (req, res) => {
  const data = req.body;
  const client = await pool.connect();
  try {
    const insertSql = `INSERT INTO inventory_items (product_code, name, brand, specification, quantity, unit_price, sell_price, product_cost, thumbnail_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`;
    const vals = [data.product_code, data.name, data.brand, data.specification, data.quantity || 0, data.unit_price || 0, data.sell_price || 0, data.product_cost || 0, data.thumbnail_url || null];
    await client.query('BEGIN');
    const info = await client.query(insertSql, vals);
    const id = info.rows[0].id;
    if (Array.isArray(data.additionalImages)) {
      const insImg = 'INSERT INTO item_images (item_id, url, position) VALUES ($1, $2, $3)';
      for (let i = 0; i < Math.min(5, data.additionalImages.length); i++) {
        await client.query(insImg, [id, data.additionalImages[i], i]);
      }
    }
    await client.query('COMMIT');
    res.json({ id });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Update item
router.put('/inventory/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const client = await pool.connect();
  try {
    const stmt = `UPDATE inventory_items SET product_code=$1, name=$2, brand=$3, specification=$4, quantity=$5, unit_price=$6, sell_price=$7, product_cost=$8, thumbnail_url=$9, updated_at=now() WHERE id=$10`;
    const vals = [data.product_code, data.name, data.brand, data.specification, data.quantity || 0, data.unit_price || 0, data.sell_price || 0, data.product_cost || 0, data.thumbnail_url || null, id];
    await client.query('BEGIN');
    await client.query(stmt, vals);
    if (Array.isArray(data.additionalImages)) {
      await client.query('DELETE FROM item_images WHERE item_id=$1', [id]);
      const insImg = 'INSERT INTO item_images (item_id, url, position) VALUES ($1, $2, $3)';
      for (let i = 0; i < Math.min(5, data.additionalImages.length); i++) {
        await client.query(insImg, [id, data.additionalImages[i], i]);
      }
    }
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Delete item
router.delete('/inventory/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM inventory_items WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deduct stock (used by order management) - transactional
router.post('/inventory/:id/deduct', async (req, res) => {
  const id = req.params.id;
  const { amount = 0, reason = 'order', reference } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'amount must be > 0' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const curRes = await client.query('SELECT quantity FROM inventory_items WHERE id = $1 FOR UPDATE', [id]);
    if (curRes.rowCount === 0) throw new Error('Item not found');
    const cur = curRes.rows[0];
    if (cur.quantity - amount < 0) throw new Error('Insufficient stock');
    await client.query('UPDATE inventory_items SET quantity = quantity - $1, updated_at = now() WHERE id = $2', [amount, id]);
    await client.query('INSERT INTO stock_movements (inventory_item_id, change_amount, reason, reference) VALUES ($1, $2, $3, $4)', [id, -amount, reason, reference || null]);
    await client.query('COMMIT');
    const io = req.app.get('io');
    if (io) io.emit('stock-changed', { id, type: 'deduct', amount });
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Adjust stock (add/subtract arbitrary amount)
router.post('/inventory/:id/adjust', async (req, res) => {
  const id = req.params.id;
  const { amount = 0, reason = 'adjustment', reference } = req.body;
  if (amount === 0) return res.status(400).json({ error: 'amount must be non-zero' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const curRes = await client.query('SELECT quantity FROM inventory_items WHERE id = $1 FOR UPDATE', [id]);
    if (curRes.rowCount === 0) throw new Error('Item not found');
    const cur = curRes.rows[0];
    const newQty = Number(cur.quantity) + Number(amount);
    if (newQty < 0) throw new Error('Adjustment would cause negative stock');
    await client.query('UPDATE inventory_items SET quantity = $1, updated_at = now() WHERE id = $2', [newQty, id]);
    await client.query('INSERT INTO stock_movements (inventory_item_id, change_amount, reason, reference) VALUES ($1, $2, $3, $4)', [id, amount, reason, reference || null]);
    await client.query('COMMIT');
    const io = req.app.get('io');
    if (io) io.emit('stock-changed', { id, type: 'adjust', amount });
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Low stock alerts
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const threshold = Number(req.query.threshold || 5);
    const rows = await pool.query('SELECT * FROM inventory_items WHERE quantity <= $1 ORDER BY quantity ASC', [threshold]);
    res.json(rows.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export CSV report
router.get('/export/inventory.csv', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory_financials');
    const rows = result.rows;
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, 'inventory_export.csv'),
      header: Object.keys(rows[0] || {}).map(k => ({ id: k, title: k }))
    });
    await csvWriter.writeRecords(rows);
    res.download(path.join(__dirname, 'inventory_export.csv'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reporting endpoints
router.get('/report/summary', async (req, res) => {
  try {
    const totalsRes = await pool.query('SELECT SUM(total_cost) as total_cost, SUM(total_sale_item) as total_sale, SUM(total_profit_item) as total_profit FROM inventory_financials');
    const avgRes = await pool.query('SELECT AVG(unit_price) as avg_unit_price FROM inventory_items');
    res.json({ totals: totalsRes.rows[0], avgCost: avgRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Movement history
router.get('/inventory/:id/movements', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM stock_movements WHERE inventory_item_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(rows.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

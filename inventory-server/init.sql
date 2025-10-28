-- Inventory DB schema
-- Table: inventory_items
-- Columns follow user's specification and include helpful metadata

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  specification TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price REAL NOT NULL DEFAULT 0.0,
  sell_price REAL NOT NULL DEFAULT 0.0,
  product_cost REAL NOT NULL DEFAULT 0.0,
  additional_info TEXT,
  thumbnail_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Movement history for stock changes
CREATE TABLE IF NOT EXISTS stock_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_item_id INTEGER NOT NULL,
  date_in TEXT DEFAULT (datetime('now')),
  change_amount INTEGER NOT NULL,
  reason TEXT,
  reference TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (inventory_item_id) REFERENCES inventory_items (id) ON DELETE CASCADE
);

-- Simple table to hold categories and tags
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- Join tables
CREATE TABLE IF NOT EXISTS item_tags (
  item_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (item_id, tag_id),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Additional images table
CREATE TABLE IF NOT EXISTS item_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (item_id) REFERENCES inventory_items (id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_code ON inventory_items(product_code);
CREATE INDEX IF NOT EXISTS idx_item_category ON inventory_items(brand);

-- A view to compute financials per item
CREATE VIEW IF NOT EXISTS inventory_financials AS
SELECT
  i.id,
  i.product_code,
  i.name,
  i.brand,
  i.specification,
  i.quantity,
  i.unit_price,
  i.sell_price,
  (i.unit_price * i.quantity) AS total_cost,
  i.product_cost,
  (i.sell_price - i.unit_price - i.product_cost) AS profit_per_unit,
  CASE WHEN i.sell_price = 0 THEN 0 ELSE ((i.sell_price - i.unit_price - i.product_cost) / i.sell_price) * 100 END AS profit_percent,
  (i.sell_price * i.quantity) AS total_sale_item,
  ((i.sell_price - i.unit_price - i.product_cost) * i.quantity) AS total_profit_item
FROM inventory_items i;

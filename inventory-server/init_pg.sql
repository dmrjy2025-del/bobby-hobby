-- Postgres schema for inventory management (Neon compatible)

BEGIN;

CREATE TABLE IF NOT EXISTS inventory_items (
  id SERIAL PRIMARY KEY,
  product_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  specification TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  sell_price NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  product_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  additional_info JSONB,
  thumbnail_url TEXT,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id SERIAL PRIMARY KEY,
  inventory_item_id INTEGER NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  date_in TIMESTAMP WITH TIME ZONE DEFAULT now(),
  change_amount INTEGER NOT NULL,
  reason TEXT,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS item_tags (
  item_id INTEGER NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, tag_id)
);

CREATE TABLE IF NOT EXISTS item_images (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_code ON inventory_items(product_code);
CREATE INDEX IF NOT EXISTS idx_item_brand ON inventory_items(brand);

-- Financials view
CREATE OR REPLACE VIEW inventory_financials AS
SELECT
  i.id,
  i.product_code,
  i.name,
  i.brand,
  i.specification,
  i.quantity,
  i.unit_price::numeric(14,2) AS unit_price,
  i.sell_price::numeric(14,2) AS sell_price,
  (i.unit_price * i.quantity)::numeric(18,2) AS total_cost,
  i.product_cost::numeric(14,2) AS product_cost,
  (i.sell_price - i.unit_price - i.product_cost)::numeric(14,2) AS profit_per_unit,
  CASE WHEN i.sell_price = 0 THEN 0 ELSE ((i.sell_price - i.unit_price - i.product_cost) / i.sell_price) * 100 END AS profit_percent,
  (i.sell_price * i.quantity)::numeric(18,2) AS total_sale_item,
  ((i.sell_price - i.unit_price - i.product_cost) * i.quantity)::numeric(18,2) AS total_profit_item
FROM inventory_items i;

COMMIT;

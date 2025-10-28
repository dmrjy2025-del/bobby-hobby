const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set. db_pg is intended for Postgres/Neon only.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function init() {
  const sql = fs.readFileSync(path.join(__dirname, 'init_pg.sql'), 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Postgres DB initialized');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to initialize Postgres DB', err.message || err);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--init')) {
    init().then(() => process.exit(0)).catch(() => process.exit(1));
  }
}

module.exports = { pool, init };

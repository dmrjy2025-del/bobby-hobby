const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'inventory.db');
const INIT_SQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--init')) {
    console.log('Initializing DB at', DB_PATH);
    const db = new Database(DB_PATH);
    db.exec(INIT_SQL);
    console.log('DB initialized');
    process.exit(0);
  }
}

module.exports = function getDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
};

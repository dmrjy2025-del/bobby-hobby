const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const routes = process.env.DATABASE_URL ? require('./routes_pg') : require('./routes');
const getDb = require('./db');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Attach io to app so routes can emit
app.set('io', io);

app.use('/api', routes);

// socket events
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('subscribe-low-stock', ({ threshold = 5 }) => {
    socket.join('low-stock');
    // optionally send initial data
  });
});

const PORT = process.env.PORT || 5010;

// If using Postgres (Neon) we prefer it. Otherwise ensure SQLite DB exists.
if (process.env.DATABASE_URL) {
  // nothing here; db_pg.js will be used for migrations if desired
  console.log('Using Postgres (DATABASE_URL provided)');
} else {
  // Ensure SQLite DB exists
  const initSql = require('fs').readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  const Database = require('better-sqlite3');
  const DB_PATH = path.join(__dirname, 'inventory.db');
  if (!require('fs').existsSync(DB_PATH)) {
    const db = new Database(DB_PATH);
    db.exec(initSql);
    db.close();
    console.log('SQLite DB created and initialized');
  }
}

server.listen(PORT, () => {
  console.log(`Inventory server listening on ${PORT}`);
});

process.on('SIGINT', () => process.exit(0));

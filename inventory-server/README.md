Inventory Server

Quickstart

1. Install dependencies

```bash
cd inventory-server
npm install
```

2. Initialize DB (optional, server will auto-init too)

```bash
npm run migrate
```

3. Start server

```bash
npm start
```

Server will run on http://localhost:5010 and expose REST endpoints under /api

Features
- SQLite database (inventory.db) using better-sqlite3
- REST endpoints for inventory CRUD, stock adjustment, reports, CSV export
- WebSocket (Socket.io) for real-time notifications (stock-changed events)
- Simple CSV export

Notes
- This is a minimal server for local/demo usage. For production, run behind a proper DB (Postgres), add authentication, rate limiting, and secure deployment.

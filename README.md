```markdown

  # Bobby Hobby

  This is a code bundle for Bobby Hobby. The original project is available at https://www.figma.com/design/cSyucK7LN7Uigth4cSLWan/Bobby-Hobby.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
```

## Inventory server (Postgres / Neon) — local PowerShell example

The repository contains an `inventory-server` service that can run against either SQLite (default) or Postgres/Neon. To initialize and run the server against a Neon (Postgres) database from PowerShell, set the `DATABASE_URL` environment variable, optionally set `PG_SSL`, run the migration, then start the server.

Replace <your_neon_database_url> with your actual Neon connection string. Do NOT paste secrets into issue trackers or chat if you don't want to share them.

PowerShell example (run from the repo root):

```powershell
# set Neon/Postgres connection string (example placeholder)
$env:DATABASE_URL = '<your_neon_database_url>'

# Set PG_SSL to 'true' if your provider requires SSL (common for Neon). If you are unsure, try with PG_SSL='true'.
$env:PG_SSL = 'true'

# install dependencies for the inventory-server and run the Postgres migration
cd .\inventory-server
npm install
npm run migrate:pg

# after the migration completes, start the server (it will use DATABASE_URL automatically)
npm start
```

What the commands do
- `migrate:pg` runs `db_pg.js --init` which executes `init_pg.sql` inside a transaction and creates the tables + view needed by the inventory server.
- `npm start` launches the Express server. When `DATABASE_URL` is present the server loads the Postgres routes and uses the Postgres pool.

Quick verification (PowerShell / browser / curl)

After the server starts (defaults to port 5010), verify basic endpoints:

```powershell
# list inventory (should return JSON array)
Invoke-RestMethod 'http://localhost:5010/api/inventory'

# low-stock alerts (threshold=5)
Invoke-RestMethod 'http://localhost:5010/api/alerts/low-stock?threshold=5'
```

Notes and troubleshooting
- If you see SSL connection errors, toggle `PG_SSL` between `'true'` and `'false'`. `db_pg.js` sets `rejectUnauthorized: false` when `PG_SSL` === 'true' to accommodate some hosted Postgres providers.
- The migration will fail if tables already exist; if you are re-running against a DB that already has the schema, skip `migrate:pg` or inspect `init_pg.sql` to only run the missing parts.
- The server falls back to an on-disk SQLite DB if `DATABASE_URL` is not set (useful for local development without Neon).

If you want, I can also add a short `inventory-server/README.md` with the same commands and a checklist of post-migration checks.

  # Bobby Hobby

  This is a code bundle for Bobby Hobby. The original project is available at https://www.figma.com/design/cSyucK7LN7Uigth4cSLWan/Bobby-Hobby.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
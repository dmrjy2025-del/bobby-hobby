Inventory Management — Admin Manual

Overview
This small local server supports inventory CRUD, stock adjustments, reports, and real-time notifications. Use the Admin Product Management page to create/edit products and keep inventory in sync.

Key screens/actions
- Add New Product: fill name, brand, image URL, category, price, and optional additional images. Click Add Product.
- Edit Product: change quantity or prices. Use 'Tampilkan di Katalog' to hide/show from storefront.
- Stock Adjustment: use the Adjust endpoint to add or remove stock for corrections.
- Low stock alerts: subscribe to Socket.io event 'stock-changed' and call /alerts/low-stock periodically to surface items under threshold.

Export and reports
- Export full inventory financials via /api/export/inventory.csv
- Summary via /api/report/summary

Backup & restore
- The database file is inventory-server/inventory.db — snapshot and copy to backup.
- To restore, stop server, replace inventory.db with backup, then start server.

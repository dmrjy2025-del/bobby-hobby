Inventory Server API

Base URL: http://localhost:5010/api

Endpoints

GET /inventory
- Query params: q (search), category
- Returns list of inventory items

GET /inventory/:id
- Returns single item with additional_images

POST /inventory
- Body: { product_code, name, brand, specification, quantity, unit_price, sell_price, product_cost, thumbnail_url, additionalImages[] }
- Creates item

PUT /inventory/:id
- Body: same as POST
- Updates item; replace additionalImages if provided

DELETE /inventory/:id
- Deletes item

POST /inventory/:id/deduct
- Body: { amount, reason, reference }
- Deduct stock in a transaction. Returns error if insufficient stock.

POST /inventory/:id/adjust
- Body: { amount (positive or negative), reason, reference }
- Adjust stock (prevents negative resulting stock)

GET /inventory/:id/movements
- Returns stock movement history for item

GET /alerts/low-stock?threshold=5
- Returns items with quantity <= threshold

GET /report/summary
- Returns total_cost, total_sale, total_profit and average unit price

GET /export/inventory.csv
- Generates a CSV export of inventory financials and starts download

WebSocket Events (Socket.io)
- Connect to ws://localhost:5010
- Events emitted by server:
  - 'stock-changed' : { id, type: 'deduct'|'adjust', amount }

Integration notes
- When an order transitions to status 'shipping', call POST /inventory/:id/deduct for each line item (amount = quantity ordered, reference = order id)
- Validate response and handle Insufficient stock errors by notifying the user or creating backorders

Security
- This server does not implement authentication. In production, add JWT or session auth and secure endpoints.

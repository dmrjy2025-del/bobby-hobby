Integration Guide — Inventory ↔ Order System

Goal: Keep inventory and orders in sync and prevent overselling.

1) Basic flow
- When an order is placed, do NOT deduct inventory yet.
- When the order status changes to 'shipping' (meaning items are being shipped), call the inventory API to deduct stock.
- If deduction fails (insufficient stock), change order status to 'on-hold' and notify admin.

2) Example client-side call (from OrderContext)

```ts
// when order status moves to 'shipping'
async function deductForOrder(order) {
  for (const line of order.items) {
    const res = await fetch(`/api/inventory/${line.inventoryId}/deduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: line.quantity, reason: 'order', reference: order.id })
    });
    if (!res.ok) {
      const err = await res.json();
      // handle insufficient stock
      throw new Error(err.error || 'Failed to deduct stock');
    }
  }
}
```

3) Real-time updates
- Subscribe to Socket.io `stock-changed` events to update UI and show low-stock alerts.

4) Stock reservation (optional advanced)
- For high-volume stores, implement reservation on order creation and final deduction on shipping.
- Reservation reduces `available` stock but not `quantity` until shipping. This requires additional fields and logic.

5) Webhook / Server-to-server integration
- For improved reliability, call inventory endpoints from backend order processing (server-to-server) rather than client-side.

6) Error scenarios
- Deduction returns 400 Insufficient stock: create backorder or contact customer
- Network error: retry with exponential backoff or mark order for manual processing

7) Migration notes
- If your existing products don't have `inventory_item_id` mapping, add a column to your orders' line items linking to `inventory_items.id` so deduction is accurate.

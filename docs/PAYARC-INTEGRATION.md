# PayArc Payment Integration

Reference documentation for the PayArc payment provider integration.

## Payment Flow

1. Frontend builds cart via `CartContext`
2. `POST /api/checkout` creates a PayArc order via `payarc-provider.js`
3. PayArc returns a `payment_form_url` — user is redirected there to pay
4. After payment: PayArc sends webhook + redirects user to `/checkout/success?session_id=<orderId>`
5. Webhook (`/api/webhooks/payarc`) processes the order: emails + Strapi save
6. Success page shows confirmation (order already processed by webhook)

## Webhook Body Structure

PayArc sends the body as a flat object (no `payload` wrapper):

```json
{
  "request_payload": "<JSON string>",
  "api_response": "<JSON string>",
  "event_type": "Order Charged"
}
```

**Both `request_payload` and `api_response` are JSON strings, not objects.** They require `JSON.parse()`.

> The PayArc dashboard WebHookLog displays these fields as parsed objects inside a `payload` wrapper, but the actual HTTP POST body is different.

## Webhook Events

PayArc sends **2 webhooks per payment**:

| Event | Description | OrderId location |
|-------|-------------|-----------------|
| `Charges Created` | Charge created | `JSON.parse(request_payload).order_id` (numeric, PayArc internal) |
| `Order Charged` | Order completed | `JSON.parse(api_response).original.orderId` (alphanumeric, matches session-store) |

The **"Order Charged"** event contains the orderId that matches our `session-store` key (e.g., `"R6qMzB466RRBgx14"`). The "Charges Created" event's `order_id` is PayArc's internal numeric ID and does not match.

## Session Store (In-Memory)

PayArc does not support arbitrary metadata on orders (unlike Stripe's `metadata` field). To pass cart/customer data from checkout to webhook processing, we use an in-memory session store (`services/payment/session-store.js`):

- **Dual-key storage**: Sessions are stored under both the PayArc `orderId` (alphanumeric) and `order_id` (numeric) so either webhook event can find it.
- **`claimSession(key)`**: Atomically retrieves AND deletes the session. First caller (webhook) wins; subsequent calls return `null`. Also removes the sibling key.
- **TTL**: Sessions expire after a configurable timeout to prevent memory leaks.

## Timeout Handling

PayArc has a **~10-15 second webhook timeout** with **1 retry** on failure.

To avoid timeouts, the webhook uses Next.js `after()` API to respond immediately with `{ received: true }` and process the order (emails + Strapi saves) in the background.

## Key Differences from Stripe

| Aspect | Stripe | PayArc |
|--------|--------|--------|
| Metadata | Native `metadata` field on sessions | In-memory session-store |
| Webhook signature | HMAC verification | None (no signature verification) |
| Line items | Retrieved via `session.line_items` expand | Stored in session-store `lineItems` |
| Subscriptions | Native support | Not supported |
| Webhook timeout | 30s | ~10-15s |
| Webhook events | Single `checkout.session.completed` | Two events per payment |

## Files

- `src/app/services/payment/payarc-provider.js` — PayArc API client (create orders, retrieve sessions)
- `src/app/services/payment/session-store.js` — In-memory session store with dual-key + claimSession
- `src/app/api/webhooks/payarc/route.js` — Webhook handler
- `src/app/api/checkout/route.js` — Checkout route (creates PayArc order)

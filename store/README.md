# Sofnade store (Next.js / Vercel)

Standalone storefront + checkout that replaces WooCommerce. Hosts on Vercel at
a subdomain (e.g. `order.sofnade.com`). Payments via Razorpay, orders in
Supabase (source of truth), staff fulfilment mirrored to Notion, products and
settings in Sanity.

See the architecture doc:
https://docs.google.com/document/d/1n-swW6YBIKJNz9y2RosNvb66CuGrhew3SGweHf-9FuE/edit

## Status

Scaffolded and validated:

- `lib/schedule.ts` — order cut-off (4pm SGT), 3rd-business-day lead time,
  SG public-holiday skipping, 30-min fresh-food slots (9am–5pm), shelf-stable
  window, mixed-order deconfliction (fresh wins), and the "order now" message.
- `lib/pricing.ts` — server-side totals: subtotal, discount, $30/free-over-$150
  delivery (threshold measured **before** discount), $15 transport surcharge by
  postal prefix (applies **even when delivery is free**), $30 specific-time
  add-on (shelf-only).
- API routes: `POST /api/quote`, `POST /api/checkout`, `POST /api/razorpay-webhook`.
- `test/logic.test.ts` — the worked date examples and all fee scenarios.

Stubbed (wire up with env/services):

- `lib/sanity.ts` (catalog currently uses an in-memory sample in `lib/catalog.ts`)
- `lib/razorpay.ts`, `lib/db.ts` (Supabase), `lib/notion.ts`

To do next: port the storefront UI (listing, product, checkout) from the static
mock; finish the webhook's order load + Notion mirror + Resend receipt.

## Run

```bash
cd store
npm install
cp .env.example .env.local   # fill in keys
npm run dev                  # http://localhost:3000
npm test                     # logic tests
npm run typecheck
```

Without keys, `/api/checkout` returns the computed quote in a "dry" mode and
orders are held in memory, so the flow is demonstrable before services are
connected.

## The four pricing decisions (locked in)

1. Transport surcharge **always** applies to listed areas, even on free delivery.
2. Fresh-food slots run **9:00 AM–5:00 PM** in 30-minute intervals.
3. The **$150** free-delivery threshold is measured on the subtotal **before** discount.
4. A **mixed** order (fresh + shelf) is treated as **fresh**: date + slot required,
   and the specific-time add-on is hidden (offered to shelf-only orders).

## Security notes

- Every amount is recomputed server-side from the catalog; client amounts are ignored.
- The webhook verifies the Razorpay HMAC signature and is idempotent on event id.
- "Paid" is set only by the verified webhook, never by the browser.
- The SG public-holiday list in `lib/holidays.ts` is a placeholder — confirm the
  official MOM dates and move it to Sanity so the owner can edit it.

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

CMS (Sanity) is wired into the storefront data layer:

- `lib/catalog.ts` reads products + toppings from Sanity (GROQ over the read-only
  HTTP API, no SDK), maps them to the storefront shape, derives `fresh`/`shelf`
  from the product's category, and shows the uploaded photo when present.
- `lib/coupons.ts` resolves discount codes from Sanity, including the
  `shipping` (free-delivery) type now honoured by the pricing engine.
- `lib/settings.ts` reads the `siteSettings` document (hero copy, delivery fee,
  free-delivery threshold, time slots); the home hero and the delivery
  fee/threshold used in pricing come from it.
- All three fall back to their built-in samples when Sanity is unset
  (`SANITY_PROJECT_ID` / `SANITY_DATASET`) or unreachable, so the shop never goes
  blank. Set `SANITY_READ_TOKEN` only if the dataset is private.

Stubbed (wire up with env/services):

- `lib/razorpay.ts`, `lib/db.ts` (Supabase), `lib/notion.ts`

To do next: finish the webhook's order load + Notion mirror + Resend receipt;
move the SG public-holiday list into Sanity so the owner can edit it.

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

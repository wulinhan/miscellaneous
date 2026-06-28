# Order capture & notifications — setup

This connects the checkout to real order handling: every paid order is **saved**
(Supabase), **mirrored to your team** (Notion), and the customer gets a **receipt**
(Resend). Until you set these up, the store runs in test mode exactly as before —
nothing breaks, orders just aren't recorded.

How it fits together:

```
Customer pays (Razorpay)
        │
        ├─ /api/checkout        → saves a PENDING order (status: created)
        ├─ /api/verify-payment  → on valid signature: marks PAID + notifies   (immediate)
        └─ /api/razorpay-webhook→ on payment.captured: marks PAID + notifies   (backstop)
```

Marking paid is a single atomic step (`created → paid`), so whichever of the two
paths arrives first does the work and the customer is notified **exactly once**.

All variables go in **Vercel → Project → Settings → Environment Variables**
(Production). Redeploy after adding them. Each block below is independent — add
what you want; skipped blocks just no-op.

---

## 1. Store orders (Supabase)

1. Create a free project at https://supabase.com.
2. In **SQL Editor**, paste and run [`db/orders.sql`](db/orders.sql) (creates the
   `orders` table with row-level security on).
3. In **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY`
     (server-only; never expose it in the browser.)

That's the minimum to **capture** orders. Notion/Resend below are optional add-ons.

## 2. Mirror to your team (Notion)

1. Create an internal integration at https://www.notion.com/my-integrations and
   copy its secret → `NOTION_TOKEN`.
2. Make a database (e.g. "Orders") with at least a **title** column. Open it,
   **… → Connections →** add your integration.
3. Copy the database id from its URL (the 32-char id before `?v=`) →
   `NOTION_DATABASE_ID`.

Each paid order becomes a page titled `SOF-… - <customer>`, with the full
itemised breakdown, delivery details and Razorpay ids in the page body. (We write
everything into the page body, so it works with any database that has a title
column — no specific property names required.)

## 3. Email receipts (Resend)

1. Sign up at https://resend.com, **verify your sending domain**, create an API
   key → `RESEND_API_KEY`.
2. Set `RECEIPT_FROM` to an address on that domain (e.g. `orders@sofnade.com`).
3. Optional: set `ORDER_NOTIFY_EMAIL` to BCC every receipt to your own inbox.

## 4. Turn on payments (Razorpay)

If not already done: set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and create a
webhook in the Razorpay dashboard pointing to
`https://<your-domain>/api/razorpay-webhook` for the **`payment.captured`** event,
using a secret you also set as `RAZORPAY_WEBHOOK_SECRET`.

> Note: charging in **SGD** needs an international-enabled Razorpay merchant. For
> testing on a standard India account, set `RAZORPAY_CURRENCY=INR`.

See [`.env.example`](.env.example) for the full variable list.

---

## Verifying it works

1. Place a test order on the live site and complete payment.
2. **Supabase → Table editor → orders**: a row appears, flips to `status = paid`.
3. **Notion**: a new order page appears.
4. The customer email receives a receipt.

If an order saves but isn't marked paid, check that the Razorpay webhook is
configured (and/or that `/api/verify-payment` is being called) and that
`RAZORPAY_WEBHOOK_SECRET` matches the dashboard.

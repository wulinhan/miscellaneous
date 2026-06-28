# Staff orders dashboard — setup

A simple password-protected page at **`/admin.html`** where staff can view every
order, change its **status**, and add **notes**. It reads/writes your Supabase
`orders` table through a gated serverless endpoint — the Supabase service key
never reaches the browser.

## Activate (2 steps)

1. **Add the notes/audit columns.** In the Supabase SQL Editor, run
   [`db/orders-admin-migration.sql`](db/orders-admin-migration.sql) (adds
   `staff_notes` and `updated_at`; safe to re-run). New projects that ran the
   latest `db/orders.sql` already have them.

2. **Set the password.** In **Vercel → Settings → Environment Variables**, add
   `ADMIN_PASSWORD` = a long random value (Production scope). Redeploy (or it
   applies on the next deploy).

Then open **`https://<your-domain>/admin.html`**, enter the password, and you're in.

## What staff can do
- See all orders, newest first; filter by status.
- Change **status**: `created → paid → preparing → out_for_delivery → completed`
  (or `cancelled`). `created`/`paid` are set automatically by checkout/payment;
  the rest are for your fulfilment workflow.
- Add/edit **staff notes** per order.
- Expand **Order details** for items, contact, address, delivery date/slot, and
  the payment reference.

## Security notes
- The page is `noindex` and shows nothing until the password is entered; the
  password is checked server-side (constant-time) and sent over HTTPS only.
- It's a **shared** password for a small trusted team. Rotate it by changing
  `ADMIN_PASSWORD` in Vercel (everyone re-enters). For per-person logins and an
  audit trail, we can later switch to Supabase Auth.
- Treat the `/admin.html` URL as internal — don't link it publicly.

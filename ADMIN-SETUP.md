# Staff orders dashboard — setup

A simple password-protected page at **`/admin.html`** where staff can view every
order, change its **status**, and add **notes**. It reads/writes your Supabase
`orders` table through a gated serverless endpoint — the Supabase service key
never reaches the browser.

## Activate (2 steps)

1. **Add the extra columns.** In the Supabase SQL Editor, run
   [`db/orders-admin-migration.sql`](db/orders-admin-migration.sql) (adds
   `staff_notes`, `updated_at`) **and**
   [`db/orders-staff-fields.sql`](db/orders-staff-fields.sql) (adds `preparer`,
   `driver`, `status_history`). Both are safe to re-run. New projects that ran
   the latest `db/orders.sql` already have all of them. Also run
   [`db/staff.sql`](db/staff.sql) once to create the staff roster table used by
   the Preparer/Driver dropdowns.

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
- Assign a **Preparer** and **Driver** (autocomplete suggests names already used).
- See a **status log** on each order — every change records the new status, the
  time, and who made it (set your name once in the **"You:"** box in the header).
- **WhatsApp customer** button opens a pre-filled chat (Singapore +65 default).
- Expand **Order details** for items, contact, address, delivery date/slot, and
  the payment reference.

## Security notes
- The page is `noindex` and shows nothing until the password is entered; the
  password is checked server-side (constant-time) and sent over HTTPS only.
- It's a **shared** password for a small trusted team. Rotate it by changing
  `ADMIN_PASSWORD` in Vercel (everyone re-enters). For per-person logins and an
  audit trail, we can later switch to Supabase Auth.
- Treat the `/admin.html` URL as internal — don't link it publicly.

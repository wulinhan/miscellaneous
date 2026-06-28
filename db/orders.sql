-- Sofnade orders table (Supabase / Postgres).
-- Run once in the Supabase SQL editor for your project. The serverless API
-- writes here with the SERVICE ROLE key (which bypasses RLS), so we keep RLS
-- on with no public policies — the table is not readable/writable by anon keys.

create table if not exists public.orders (
  id                  text primary key,           -- our order id, e.g. SOF-ABC123-DE45
  status              text not null default 'created',  -- 'created' | 'paid'
  customer            jsonb,                       -- name, phone, email, address, notes
  fulfilment          text,                        -- 'delivery' | 'pickup'
  postal              text,
  delivery_date       text,                        -- YYYY-MM-DD chosen at checkout
  slot_or_window      text,                        -- fresh slot or shelf window
  quote               jsonb,                       -- full server-computed breakdown
  amount_total        numeric,                     -- quote.total, for quick reading
  currency            text default 'SGD',
  razorpay_order_id   text,                        -- links the payment back to us
  razorpay_payment_id text,
  staff_notes         text,                        -- free-text notes added by staff
  preparer            text,                        -- staff member preparing the order
  driver              text,                        -- staff member delivering the order
  status_history      jsonb not null default '[]'::jsonb,  -- [{status, at, by}, …]
  created_at          timestamptz not null default now(),
  updated_at          timestamptz,                 -- last staff edit
  paid_at             timestamptz
);

-- The webhook/verify path looks orders up by the Razorpay order id.
create index if not exists orders_razorpay_order_idx on public.orders (razorpay_order_id);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;
-- No policies added on purpose: only the service-role key (used server-side)
-- can read/write. Never expose the service-role key to the browser.

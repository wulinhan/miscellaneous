-- Migration for the staff admin dashboard. Run once in the Supabase SQL Editor
-- if you created the orders table BEFORE the admin feature (adds the two columns
-- the dashboard edits). Safe to run more than once.

alter table public.orders add column if not exists staff_notes text;
alter table public.orders add column if not exists updated_at timestamptz;

-- Status values the dashboard uses (the column is plain text — no enum needed):
--   created            (set by checkout, pre-payment)
--   paid               (set by the verified payment/webhook)
--   preparing
--   out_for_delivery
--   completed
--   cancelled

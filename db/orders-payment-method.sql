-- Add a payment_method column so staff can tell how an order was placed.
-- 'card'       = paid online via Razorpay
-- 'vendors_sg' = Vendors@SG request (created unpaid; staff follow up to arrange payment)
-- Run once in the Supabase SQL editor. Existing rows default to 'card'.

alter table public.orders
  add column if not exists payment_method text not null default 'card';

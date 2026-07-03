-- Add an archived flag so staff can hide completed/old orders from the main
-- views without deleting them. Hard deletes are still possible (see the admin
-- "Delete" action), but archiving is the reversible default.
-- Run once in the Supabase SQL editor. Existing rows default to false.

alter table public.orders
  add column if not exists archived boolean not null default false;

create index if not exists orders_archived_idx on public.orders (archived);

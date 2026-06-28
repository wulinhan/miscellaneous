-- Migration: preparer/driver assignment + a status-change log.
-- Run once in the Supabase SQL Editor if your orders table predates these.
-- Safe to run more than once.

alter table public.orders add column if not exists preparer text;
alter table public.orders add column if not exists driver text;
alter table public.orders add column if not exists status_history jsonb not null default '[]'::jsonb;

-- status_history is an append-only list of { status, at (ISO timestamp), by }.
-- "by" is the staff "You:" name on the dashboard, or 'system'/'payment' for
-- automatic transitions.

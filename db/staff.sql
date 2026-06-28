-- Staff roster for the admin dashboard's Preparer/Driver dropdowns.
-- Run once in the Supabase SQL Editor. Names are managed from the dashboard
-- ("➕ Add new…" in the dropdowns); this just creates the table.

create table if not exists public.staff (
  name        text primary key,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.staff enable row level security;
-- No policies: only the service-role key (used server-side by the admin API)
-- can read/write. The browser never touches this table directly.

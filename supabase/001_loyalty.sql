create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  name text not null check (char_length(name) between 2 and 80),
  phone text,
  stamps integer not null default 0 check (stamps between 0 and 5),
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.stamp_log (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  type text not null check (type in ('stamp','redeem','undo')),
  created_at timestamptz not null default now(),
  created_by uuid
);

create index if not exists stamp_log_customer_created_idx on public.stamp_log(customer_id, created_at desc);
create index if not exists stamp_log_created_idx on public.stamp_log(created_at desc);

alter table public.customers enable row level security;
alter table public.stamp_log enable row level security;

-- Gunakan service role hanya dari Route Handler server.
revoke all on public.customers from anon, authenticated;
revoke all on public.stamp_log from anon, authenticated;
grant all on public.customers to service_role;
grant all on public.stamp_log to service_role;

-- No policies intentionally: Postgres rejects direct anon/authenticated access.
-- All application access uses server-side service role or authenticated route checks.

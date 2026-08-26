-- ============================================================
-- Enquiries table — stores contact-form submissions from website
-- Run in Supabase SQL Editor (idempotent — safe to re-run)
-- ============================================================

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text,
  project_id text,
  source text default 'website',
  status text default 'new',
  created_at timestamptz default now()
);

alter table public.enquiries enable row level security;

-- Website visitors (anon) may submit enquiries
drop policy if exists "public insert enquiries" on public.enquiries;
create policy "public insert enquiries" on public.enquiries
  for insert to anon, authenticated with check (true);

-- Website + admin may read them
drop policy if exists "public read enquiries" on public.enquiries;
create policy "public read enquiries" on public.enquiries
  for select to anon, authenticated using (true);

-- Admin may update status / delete
drop policy if exists "admin update enquiries" on public.enquiries;
create policy "admin update enquiries" on public.enquiries
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "admin delete enquiries" on public.enquiries;
create policy "admin delete enquiries" on public.enquiries
  for delete to anon, authenticated using (true);

-- Index for admin list views (newest first)
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);

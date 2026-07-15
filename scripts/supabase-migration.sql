-- ============================================================
-- VGG Infra Developers — Public Website Schema Extension
-- Run this in your Supabase SQL Editor to create the new content
-- tables that power the public website (hero banners, gallery,
-- amenities, testimonials, FAQs, team, offers, brochures, news,
-- nearby places, videos, company stats, timeline).
--
-- These tables complement your existing admin dashboard tables:
--   projects, layouts, plots, customers, bookings, sales,
--   payments, settings, activity_logs, user_profiles
--
-- The public website reads from BOTH the existing admin tables
-- AND these new tables. Updates made in your admin dashboard to
-- projects/plots/settings are reflected automatically on the
-- public website with no code changes.
-- ============================================================

-- 1. Hero banners (homepage slider)
create table if not exists public.hero_banners (
  id text primary key,
  title text not null,
  subtitle text,
  image text not null,
  cta_text text,
  cta_link text,
  "order" integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. Gallery images
create table if not exists public.gallery_images (
  id text primary key,
  title text,
  image text not null,
  category text,
  project_id text references public.projects(id) on delete set null,
  "order" integer default 0,
  created_at timestamptz default now()
);

-- 3. Amenities
create table if not exists public.amenities (
  id text primary key,
  title text not null,
  description text,
  icon text,
  image text,
  "order" integer default 0
);

-- 4. Testimonials
create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  role text,
  photo text,
  rating integer default 5,
  text text not null,
  video_url text,
  "order" integer default 0
);

-- 5. FAQ
create table if not exists public.faqs (
  id text primary key,
  question text not null,
  answer text not null,
  category text,
  "order" integer default 0
);

-- 6. Team members
create table if not exists public.team_members (
  id text primary key,
  name text not null,
  role text,
  photo text,
  bio text,
  phone text,
  email text,
  linkedin text,
  "order" integer default 0
);

-- 7. Offers
create table if not exists public.offers (
  id text primary key,
  title text not null,
  description text,
  image text,
  valid_until date,
  active boolean default true,
  "order" integer default 0
);

-- 8. Brochures (PDFs)
create table if not exists public.brochures (
  id text primary key,
  title text not null,
  file_url text not null,
  project_id text references public.projects(id) on delete cascade,
  "order" integer default 0
);

-- 9. News & announcements
create table if not exists public.news (
  id text primary key,
  title text not null,
  content text,
  image text,
  date date not null default current_date,
  link text,
  "order" integer default 0
);

-- 10. Nearby places (for location section)
create table if not exists public.nearby_places (
  id text primary key,
  name text not null,
  type text not null,
  distance_km numeric,
  travel_minutes integer,
  icon text,
  "order" integer default 0
);

-- 11. Videos
create table if not exists public.videos (
  id text primary key,
  title text not null,
  url text not null,
  thumbnail text,
  project_id text references public.projects(id) on delete set null,
  "order" integer default 0
);

-- 12. Company stats (animated counters on About section)
create table if not exists public.company_stats (
  id text primary key,
  label text not null,
  value integer not null,
  suffix text,
  icon text,
  "order" integer default 0
);

-- 13. Company timeline (milestones)
create table if not exists public.timeline_events (
  id text primary key,
  year text not null,
  title text not null,
  description text,
  "order" integer default 0
);

-- 14. Add extra columns to existing projects table for public website use.
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'cover_image') then
    alter table public.projects add column cover_image text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'starting_price') then
    alter table public.projects add column starting_price numeric;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'price_per_cent') then
    alter table public.projects add column price_per_cent numeric;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'area_unit') then
    alter table public.projects add column area_unit text default 'cents';
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'map_lat') then
    alter table public.projects add column map_lat numeric;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'map_lng') then
    alter table public.projects add column map_lng numeric;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'map_zoom') then
    alter table public.projects add column map_zoom integer default 13;
  end if;
end$$;

-- 15. Enable Row-Level Security but allow public read access on all
--     website-facing tables (the public site only reads; admin uses
--     service role / authenticated writes).
alter table public.hero_banners enable row level security;
alter table public.gallery_images enable row level security;
alter table public.amenities enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.team_members enable row level security;
alter table public.offers enable row level security;
alter table public.brochures enable row level security;
alter table public.news enable row level security;
alter table public.nearby_places enable row level security;
alter table public.videos enable row level security;
alter table public.company_stats enable row level security;
alter table public.timeline_events enable row level security;

create policy "public read hero_banners" on public.hero_banners for select to anon, authenticated using (true);
create policy "public read gallery_images" on public.gallery_images for select to anon, authenticated using (true);
create policy "public read amenities" on public.amenities for select to anon, authenticated using (true);
create policy "public read testimonials" on public.testimonials for select to anon, authenticated using (true);
create policy "public read faqs" on public.faqs for select to anon, authenticated using (true);
create policy "public read team_members" on public.team_members for select to anon, authenticated using (true);
create policy "public read offers" on public.offers for select to anon, authenticated using (true);
create policy "public read brochures" on public.brochures for select to anon, authenticated using (true);
create policy "public read news" on public.news for select to anon, authenticated using (true);
create policy "public read nearby_places" on public.nearby_places for select to anon, authenticated using (true);
create policy "public read videos" on public.videos for select to anon, authenticated using (true);
create policy "public read company_stats" on public.company_stats for select to anon, authenticated using (true);
create policy "public read timeline_events" on public.timeline_events for select to anon, authenticated using (true);

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'public read projects' and tablename = 'projects') then
    execute 'create policy "public read projects" on public.projects for select to anon, authenticated using (true)';
  end if;
  if not exists (select 1 from pg_policies where policyname = 'public read layouts' and tablename = 'layouts') then
    execute 'create policy "public read layouts" on public.layouts for select to anon, authenticated using (true)';
  end if;
  if not exists (select 1 from pg_policies where policyname = 'public read plots' and tablename = 'plots') then
    execute 'create policy "public read plots" on public.plots for select to anon, authenticated using (true)';
  end if;
  if not exists (select 1 from pg_policies where policyname = 'public read settings' and tablename = 'settings') then
    execute 'create policy "public read settings" on public.settings for select to anon, authenticated using (true)';
  end if;
end$$;

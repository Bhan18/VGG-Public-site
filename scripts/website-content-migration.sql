-- ============================================================
-- Website Content & Admin write access
-- Run in Supabase SQL Editor (idempotent — safe to re-run)
-- ============================================================

-- 1) Theme mode setting (admin can toggle dark/light for the whole site)
alter table public.settings add column if not exists theme_mode text default 'dark';
update public.settings set theme_mode = 'dark' where id = 1 and theme_mode is null;

-- 2) Allow the website admin (anon key) to manage content.
--    The public site's admin panel writes with the anon key, so it
--    needs insert/update/delete policies in addition to read.

do $$
declare
  t text;
begin
  foreach t in array array[
    'hero_banners','gallery_images','amenities','testimonials','faqs',
    'team_members','offers','brochures','news','nearby_places','videos',
    'company_stats','timeline_events','settings'
  ]
  loop
    if not exists (select 1 from pg_policies where policyname = 'admin write ' || t and tablename = t) then
      execute format('create policy "admin write %1$s" on public.%1$I for insert to anon, authenticated with check (true)', t);
    end if;
    if not exists (select 1 from pg_policies where policyname = 'admin update ' || t and tablename = t) then
      execute format('create policy "admin update %1$s" on public.%1$I for update to anon, authenticated using (true) with check (true)', t);
    end if;
    if not exists (select 1 from pg_policies where policyname = 'admin delete ' || t and tablename = t) then
      execute format('create policy "admin delete %1$s" on public.%1$I for delete to anon, authenticated using (true)', t);
    end if;
  end loop;
end$$;

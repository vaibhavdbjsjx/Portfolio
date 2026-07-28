-- ===========================================================================
--  PORTFOLIO VISITOR ANALYTICS — Supabase setup
--  Run this once in your Supabase project:  SQL Editor -> New query -> Run
-- ===========================================================================
--
--  Privacy notes
--  -------------
--  * No cookies, no persistent identifier, no IP addresses are stored.
--  * `visitor_hash` is a SHA-256 fingerprint that includes the current DATE,
--    so it rotates every day. It lets you count unique visitors per day but
--    makes it impossible to follow one person across days.
--  * `timezone` (e.g. "Asia/Calcutta") stands in for country, so no IP
--    geolocation is ever performed.
-- ===========================================================================

create table if not exists public.portfolio_views (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  event         text        not null default 'page_view',  -- page_view | project_open | contact_submit
  path          text,
  project       text,        -- which project's Read Me was opened
  source        text,        -- ?src= tag: resume | linkedin | <company>
  referrer      text,        -- referring hostname only
  timezone      text,
  language      text,
  device        text,        -- mobile | tablet | desktop
  browser       text,
  os            text,
  screen        text,
  visitor_hash  text,        -- pseudonymous, rotates daily
  session_id    text
);

create index if not exists portfolio_views_created_at_idx on public.portfolio_views (created_at desc);
create index if not exists portfolio_views_event_idx      on public.portfolio_views (event);
create index if not exists portfolio_views_source_idx     on public.portfolio_views (source);

-- ---------------------------------------------------------------------------
--  SECURITY (important)
--  The anon key ships inside the public JS bundle, so it must be able to do
--  exactly one thing: INSERT. No SELECT / UPDATE / DELETE — otherwise anyone
--  could read or wipe your analytics. You read the data while signed in to the
--  Supabase dashboard, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.portfolio_views enable row level security;

drop policy if exists "anon can insert views" on public.portfolio_views;
create policy "anon can insert views"
  on public.portfolio_views
  for insert
  to anon
  with check (true);

-- Deliberately NO select/update/delete policy for anon.

-- ===========================================================================
--  READY-MADE REPORTS
--  Paste any of these into the SQL Editor whenever you want the numbers.
-- ===========================================================================

-- 1. Headline numbers, last 30 days
--    select * from analytics_summary;
create or replace view public.analytics_summary as
select
  count(*) filter (where event = 'page_view')                          as total_views,
  count(distinct visitor_hash) filter (where event = 'page_view')      as unique_visitors,
  count(distinct session_id)                                           as sessions,
  count(*) filter (where event = 'project_open')                       as project_opens,
  count(*) filter (where event = 'page_view'
                    and created_at > now() - interval '24 hours')      as views_last_24h,
  count(*) filter (where event = 'page_view'
                    and created_at > now() - interval '7 days')        as views_last_7d
from public.portfolio_views
where created_at > now() - interval '30 days';

-- 2. Views per day (for a chart)
--    select * from analytics_daily;
create or replace view public.analytics_daily as
select
  date_trunc('day', created_at)::date                as day,
  count(*) filter (where event = 'page_view')        as views,
  count(distinct visitor_hash)                       as unique_visitors
from public.portfolio_views
group by 1
order by 1 desc;

-- 3. Which projects people actually read
--    select * from analytics_projects;
create or replace view public.analytics_projects as
select project, count(*) as opens, max(created_at) as last_opened
from public.portfolio_views
where event = 'project_open' and project is not null
group by project
order by opens desc;

-- 4. Where visitors came from — this is your "who looked" signal.
--    A hit on source='infosys' means that tagged link was opened.
--    select * from analytics_sources;
create or replace view public.analytics_sources as
select
  coalesce(source, referrer, 'direct') as came_from,
  count(*)                             as views,
  count(distinct visitor_hash)         as unique_visitors,
  max(created_at)                      as last_seen
from public.portfolio_views
where event = 'page_view'
group by 1
order by views desc;

-- 5. Audience breakdown
--    select * from analytics_audience;
create or replace view public.analytics_audience as
select timezone, device, browser, os, count(*) as views
from public.portfolio_views
where event = 'page_view'
group by timezone, device, browser, os
order by views desc;

-- 6. Raw recent activity (most useful day to day)
--    select * from analytics_recent;
create or replace view public.analytics_recent as
select created_at, event, project, coalesce(source, referrer, 'direct') as came_from,
       timezone, device, browser, os
from public.portfolio_views
order by created_at desc
limit 100;

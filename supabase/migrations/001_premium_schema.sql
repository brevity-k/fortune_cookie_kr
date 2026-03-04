-- Premium 맞춤 운세 — User Learning System
-- Run this migration in Supabase SQL Editor

-- User profiles
create table public.profiles (
  id uuid references auth.users primary key,
  display_name text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'premium')),
  subscription_expires_at timestamptz,
  active_tracks text[] default '{}',
  created_at timestamptz default now()
);

-- Chart data (server-side, cross-device)
create table public.user_charts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  track text not null check (track in ('saju', 'astro')),
  chart_data jsonb not null,
  birth_info jsonb not null,
  created_at timestamptz default now(),
  unique(user_id, track)
);

-- User context: accumulated life stories, concerns, events
create table public.user_context (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  content text not null,
  context_type text not null,
  topic text,
  created_at timestamptz default now()
);

-- Generated fortune cache (one per category per day)
create table public.daily_fortunes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  track text not null check (track in ('saju', 'astro')),
  fortune_date date not null,
  category text not null,
  content jsonb not null,
  context_snapshot text[],
  created_at timestamptz default now(),
  unique(user_id, track, fortune_date, category)
);

-- RLS policies (all tables: users can only access their own data)
alter table public.profiles enable row level security;
alter table public.user_charts enable row level security;
alter table public.user_context enable row level security;
alter table public.daily_fortunes enable row level security;

create policy "own_profile" on public.profiles for all using (auth.uid() = id);
create policy "own_charts" on public.user_charts for all using (auth.uid() = user_id);
create policy "own_context" on public.user_context for all using (auth.uid() = user_id);
create policy "own_fortunes" on public.daily_fortunes for all using (auth.uid() = user_id);

-- Indexes for common queries
create index idx_user_charts_user_track on public.user_charts(user_id, track);
create index idx_user_context_user on public.user_context(user_id, created_at desc);
create index idx_daily_fortunes_lookup on public.daily_fortunes(user_id, track, fortune_date, category);

-- ============================================================
-- UGC Studio: Portfolio, Training Progress & Affiliates
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. PORTFOLIO ITEMS
create table if not exists portfolio_items (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references creator_profiles(id) on delete cascade not null,
  type text not null check (type in ('video', 'image', 'link')),
  title text not null,
  url text not null,
  brand text,
  description text,
  created_at timestamptz default now()
);

alter table portfolio_items enable row level security;

drop policy if exists "Creators can manage own portfolio" on portfolio_items;
create policy "Creators can manage own portfolio" on portfolio_items
  for all using (
    creator_id in (
      select id from creator_profiles where user_id = auth.uid()
    )
  );

drop policy if exists "Public can view portfolio" on portfolio_items;
create policy "Public can view portfolio" on portfolio_items
  for select using (true);


-- 2. LESSON PROGRESS
create table if not exists lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id integer not null,
  lesson_id integer not null,
  completed_at timestamptz default now(),
  unique(user_id, module_id, lesson_id)
);

alter table lesson_progress enable row level security;

drop policy if exists "Users can manage own lesson progress" on lesson_progress;
create policy "Users can manage own lesson progress" on lesson_progress
  for all using (user_id = auth.uid());


-- 3. REFERRAL CODE on creator_profiles
alter table creator_profiles add column if not exists referral_code text unique;

-- Generate codes for existing creators
update creator_profiles
set referral_code = upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
where referral_code is null;


-- 4. REFERRALS TABLE
create table if not exists referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references creator_profiles(id) on delete cascade not null,
  referred_user_id uuid references auth.users(id) not null,
  status text default 'pending' check (status in ('pending', 'active', 'paid')),
  commission_cents integer default 0,
  plan text,
  created_at timestamptz default now(),
  unique(referred_user_id)
);

alter table referrals enable row level security;

drop policy if exists "Creators can view own referrals" on referrals;
create policy "Creators can view own referrals" on referrals
  for select using (
    referrer_id in (
      select id from creator_profiles where user_id = auth.uid()
    )
  );

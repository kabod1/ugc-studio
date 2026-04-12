-- Outreach prospects: brands and creators the admin wants to recruit
create table if not exists outreach_prospects (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  email              text not null unique,
  company            text,
  type               text not null check (type in ('brand', 'creator')),
  status             text not null default 'new' check (status in ('new', 'contacted', 'replied', 'onboarded', 'declined')),
  notes              text,
  source             text,          -- e.g. "Instagram", "LinkedIn", "referral"
  website            text,
  instagram          text,
  tiktok             text,
  emails_sent        integer not null default 0,
  last_contacted_at  timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Outreach email history: one row per email sent to a prospect
create table if not exists outreach_emails (
  id           uuid primary key default gen_random_uuid(),
  prospect_id  uuid not null references outreach_prospects(id) on delete cascade,
  subject      text not null,
  message      text not null,
  sent_by      uuid,               -- admin user id
  sent_at      timestamptz not null default now()
);

-- Indexes
create index if not exists outreach_prospects_type_idx   on outreach_prospects(type);
create index if not exists outreach_prospects_status_idx on outreach_prospects(status);
create index if not exists outreach_emails_prospect_idx  on outreach_emails(prospect_id);

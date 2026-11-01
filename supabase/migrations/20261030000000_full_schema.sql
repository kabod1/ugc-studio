-- ============================================================
-- UGC Studio - Full database schema (rebuild)
--
-- Reconstructed from every query in the codebase (tables, columns,
-- filters, embeds, upserts). Run once on a NEW, empty Supabase project:
--   Dashboard > SQL Editor > New query > paste this file > Run
--
-- Design notes
-- * Status / tier / role columns are TEXT, not enums: the app writes values
--   (e.g. tiers starter/growth/scale/pro, payment status escrow/completed)
--   that the old enums rejected.
-- * Admin checks go through is_admin() (SECURITY DEFINER) so policies never
--   query profiles under RLS - this removes the old infinite-recursion bug.
-- * Ownership helpers are SECURITY DEFINER for the same reason.
-- ============================================================

-- ============================================================
-- TABLES
-- ============================================================

-- profiles (1:1 with auth.users, created by trigger on signup)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'brand' CHECK (role IN ('brand', 'creator', 'admin')),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  photo_url TEXT,
  company_name TEXT,
  phone TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  email_preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT,
  portfolio_url TEXT,
  date_of_birth DATE,
  age_verified BOOLEAN DEFAULT FALSE,
  country TEXT,
  city TEXT,
  location TEXT,
  languages TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  content_types TEXT[] DEFAULT '{}',
  tiktok_handle TEXT,
  tiktok_followers INTEGER DEFAULT 0,
  tiktok_avg_views INTEGER DEFAULT 0,
  instagram_handle TEXT,
  instagram_followers INTEGER DEFAULT 0,
  youtube_handle TEXT,
  youtube_subscribers INTEGER DEFAULT 0,
  base_rate_cents INTEGER DEFAULT 0,
  hourly_rate_cents INTEGER,
  currency TEXT DEFAULT 'USD',
  ai_match_score REAL DEFAULT 0,
  platform_rating REAL DEFAULT 0,
  total_campaigns_completed INTEGER DEFAULT 0,
  total_earnings_cents BIGINT DEFAULT 0,
  tax_form_type TEXT,
  tax_form_submitted BOOLEAN DEFAULT FALSE,
  tax_form_url TEXT,
  tax_form_uploaded_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  referral_code TEXT UNIQUE DEFAULT upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  stripe_connect_account_id TEXT,
  stripe_connect_onboarded BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_stripe_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL DEFAULT 'My Brand',
  name TEXT,
  website TEXT,
  industry TEXT,
  logo_url TEXT,
  brand_guidelines_url TEXT,
  description TEXT,
  brand_colors TEXT[] DEFAULT '{}',
  brand_fonts TEXT[] DEFAULT '{}',
  tone_of_voice TEXT,
  stripe_customer_id TEXT,
  stripe_connect_account_id TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_stripe_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  brief_objective TEXT,
  brief_deliverables JSONB DEFAULT '[]',
  brief_dos TEXT,
  brief_donts TEXT,
  brief_examples TEXT[] DEFAULT '{}',
  brief_mood_board_urls TEXT[] DEFAULT '{}',
  content_types TEXT[] DEFAULT '{}',
  required_platforms TEXT[] DEFAULT '{}',
  target_audience TEXT,
  age_range TEXT,
  gender_preference TEXT,
  location_requirements TEXT[] DEFAULT '{}',
  language_requirements TEXT[] DEFAULT '{}',
  min_followers INTEGER DEFAULT 0,
  budget_cents INTEGER NOT NULL DEFAULT 0,
  budget_per_creator_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  max_creators INTEGER DEFAULT 10,
  application_deadline TIMESTAMPTZ,
  content_deadline TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  usage_rights TEXT DEFAULT 'non_exclusive',
  rights_duration_days INTEGER DEFAULT 90,
  -- Read-only mirrors some queries select; kept in sync by trigger
  brief TEXT,
  deadline TIMESTAMPTZ,
  budget INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.campaign_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  pitch TEXT,
  proposed_rate_cents INTEGER,
  proposed_deliverables JSONB DEFAULT '[]',
  ai_match_score REAL DEFAULT 0,
  ai_match_reasons JSONB DEFAULT '[]',
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (campaign_id, creator_id)
);

CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft',
  terms JSONB NOT NULL DEFAULT '{}',
  usage_rights TEXT DEFAULT 'non_exclusive',
  rights_duration_days INTEGER DEFAULT 90,
  rights_territories TEXT[] DEFAULT '{"worldwide"}',
  total_amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  deliverables JSONB DEFAULT '[]',
  deadlines JSONB DEFAULT '{}',
  signed_by_brand_at TIMESTAMPTZ,
  signed_by_creator_at TIMESTAMPTZ,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.content_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  -- No FK on application_id: a second path to campaigns would make the
  -- campaigns(...) embed ambiguous for PostgREST.
  application_id UUID,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  version INTEGER DEFAULT 1,
  parent_submission_id UUID REFERENCES public.content_submissions(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  content_type TEXT DEFAULT 'video',
  file_url TEXT,
  file_type TEXT,
  file_size_bytes BIGINT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  quality_score REAL,
  ai_quality_score REAL,
  ai_quality_feedback JSONB DEFAULT '{}',
  brand_feedback TEXT,
  brand_rating INTEGER,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- The API writes user_id/content; older helpers use author_id/comment.
-- Only user_id has an FK so the profiles(...) embed is unambiguous;
-- a trigger keeps the pairs in sync.
CREATE TABLE public.content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.content_submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_id UUID,
  content TEXT,
  comment TEXT,
  timestamp_seconds REAL,
  x_position REAL,
  y_position REAL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No FK on application_id/contract_id for the same embed-ambiguity reason
-- (contracts also references campaigns/brands/creator_profiles).
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID,
  application_id UUID,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  amount_cents INTEGER NOT NULL DEFAULT 0,
  platform_fee_cents INTEGER DEFAULT 0,
  creator_payout_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  is_bonus BOOLEAN DEFAULT FALSE,
  bonus_reason TEXT,
  escrow_released_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.creator_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  stripe_payout_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- The Stripe webhook upserts on stripe_subscription_id without brand_id/tier
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  tier TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.campaign_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (campaign_id, date)
);

CREATE TABLE public.ai_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('uploaded', 'virtual')),
  avatar_url TEXT NOT NULL,
  voice_id TEXT,
  personality TEXT,
  style_data JSONB DEFAULT '{}',
  generation_quality TEXT DEFAULT 'standard' CHECK (generation_quality IN ('standard', 'premium')),
  heygen_avatar_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ugc_video_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  ai_influencer_id UUID REFERENCES public.ai_influencers(id) ON DELETE SET NULL,
  generation_quality TEXT DEFAULT 'standard',
  status TEXT DEFAULT 'pending',
  product_image_url TEXT,
  generated_image_url TEXT,
  audio_url TEXT,
  video_url TEXT,
  caption TEXT,
  tts_script TEXT,
  ai_analysis JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('video', 'image', 'link')),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, module_id, lesson_id)
);

CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paid')),
  commission_cents INTEGER DEFAULT 0,
  plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No FK on user_id: the log must survive account deletion
CREATE TABLE public.gdpr_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.manual_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  plan TEXT NOT NULL,
  tier TEXT,
  role TEXT,
  method TEXT NOT NULL,
  billing TEXT,
  amount TEXT,
  reference TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.outreach_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  type TEXT NOT NULL CHECK (type IN ('brand', 'creator')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'replied', 'onboarded', 'declined')),
  notes TEXT,
  source TEXT,
  website TEXT,
  instagram TEXT,
  tiktok TEXT,
  emails_sent INTEGER NOT NULL DEFAULT 0,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.outreach_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES public.outreach_prospects(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_by UUID,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_creator_profiles_categories ON public.creator_profiles USING GIN (categories);
CREATE INDEX idx_campaigns_brand ON public.campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_applications_campaign ON public.campaign_applications(campaign_id);
CREATE INDEX idx_applications_creator ON public.campaign_applications(creator_id);
CREATE INDEX idx_contracts_campaign ON public.contracts(campaign_id);
CREATE INDEX idx_contracts_creator ON public.contracts(creator_id);
CREATE INDEX idx_contracts_brand ON public.contracts(brand_id);
CREATE INDEX idx_submissions_campaign ON public.content_submissions(campaign_id);
CREATE INDEX idx_submissions_creator ON public.content_submissions(creator_id);
CREATE INDEX idx_comments_submission ON public.content_comments(submission_id);
CREATE INDEX idx_payments_brand ON public.payments(brand_id);
CREATE INDEX idx_payments_creator ON public.payments(creator_id);
CREATE INDEX idx_payments_campaign ON public.payments(campaign_id);
CREATE INDEX idx_payments_intent ON public.payments(stripe_payment_intent_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_analytics_campaign_date ON public.campaign_analytics(campaign_id, date);
CREATE INDEX idx_ai_influencers_brand ON public.ai_influencers(brand_id);
CREATE INDEX idx_ugc_jobs_brand ON public.ugc_video_jobs(brand_id, created_at);
CREATE INDEX idx_ugc_jobs_status ON public.ugc_video_jobs(status);
CREATE INDEX idx_portfolio_creator ON public.portfolio_items(creator_id);
CREATE INDEX idx_team_members_brand ON public.team_members(brand_id);
CREATE INDEX idx_conversations_brand ON public.conversations(brand_id);
CREATE INDEX idx_conversations_creator ON public.conversations(creator_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX idx_gdpr_audit_logs_user ON public.gdpr_audit_logs(user_id);
CREATE INDEX idx_outreach_prospects_type ON public.outreach_prospects(type);
CREATE INDEX idx_outreach_prospects_status ON public.outreach_prospects(status);
CREATE INDEX idx_outreach_emails_prospect ON public.outreach_emails(prospect_id);

-- ============================================================
-- HELPER FUNCTIONS (SECURITY DEFINER: bypass RLS, no recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      -- mirrors ADMIN_EMAILS in lib/constants.ts
      OR lower(coalesce(auth.jwt() ->> 'email', '')) IN ('townshub1@gmail.com')
$$;

CREATE OR REPLACE FUNCTION public.owns_brand(p_brand_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.brands WHERE id = p_brand_id AND user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.owns_creator(p_creator_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.creator_profiles WHERE id = p_creator_id AND user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.owns_campaign(p_campaign_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campaigns c JOIN public.brands b ON b.id = c.brand_id
    WHERE c.id = p_campaign_id AND b.user_id = auth.uid()
  )
$$;

-- A creator who applied to a campaign can still read it after it leaves 'active'
CREATE OR REPLACE FUNCTION public.applied_to_campaign(p_campaign_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campaign_applications a JOIN public.creator_profiles cp ON cp.id = a.creator_id
    WHERE a.campaign_id = p_campaign_id AND cp.user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION public.in_conversation(p_conversation_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = p_conversation_id
      AND (public.owns_brand(c.brand_id) OR public.owns_creator(c.creator_id))
  )
$$;

-- True for end-user requests (anon key / user JWT) that are not admins.
-- Service-role requests and the SQL editor (no JWT) return false.
CREATE OR REPLACE FUNCTION public.is_restricted_user()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(auth.role(), '') IN ('anon', 'authenticated') AND NOT public.is_admin()
$$;

-- ============================================================
-- TRIGGER FUNCTIONS
-- ============================================================

-- Create profile + brand/creator row on signup. Role from signup metadata is
-- only ever 'creator' or 'brand' - never 'admin'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role TEXT := CASE WHEN NEW.raw_user_meta_data ->> 'role' = 'creator' THEN 'creator' ELSE 'brand' END;
  v_name TEXT := coalesce(NEW.raw_user_meta_data ->> 'full_name', '');
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company_name, role)
  VALUES (NEW.id, NEW.email, v_name, NEW.raw_user_meta_data ->> 'company_name', v_role)
  ON CONFLICT (id) DO NOTHING;

  IF v_role = 'creator' THEN
    INSERT INTO public.creator_profiles (user_id, display_name)
    VALUES (NEW.id, coalesce(nullif(v_name, ''), 'Creator'))
    ON CONFLICT (user_id) DO NOTHING;
  ELSE
    INSERT INTO public.brands (user_id, company_name)
    VALUES (NEW.id, coalesce(nullif(NEW.raw_user_meta_data ->> 'company_name', ''), nullif(v_name, ''), 'My Brand'))
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_campaign_compat()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.brief := nullif(concat_ws(E'\n',
    'Objective: ' || NEW.brief_objective,
    'Do: ' || NEW.brief_dos,
    'Don''t: ' || NEW.brief_donts), '');
  NEW.deadline := NEW.content_deadline;
  NEW.budget := NEW.budget_cents;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_comment_fields()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.user_id := coalesce(NEW.user_id, NEW.author_id);
  NEW.author_id := coalesce(NEW.author_id, NEW.user_id);
  NEW.content := coalesce(NEW.content, NEW.comment);
  NEW.comment := coalesce(NEW.comment, NEW.content);
  RETURN NEW;
END;
$$;

-- Users may edit their own rows, but not privilege/billing fields.
-- Those only change via the service role (API routes, Stripe webhook) or an admin.
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF public.is_restricted_user() THEN
    NEW.role := OLD.role;
    NEW.is_verified := OLD.is_verified;
    NEW.is_active := OLD.is_active;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_creator_fields()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF public.is_restricted_user() THEN
    IF TG_OP = 'UPDATE' THEN
      NEW.user_id := OLD.user_id;
      NEW.is_verified := OLD.is_verified;
      NEW.verified_at := OLD.verified_at;
      NEW.is_featured := OLD.is_featured;
      NEW.platform_rating := OLD.platform_rating;
      NEW.total_campaigns_completed := OLD.total_campaigns_completed;
      NEW.total_earnings_cents := OLD.total_earnings_cents;
      NEW.referral_code := OLD.referral_code;
      NEW.stripe_connect_account_id := OLD.stripe_connect_account_id;
      NEW.stripe_connect_onboarded := OLD.stripe_connect_onboarded;
      NEW.stripe_customer_id := OLD.stripe_customer_id;
      NEW.subscription_tier := OLD.subscription_tier;
      NEW.subscription_stripe_id := OLD.subscription_stripe_id;
      NEW.subscription_expires_at := OLD.subscription_expires_at;
    ELSE
      NEW.is_verified := FALSE;
      NEW.verified_at := NULL;
      NEW.is_featured := FALSE;
      NEW.subscription_tier := 'free';
      NEW.subscription_stripe_id := NULL;
      NEW.stripe_connect_onboarded := FALSE;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_brand_fields()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF public.is_restricted_user() THEN
    IF TG_OP = 'UPDATE' THEN
      NEW.user_id := OLD.user_id;
      NEW.stripe_customer_id := OLD.stripe_customer_id;
      NEW.stripe_connect_account_id := OLD.stripe_connect_account_id;
      NEW.subscription_tier := OLD.subscription_tier;
      NEW.subscription_stripe_id := OLD.subscription_stripe_id;
      NEW.subscription_expires_at := OLD.subscription_expires_at;
    ELSE
      NEW.subscription_tier := 'free';
      NEW.subscription_stripe_id := NULL;
      NEW.subscription_expires_at := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER sync_campaign_compat BEFORE INSERT OR UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.sync_campaign_compat();
CREATE TRIGGER sync_comment_fields BEFORE INSERT OR UPDATE ON public.content_comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_comment_fields();

CREATE TRIGGER protect_profile_fields BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();
CREATE TRIGGER protect_creator_fields BEFORE INSERT OR UPDATE ON public.creator_profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_creator_fields();
CREATE TRIGGER protect_brand_fields BEFORE INSERT OR UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.protect_brand_fields();

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'creator_profiles', 'brands', 'campaigns', 'campaign_applications',
    'contracts', 'content_submissions', 'payments', 'subscriptions', 'ai_influencers',
    'ugc_video_jobs', 'team_members', 'outreach_prospects'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()', t);
  END LOOP;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- (API routes using the service-role key bypass all of this)
-- ============================================================
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Admins manage all" ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;
END;
$$;

-- profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- creator_profiles: public directory, owner writes
CREATE POLICY "Public view creators" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Creators insert own" ON public.creator_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Creators update own" ON public.creator_profiles FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Creators delete own" ON public.creator_profiles FOR DELETE USING (user_id = auth.uid());

-- brands: public directory, owner writes
CREATE POLICY "Public view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Brand owners insert own" ON public.brands FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Brand owners update own" ON public.brands FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Brand owners delete own" ON public.brands FOR DELETE USING (user_id = auth.uid());

-- campaigns
CREATE POLICY "Brand manages own campaigns" ON public.campaigns FOR ALL
  USING (public.owns_brand(brand_id)) WITH CHECK (public.owns_brand(brand_id));
CREATE POLICY "Anyone views active campaigns" ON public.campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Applicants view their campaigns" ON public.campaigns FOR SELECT USING (public.applied_to_campaign(id));

-- campaign_applications
CREATE POLICY "Creator manages own applications" ON public.campaign_applications FOR ALL
  USING (public.owns_creator(creator_id)) WITH CHECK (public.owns_creator(creator_id));
CREATE POLICY "Brand views campaign applications" ON public.campaign_applications FOR SELECT USING (public.owns_campaign(campaign_id));
CREATE POLICY "Brand updates campaign applications" ON public.campaign_applications FOR UPDATE
  USING (public.owns_campaign(campaign_id)) WITH CHECK (public.owns_campaign(campaign_id));

-- contracts
CREATE POLICY "Brand manages own contracts" ON public.contracts FOR ALL
  USING (public.owns_brand(brand_id)) WITH CHECK (public.owns_brand(brand_id));
CREATE POLICY "Creator views own contracts" ON public.contracts FOR SELECT USING (public.owns_creator(creator_id));
CREATE POLICY "Creator signs own contracts" ON public.contracts FOR UPDATE
  USING (public.owns_creator(creator_id)) WITH CHECK (public.owns_creator(creator_id));

-- content_submissions
CREATE POLICY "Creator manages own submissions" ON public.content_submissions FOR ALL
  USING (public.owns_creator(creator_id)) WITH CHECK (public.owns_creator(creator_id));
CREATE POLICY "Brand views campaign submissions" ON public.content_submissions FOR SELECT USING (public.owns_campaign(campaign_id));
CREATE POLICY "Brand updates campaign submissions" ON public.content_submissions FOR UPDATE
  USING (public.owns_campaign(campaign_id)) WITH CHECK (public.owns_campaign(campaign_id));

-- content_comments: visible to whoever can see the submission
CREATE POLICY "Participants view comments" ON public.content_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.content_submissions s WHERE s.id = submission_id)
);
CREATE POLICY "Participants add comments" ON public.content_comments FOR INSERT WITH CHECK (
  coalesce(user_id, author_id) = auth.uid()
  AND EXISTS (SELECT 1 FROM public.content_submissions s WHERE s.id = submission_id)
);
CREATE POLICY "Authors update own comments" ON public.content_comments FOR UPDATE
  USING (coalesce(user_id, author_id) = auth.uid()) WITH CHECK (coalesce(user_id, author_id) = auth.uid());
CREATE POLICY "Authors delete own comments" ON public.content_comments FOR DELETE USING (coalesce(user_id, author_id) = auth.uid());

-- payments
CREATE POLICY "Brand views own payments" ON public.payments FOR SELECT USING (public.owns_brand(brand_id));
CREATE POLICY "Brand creates own payments" ON public.payments FOR INSERT WITH CHECK (public.owns_brand(brand_id));
CREATE POLICY "Creator views own payments" ON public.payments FOR SELECT USING (public.owns_creator(creator_id));

-- creator_payouts
CREATE POLICY "Creator views own payouts" ON public.creator_payouts FOR SELECT USING (public.owns_creator(creator_id));

-- subscriptions
CREATE POLICY "Brand views own subscription" ON public.subscriptions FOR SELECT USING (public.owns_brand(brand_id));

-- analytics
CREATE POLICY "Brand views own analytics" ON public.analytics_events FOR SELECT USING (public.owns_brand(brand_id));
CREATE POLICY "Brand views campaign analytics" ON public.campaign_analytics FOR SELECT USING (public.owns_campaign(campaign_id));

-- ai_influencers
CREATE POLICY "Brand manages own influencers" ON public.ai_influencers FOR ALL
  USING (public.owns_brand(brand_id)) WITH CHECK (public.owns_brand(brand_id));

-- ugc_video_jobs
CREATE POLICY "Brand manages own ugc jobs" ON public.ugc_video_jobs FOR ALL
  USING (public.owns_brand(brand_id)) WITH CHECK (public.owns_brand(brand_id));
CREATE POLICY "Creator views own ugc jobs" ON public.ugc_video_jobs FOR SELECT USING (public.owns_creator(creator_id));

-- notifications
CREATE POLICY "User manages own notifications" ON public.notifications FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- platform_settings
CREATE POLICY "Public read settings" ON public.platform_settings FOR SELECT USING (true);

-- portfolio_items
CREATE POLICY "Public view portfolio" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Creators manage own portfolio" ON public.portfolio_items FOR ALL
  USING (public.owns_creator(creator_id)) WITH CHECK (public.owns_creator(creator_id));

-- lesson_progress
CREATE POLICY "Users manage own lesson progress" ON public.lesson_progress FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- referrals
CREATE POLICY "Creators view own referrals" ON public.referrals FOR SELECT USING (public.owns_creator(referrer_id));

-- team_members
CREATE POLICY "Brand manages own team" ON public.team_members FOR ALL
  USING (public.owns_brand(brand_id)) WITH CHECK (public.owns_brand(brand_id));

-- conversations / messages
CREATE POLICY "Participants view conversations" ON public.conversations FOR SELECT
  USING (public.owns_brand(brand_id) OR public.owns_creator(creator_id));
CREATE POLICY "Participants start conversations" ON public.conversations FOR INSERT
  WITH CHECK (public.owns_brand(brand_id) OR public.owns_creator(creator_id));
CREATE POLICY "Participants update conversations" ON public.conversations FOR UPDATE
  USING (public.owns_brand(brand_id) OR public.owns_creator(creator_id))
  WITH CHECK (public.owns_brand(brand_id) OR public.owns_creator(creator_id));
CREATE POLICY "Participants view messages" ON public.messages FOR SELECT USING (public.in_conversation(conversation_id));
CREATE POLICY "Participants send messages" ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND public.in_conversation(conversation_id));
CREATE POLICY "Participants mark messages read" ON public.messages FOR UPDATE
  USING (public.in_conversation(conversation_id)) WITH CHECK (public.in_conversation(conversation_id));

-- gdpr_audit_logs
CREATE POLICY "Users view own audit log" ON public.gdpr_audit_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users write own audit log" ON public.gdpr_audit_logs FOR INSERT WITH CHECK (user_id = auth.uid());

-- outreach_prospects, outreach_emails, manual_payment_requests: admin only
-- (covered by "Admins manage all"; API routes use the service role)

-- ============================================================
-- STORAGE (avatar uploads; the route also creates it if missing)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ai-influencer-avatars', 'ai-influencer-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED
-- ============================================================
INSERT INTO public.platform_settings (key, value) VALUES
  ('platform_fee_percent', '15'),
  ('subscription_prices', '{"starter": 1900, "growth": 8700, "scale": 24300, "pro": 1999}'),
  ('max_upload_size_mb', '500'),
  ('supported_content_types', '["video", "image", "story", "reel", "tiktok", "review", "unboxing", "testimonial"]')
ON CONFLICT (key) DO NOTHING;

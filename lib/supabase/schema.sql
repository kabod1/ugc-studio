-- ============================================================
-- UGC Studio - Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ENUMS
CREATE TYPE user_role AS ENUM ('brand', 'creator', 'admin');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE content_status AS ENUM ('pending', 'in_progress', 'submitted', 'revision_requested', 'approved', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'in_escrow', 'released', 'refunded', 'failed');
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'signed', 'expired', 'terminated');
CREATE TYPE subscription_tier AS ENUM ('free', 'brand', 'agency', 'enterprise');
CREATE TYPE rights_type AS ENUM ('exclusive', 'non_exclusive', 'limited', 'perpetual');
CREATE TYPE content_type AS ENUM ('video', 'image', 'story', 'reel', 'tiktok', 'review', 'unboxing', 'testimonial');

-- ============================================================
-- profiles (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'brand',
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- creator_profiles
-- ============================================================
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  portfolio_url TEXT,
  date_of_birth DATE,
  age_verified BOOLEAN DEFAULT FALSE,
  country TEXT,
  city TEXT,
  languages TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  content_types content_type[] DEFAULT '{}',
  tiktok_handle TEXT,
  tiktok_followers INTEGER DEFAULT 0,
  tiktok_avg_views INTEGER DEFAULT 0,
  instagram_handle TEXT,
  instagram_followers INTEGER DEFAULT 0,
  youtube_handle TEXT,
  youtube_subscribers INTEGER DEFAULT 0,
  base_rate_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  ai_match_score REAL DEFAULT 0,
  platform_rating REAL DEFAULT 0,
  total_campaigns_completed INTEGER DEFAULT 0,
  total_earnings_cents BIGINT DEFAULT 0,
  tax_form_type TEXT,
  tax_form_submitted BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  stripe_connect_account_id TEXT,
  stripe_connect_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- brands
-- ============================================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  logo_url TEXT,
  brand_guidelines_url TEXT,
  description TEXT,
  stripe_customer_id TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_stripe_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- campaigns
-- ============================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status campaign_status DEFAULT 'draft',
  brief_objective TEXT,
  brief_deliverables JSONB DEFAULT '[]',
  brief_dos TEXT,
  brief_donts TEXT,
  brief_examples TEXT[] DEFAULT '{}',
  brief_mood_board_urls TEXT[] DEFAULT '{}',
  content_types content_type[] DEFAULT '{}',
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
  usage_rights rights_type DEFAULT 'non_exclusive',
  rights_duration_days INTEGER DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- campaign_applications
-- ============================================================
CREATE TABLE campaign_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  pitch TEXT,
  proposed_rate_cents INTEGER,
  proposed_deliverables JSONB DEFAULT '[]',
  ai_match_score REAL DEFAULT 0,
  ai_match_reasons JSONB DEFAULT '[]',
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, creator_id)
);

-- ============================================================
-- contracts
-- ============================================================
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  status contract_status DEFAULT 'draft',
  terms JSONB NOT NULL DEFAULT '{}',
  usage_rights rights_type DEFAULT 'non_exclusive',
  rights_duration_days INTEGER DEFAULT 90,
  rights_territories TEXT[] DEFAULT '{"worldwide"}',
  total_amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  deliverables JSONB DEFAULT '[]',
  deadlines JSONB DEFAULT '{}',
  signed_by_brand_at TIMESTAMPTZ,
  signed_by_creator_at TIMESTAMPTZ,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- content_submissions
-- ============================================================
CREATE TABLE content_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id),
  status content_status DEFAULT 'pending',
  version INTEGER DEFAULT 1,
  parent_submission_id UUID REFERENCES content_submissions(id),
  title TEXT,
  description TEXT,
  content_type content_type NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size_bytes BIGINT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  ai_quality_score REAL,
  ai_quality_feedback JSONB DEFAULT '{}',
  brand_feedback TEXT,
  brand_rating INTEGER,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- content_comments
-- ============================================================
CREATE TABLE content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES content_submissions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  comment TEXT NOT NULL,
  timestamp_seconds REAL,
  x_position REAL,
  y_position REAL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- payments
-- ============================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  brand_id UUID NOT NULL REFERENCES brands(id),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  status payment_status DEFAULT 'pending',
  amount_cents INTEGER NOT NULL,
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

-- ============================================================
-- creator_payouts
-- ============================================================
CREATE TABLE creator_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  stripe_account_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  stripe_payout_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- subscriptions
-- ============================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- analytics_events
-- ============================================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  brand_id UUID REFERENCES brands(id),
  creator_id UUID REFERENCES creator_profiles(id),
  campaign_id UUID REFERENCES campaigns(id),
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- campaign_analytics (aggregated)
-- ============================================================
CREATE TABLE campaign_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

-- ============================================================
-- ugc_video_jobs (for n8n UGC video generation workflow)
-- ============================================================
CREATE TABLE ugc_video_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  creator_id UUID REFERENCES creator_profiles(id),
  brand_id UUID REFERENCES brands(id),
  status TEXT DEFAULT 'pending',
  product_image_url TEXT NOT NULL,
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

-- ============================================================
-- notifications
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- platform_settings
-- ============================================================
CREATE TABLE platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_creator_profiles_user ON creator_profiles(user_id);
CREATE INDEX idx_creator_profiles_categories ON creator_profiles USING GIN(categories);
CREATE INDEX idx_brands_user ON brands(user_id);
CREATE INDEX idx_campaigns_brand ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_applications_campaign ON campaign_applications(campaign_id);
CREATE INDEX idx_applications_creator ON campaign_applications(creator_id);
CREATE INDEX idx_submissions_campaign ON content_submissions(campaign_id);
CREATE INDEX idx_submissions_creator ON content_submissions(creator_id);
CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_analytics_campaign_date ON campaign_analytics(campaign_id, date);
CREATE INDEX idx_ugc_jobs_status ON ugc_video_jobs(status);
CREATE INDEX idx_ugc_jobs_campaign ON ugc_video_jobs(campaign_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ugc_video_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Creator profiles: public read, own write
CREATE POLICY "Public view creators" ON creator_profiles FOR SELECT USING (true);
CREATE POLICY "Creators manage own" ON creator_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins manage creators" ON creator_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Brands
CREATE POLICY "Brand owners manage own" ON brands FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public view brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Admins manage brands" ON brands FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Campaigns
CREATE POLICY "Brand manages own campaigns" ON campaigns FOR ALL USING (
  brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
);
CREATE POLICY "Creators view active campaigns" ON campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Admins manage all campaigns" ON campaigns FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Applications
CREATE POLICY "Creator manages own applications" ON campaign_applications FOR ALL USING (
  creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Brand views campaign applications" ON campaign_applications FOR SELECT USING (
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.user_id = auth.uid())
);
CREATE POLICY "Brand updates applications" ON campaign_applications FOR UPDATE USING (
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.user_id = auth.uid())
);
CREATE POLICY "Admins manage applications" ON campaign_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Contracts
CREATE POLICY "Brand manages own contracts" ON contracts FOR ALL USING (
  brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
);
CREATE POLICY "Creator views own contracts" ON contracts FOR SELECT USING (
  creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Creator signs contracts" ON contracts FOR UPDATE USING (
  creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins manage contracts" ON contracts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Content submissions
CREATE POLICY "Creator manages own submissions" ON content_submissions FOR ALL USING (
  creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Brand views campaign submissions" ON content_submissions FOR SELECT USING (
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.user_id = auth.uid())
);
CREATE POLICY "Brand updates submissions" ON content_submissions FOR UPDATE USING (
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.user_id = auth.uid())
);
CREATE POLICY "Admins manage submissions" ON content_submissions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Comments
CREATE POLICY "Participants view comments" ON content_comments FOR SELECT USING (true);
CREATE POLICY "Auth users create comments" ON content_comments FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors manage own comments" ON content_comments FOR UPDATE USING (author_id = auth.uid());

-- Payments
CREATE POLICY "Brand views own payments" ON payments FOR SELECT USING (
  brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
);
CREATE POLICY "Creator views own payments" ON payments FOR SELECT USING (
  creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Creator payouts
CREATE POLICY "Creator views own payouts" ON creator_payouts FOR SELECT USING (
  creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins manage payouts" ON creator_payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subscriptions
CREATE POLICY "Brand views own subscription" ON subscriptions FOR SELECT USING (
  brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
);
CREATE POLICY "Admins manage subscriptions" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications
CREATE POLICY "User manages own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- Platform settings
CREATE POLICY "Admins manage settings" ON platform_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Public read settings" ON platform_settings FOR SELECT USING (true);

-- UGC video jobs
CREATE POLICY "Brand views own ugc jobs" ON ugc_video_jobs FOR SELECT USING (
  brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
);
CREATE POLICY "Brand creates ugc jobs" ON ugc_video_jobs FOR INSERT WITH CHECK (
  brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
);
CREATE POLICY "Creator views own ugc jobs" ON ugc_video_jobs FOR SELECT USING (
  creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins manage ugc jobs" ON ugc_video_jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Analytics (public read for authorized)
CREATE POLICY "Brand views own analytics" ON analytics_events FOR SELECT USING (
  brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
);
CREATE POLICY "Admins manage analytics" ON analytics_events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Brand views campaign analytics" ON campaign_analytics FOR SELECT USING (
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.user_id = auth.uid())
);
CREATE POLICY "Admins manage campaign analytics" ON campaign_analytics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'brand')
  );

  -- Auto-create brand or creator profile based on role
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'brand') = 'brand' THEN
    INSERT INTO brands (user_id, company_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.raw_user_meta_data->>'full_name', 'My Brand'));
  ELSIF (NEW.raw_user_meta_data->>'role')::user_role = 'creator' THEN
    INSERT INTO creator_profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Creator'));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON creator_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON campaign_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON content_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON ugc_video_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED: Insert default platform settings
-- ============================================================
INSERT INTO platform_settings (key, value) VALUES
  ('platform_fee_percent', '15'),
  ('subscription_prices', '{"brand": 19900, "agency": 49900, "enterprise": 199900}'),
  ('max_upload_size_mb', '500'),
  ('supported_content_types', '["video", "image", "story", "reel", "tiktok", "review", "unboxing", "testimonial"]');

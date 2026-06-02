-- Product Transform Jobs
-- Run this in your Supabase SQL editor

CREATE TABLE product_transform_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('ad_video', 'infographic')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  source_image_url TEXT NOT NULL,
  output_url TEXT,
  style TEXT,
  cta_text TEXT,
  ai_caption TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_product_transform_brand ON product_transform_jobs(brand_id);
CREATE INDEX idx_product_transform_status ON product_transform_jobs(status);

ALTER TABLE product_transform_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brand views own transform jobs" ON product_transform_jobs
  FOR SELECT USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

CREATE POLICY "Brand creates transform jobs" ON product_transform_jobs
  FOR INSERT WITH CHECK (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

CREATE POLICY "Brand deletes own transform jobs" ON product_transform_jobs
  FOR DELETE USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

CREATE POLICY "Admins manage transform jobs" ON product_transform_jobs
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM profiles WHERE email IN ('townshub1@gmail.com'))
  );

-- Product Studio jobs (app/api/product-transform/*).
-- Run after 20261030000000_full_schema.sql. Safe to re-run.

CREATE TABLE IF NOT EXISTS public.product_transform_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('ad_video', 'infographic')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  source_image_url TEXT NOT NULL,
  output_url TEXT,
  style TEXT,
  cta_text TEXT,
  ai_caption TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_product_transform_brand ON public.product_transform_jobs(brand_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_transform_status ON public.product_transform_jobs(status);

ALTER TABLE public.product_transform_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage all" ON public.product_transform_jobs;
CREATE POLICY "Admins manage all" ON public.product_transform_jobs
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Brand views own transform jobs" ON public.product_transform_jobs;
CREATE POLICY "Brand views own transform jobs" ON public.product_transform_jobs
  FOR SELECT USING (public.owns_brand(brand_id));

DROP POLICY IF EXISTS "Brand creates transform jobs" ON public.product_transform_jobs;
CREATE POLICY "Brand creates transform jobs" ON public.product_transform_jobs
  FOR INSERT WITH CHECK (public.owns_brand(brand_id));

-- generate/route.ts marks jobs completed/failed with the user's session,
-- so brands need UPDATE on their own jobs (the original SQL lacked this).
DROP POLICY IF EXISTS "Brand updates own transform jobs" ON public.product_transform_jobs;
CREATE POLICY "Brand updates own transform jobs" ON public.product_transform_jobs
  FOR UPDATE USING (public.owns_brand(brand_id)) WITH CHECK (public.owns_brand(brand_id));

DROP POLICY IF EXISTS "Brand deletes own transform jobs" ON public.product_transform_jobs;
CREATE POLICY "Brand deletes own transform jobs" ON public.product_transform_jobs
  FOR DELETE USING (public.owns_brand(brand_id));

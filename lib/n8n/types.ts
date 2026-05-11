export interface ScrapeParams {
  platform: string
  keywords: string[]
  category?: string
  min_followers?: number
  max_results?: number
}

export interface ScrapeResult {
  creators_found: number
  creators_added: number
  errors: string[]
}

export interface MatchParams {
  campaign_id: string
  brief?: string
  max_matches?: number
}

export interface MatchResult {
  matches: Array<{
    creator_id: string
    score: number
    reasons: string[]
  }>
}

export interface OutreachParams {
  campaign_id: string
  creator_ids: string[]
  template: string
  subject?: string
}

export interface OutreachResult {
  sent: number
  failed: number
  errors: string[]
}

export interface QualityCheckParams {
  submission_id: string
  file_url: string
  brief?: string
  content_type?: string
}

export interface QualityCheckResult {
  score: number
  feedback: {
    technical: string
    compliance: string
    brand_safety: string
  }
  recommendations: string[]
}

export interface PaymentTriggerParams {
  event: string
  contract_id: string
}

export interface PaymentTriggerResult {
  success: boolean
  payment_id?: string
}

export interface UGCVideoParams {
  product_image_url: string
  job_id: string
  callback_url: string
  campaign_id?: string
  brand_id?: string
  avatar_image_url?: string
  generation_quality?: "standard" | "premium"
  heygen_avatar_id?: string
  voice_id?: string
  personality?: string
}

export interface UGCVideoResult {
  job_id: string
  status: string
  video_url?: string
  caption?: string
}

export interface AnalyticsParams {
  campaign_id?: string
  date_from?: string
  date_to?: string
}

export interface AnalyticsResult {
  success: boolean
  records_processed: number
}

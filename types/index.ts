export type UserRole = "brand" | "creator" | "admin"
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled"
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn"
export type ContentStatus = "pending" | "in_progress" | "submitted" | "revision_requested" | "approved" | "rejected"
export type PaymentStatus = "pending" | "in_escrow" | "released" | "refunded" | "failed"
export type ContractStatus = "draft" | "sent" | "signed" | "expired" | "terminated"
export type SubscriptionTier = "free" | "brand" | "agency" | "enterprise"
export type RightsType = "exclusive" | "non_exclusive" | "limited" | "perpetual"
export type ContentType = "video" | "image" | "story" | "reel" | "tiktok" | "review" | "unboxing" | "testimonial"

export interface Profile {
  id: string
  role: UserRole
  email: string
  full_name: string | null
  avatar_url: string | null
  company_name: string | null
  phone: string | null
  timezone: string
  onboarding_completed: boolean
  is_verified: boolean
  is_active: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreatorProfile {
  id: string
  user_id: string
  display_name: string
  bio: string | null
  portfolio_url: string | null
  date_of_birth: string | null
  age_verified: boolean
  country: string | null
  city: string | null
  languages: string[]
  categories: string[]
  content_types: ContentType[]
  tiktok_handle: string | null
  tiktok_followers: number
  tiktok_avg_views: number
  instagram_handle: string | null
  instagram_followers: number
  youtube_handle: string | null
  youtube_subscribers: number
  base_rate_cents: number
  currency: string
  ai_match_score: number
  platform_rating: number
  total_campaigns_completed: number
  total_earnings_cents: number
  tax_form_type: string | null
  tax_form_submitted: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  user_id: string
  company_name: string
  website: string | null
  industry: string | null
  logo_url: string | null
  brand_guidelines_url: string | null
  description: string | null
  stripe_customer_id: string | null
  stripe_connect_account_id: string | null
  subscription_tier: SubscriptionTier
  subscription_stripe_id: string | null
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  brand_id: string
  title: string
  description: string | null
  status: CampaignStatus
  brief_objective: string | null
  brief_deliverables: unknown[]
  brief_dos: string | null
  brief_donts: string | null
  brief_examples: string[]
  brief_mood_board_urls: string[]
  content_types: ContentType[]
  required_platforms: string[]
  target_audience: string | null
  age_range: string | null
  gender_preference: string | null
  location_requirements: string[]
  language_requirements: string[]
  min_followers: number
  budget_cents: number
  budget_per_creator_cents: number
  currency: string
  max_creators: number
  application_deadline: string | null
  content_deadline: string | null
  start_date: string | null
  end_date: string | null
  usage_rights: RightsType
  rights_duration_days: number
  created_at: string
  updated_at: string
  brand?: Brand
  _count?: {
    applications: number
    submissions: number
  }
}

export interface CampaignApplication {
  id: string
  campaign_id: string
  creator_id: string
  status: ApplicationStatus
  pitch: string | null
  proposed_rate_cents: number | null
  proposed_deliverables: unknown[]
  ai_match_score: number
  ai_match_reasons: unknown[]
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string
  updated_at: string
  creator?: CreatorProfile
  campaign?: Campaign
}

export interface Contract {
  id: string
  campaign_id: string
  creator_id: string
  brand_id: string
  status: ContractStatus
  terms: Record<string, unknown>
  usage_rights: RightsType
  rights_duration_days: number
  rights_territories: string[]
  total_amount_cents: number
  currency: string
  deliverables: unknown[]
  deadlines: Record<string, unknown>
  signed_by_brand_at: string | null
  signed_by_creator_at: string | null
  document_url: string | null
  created_at: string
  updated_at: string
}

export interface ContentSubmission {
  id: string
  campaign_id: string
  creator_id: string
  contract_id: string | null
  status: ContentStatus
  version: number
  parent_submission_id: string | null
  title: string | null
  description: string | null
  content_type: ContentType
  file_url: string
  file_type: string | null
  file_size_bytes: number | null
  thumbnail_url: string | null
  duration_seconds: number | null
  ai_quality_score: number | null
  ai_quality_feedback: Record<string, unknown>
  brand_feedback: string | null
  brand_rating: number | null
  approved_at: string | null
  approved_by: string | null
  created_at: string
  updated_at: string
  creator?: CreatorProfile
  campaign?: Campaign
  comments?: ContentComment[]
}

export interface ContentComment {
  id: string
  submission_id: string
  author_id: string
  comment: string
  timestamp_seconds: number | null
  x_position: number | null
  y_position: number | null
  is_resolved: boolean
  created_at: string
  author?: Profile
}

export interface Payment {
  id: string
  contract_id: string
  campaign_id: string
  brand_id: string
  creator_id: string
  status: PaymentStatus
  amount_cents: number
  platform_fee_cents: number
  creator_payout_cents: number
  currency: string
  stripe_payment_intent_id: string | null
  stripe_transfer_id: string | null
  is_bonus: boolean
  bonus_reason: string | null
  escrow_released_at: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  link: string | null
  is_read: boolean
  created_at: string
}

export interface CampaignAnalytics {
  id: string
  campaign_id: string
  date: string
  views: number
  clicks: number
  conversions: number
  revenue_cents: number
  engagement_rate: number
  data: Record<string, unknown>
  created_at: string
}

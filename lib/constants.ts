export const CONTENT_TYPES = [
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
  { value: "story", label: "Story" },
  { value: "reel", label: "Reel" },
  { value: "tiktok", label: "TikTok" },
  { value: "review", label: "Review" },
  { value: "unboxing", label: "Unboxing" },
  { value: "testimonial", label: "Testimonial" },
] as const

export const CATEGORIES = [
  "Beauty", "Fashion", "Fitness", "Food", "Gaming", "Health",
  "Home", "Lifestyle", "Music", "Pets", "Sports", "Tech",
  "Travel", "Education", "Finance", "Entertainment",
] as const

export const PLATFORMS = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "facebook", label: "Facebook" },
] as const

export const SUBSCRIPTION_TIERS = {
  free: { name: "Free", price: 0, campaigns: 1, seatsPerCampaign: 5, teamSeats: 1, ugcVideosPerMonth: 2 },
  starter: { name: "Starter", price: 6700, campaigns: 5, seatsPerCampaign: 20, teamSeats: 1, ugcVideosPerMonth: 10 },
  growth: { name: "Growth", price: 18700, campaigns: 10, seatsPerCampaign: 50, teamSeats: 3, ugcVideosPerMonth: 50 },
  scale: { name: "Scale", price: 38700, campaigns: -1, seatsPerCampaign: -1, teamSeats: -1, ugcVideosPerMonth: -1 },
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS

export const CREATOR_TIERS = {
  free: { name: "Free", price: 0, applicationsPerMonth: 1 },
  pro: { name: "Creator Pro", price: 1999, applicationsPerMonth: -1 },
} as const

export type CreatorTier = keyof typeof CREATOR_TIERS

export const CAMPAIGN_STATUSES = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  active: { label: "Active", color: "bg-green-100 text-green-800" },
  paused: { label: "Paused", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
} as const

export const CONTENT_STATUSES = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-800" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  submitted: { label: "Submitted", color: "bg-yellow-100 text-yellow-800" },
  revision_requested: { label: "Revision Requested", color: "bg-orange-100 text-orange-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
} as const

export const PAYMENT_STATUSES = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-800" },
  in_escrow: { label: "In Escrow", color: "bg-blue-100 text-blue-800" },
  released: { label: "Released", color: "bg-green-100 text-green-800" },
  refunded: { label: "Refunded", color: "bg-yellow-100 text-yellow-800" },
  failed: { label: "Failed", color: "bg-red-100 text-red-800" },
} as const

export const PLATFORM_FEE_PERCENT = 15

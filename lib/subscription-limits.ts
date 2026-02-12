import { SUBSCRIPTION_TIERS, CREATOR_TIERS } from "@/lib/constants"
import type { SupabaseClient } from "@supabase/supabase-js"

type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS
type CreatorTier = keyof typeof CREATOR_TIERS

interface LimitResult {
  allowed: boolean
  current: number
  limit: number
  reason?: string
}

export async function canCreateCampaign(
  supabase: SupabaseClient,
  brandId: string
): Promise<LimitResult> {
  const { data: brand } = await supabase
    .from("brands")
    .select("subscription_tier")
    .eq("id", brandId)
    .single()

  const tier = (brand?.subscription_tier || "free") as SubscriptionTier
  const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
  const maxCampaigns = tierConfig.campaigns

  // -1 means unlimited
  if (maxCampaigns === -1) {
    return { allowed: true, current: 0, limit: -1 }
  }

  const { count } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brandId)
    .in("status", ["active", "draft"])

  const current = count ?? 0
  return {
    allowed: current < maxCampaigns,
    current,
    limit: maxCampaigns,
    reason: current >= maxCampaigns
      ? `You've reached your ${tierConfig.name} plan limit of ${maxCampaigns} campaigns. Upgrade to create more.`
      : undefined,
  }
}

export async function canAddSeat(
  supabase: SupabaseClient,
  brandId: string,
  campaignId: string
): Promise<LimitResult> {
  const { data: brand } = await supabase
    .from("brands")
    .select("subscription_tier")
    .eq("id", brandId)
    .single()

  const tier = (brand?.subscription_tier || "free") as SubscriptionTier
  const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
  const maxSeats = tierConfig.seatsPerCampaign

  if (maxSeats === -1) {
    return { allowed: true, current: 0, limit: -1 }
  }

  const { count } = await supabase
    .from("campaign_applications")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaignId)
    .eq("status", "accepted")

  const current = count ?? 0
  return {
    allowed: current < maxSeats,
    current,
    limit: maxSeats,
    reason: current >= maxSeats
      ? `This campaign has reached the ${tierConfig.name} plan limit of ${maxSeats} seats. Upgrade to accept more creators.`
      : undefined,
  }
}

export async function canApplyToCampaign(
  supabase: SupabaseClient,
  creatorId: string
): Promise<LimitResult> {
  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("subscription_tier")
    .eq("id", creatorId)
    .single()

  const tier = (creator?.subscription_tier || "free") as CreatorTier
  const tierConfig = CREATOR_TIERS[tier] || CREATOR_TIERS.free
  const maxApps = tierConfig.applicationsPerMonth

  if (maxApps === -1) {
    return { allowed: true, current: 0, limit: -1 }
  }

  // Count applications this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from("campaign_applications")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", creatorId)
    .gte("created_at", startOfMonth.toISOString())

  const current = count ?? 0
  return {
    allowed: current < maxApps,
    current,
    limit: maxApps,
    reason: current >= maxApps
      ? `You've used your ${maxApps} free application${maxApps === 1 ? "" : "s"} this month. Upgrade to Creator Pro for unlimited applications.`
      : undefined,
  }
}

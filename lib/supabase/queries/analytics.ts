import { SupabaseClient } from "@supabase/supabase-js"
import type { CampaignAnalytics } from "@/types"

export async function getCampaignAnalytics(
  supabase: SupabaseClient,
  campaignId: string,
  dateRange?: { from: string; to: string }
) {
  let query = supabase
    .from("campaign_analytics")
    .select("*")
    .eq("campaign_id", campaignId)

  if (dateRange?.from) {
    query = query.gte("date", dateRange.from)
  }
  if (dateRange?.to) {
    query = query.lte("date", dateRange.to)
  }

  const { data, error } = await query.order("date", { ascending: true })

  if (error) throw error
  return data as CampaignAnalytics[]
}

export async function getBrandStats(
  supabase: SupabaseClient,
  brandId: string
) {
  const [campaignsResult, paymentsResult, applicationsResult] =
    await Promise.all([
      supabase
        .from("campaigns")
        .select("id, status", { count: "exact" })
        .eq("brand_id", brandId),
      supabase
        .from("payments")
        .select("amount_cents")
        .eq("brand_id", brandId)
        .in("status", ["in_escrow", "released"]),
      supabase
        .from("campaign_applications")
        .select("creator_id", { count: "exact" })
        .in(
          "campaign_id",
          (
            await supabase
              .from("campaigns")
              .select("id")
              .eq("brand_id", brandId)
          ).data?.map((c) => c.id) ?? []
        )
        .eq("status", "accepted"),
    ])

  const campaigns = campaignsResult.data ?? []
  const payments = paymentsResult.data ?? []

  const totalSpend = payments.reduce((sum, p) => sum + p.amount_cents, 0)
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "active"
  ).length

  const uniqueCreatorIds = new Set(
    (applicationsResult.data ?? []).map((a) => a.creator_id)
  )

  return {
    total_campaigns: campaignsResult.count ?? 0,
    total_spend_cents: totalSpend,
    total_creators: uniqueCreatorIds.size,
    active_campaigns: activeCampaigns,
  }
}

export async function getCreatorStats(
  supabase: SupabaseClient,
  creatorId: string
) {
  const [paymentsResult, campaignsResult, ratingsResult] = await Promise.all([
    supabase
      .from("payments")
      .select("creator_payout_cents")
      .eq("creator_id", creatorId)
      .eq("status", "released"),
    supabase
      .from("campaign_applications")
      .select("id", { count: "exact" })
      .eq("creator_id", creatorId)
      .eq("status", "accepted"),
    supabase
      .from("content_submissions")
      .select("brand_rating")
      .eq("creator_id", creatorId)
      .not("brand_rating", "is", null),
  ])

  const payments = paymentsResult.data ?? []
  const totalEarnings = payments.reduce(
    (sum, p) => sum + p.creator_payout_cents,
    0
  )

  const ratings = (ratingsResult.data ?? [])
    .map((r) => r.brand_rating)
    .filter((r): r is number => r !== null)
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0

  return {
    total_earnings_cents: totalEarnings,
    campaigns_completed: campaignsResult.count ?? 0,
    avg_rating: Math.round(avgRating * 10) / 10,
  }
}

export async function getPlatformStats(supabase: SupabaseClient) {
  const [
    profilesResult,
    brandsResult,
    creatorsResult,
    campaignsResult,
    paymentsResult,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase.from("brands").select("id", { count: "exact" }),
    supabase.from("creator_profiles").select("id", { count: "exact" }),
    supabase.from("campaigns").select("id", { count: "exact" }),
    supabase
      .from("payments")
      .select("platform_fee_cents")
      .in("status", ["in_escrow", "released"]),
  ])

  const totalRevenue = (paymentsResult.data ?? []).reduce(
    (sum, p) => sum + p.platform_fee_cents,
    0
  )

  return {
    total_users: profilesResult.count ?? 0,
    total_brands: brandsResult.count ?? 0,
    total_creators: creatorsResult.count ?? 0,
    total_campaigns: campaignsResult.count ?? 0,
    total_revenue_cents: totalRevenue,
  }
}

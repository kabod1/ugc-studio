import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateUGCVideo } from "@/lib/n8n/workflows"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { product_image_url, campaign_id } = body

    if (!product_image_url) {
      return NextResponse.json({ error: "product_image_url required" }, { status: 400 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    // Enforce UGC video generation limit
    const tier = (brand.subscription_tier || "free") as SubscriptionTier
    const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
    const limit = tierConfig.ugcVideosPerMonth

    if (limit !== -1) {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { count } = await supabase
        .from("ugc_video_jobs")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)
        .gte("created_at", startOfMonth)

      if ((count ?? 0) >= limit) {
        return NextResponse.json({
          error: `You've reached your monthly limit of ${limit} UGC video${limit === 1 ? "" : "s"}. Upgrade your plan for more.`,
          current: count,
          limit,
          upgradeUrl: "/dashboard/settings/billing",
        }, { status: 403 })
      }
    }

    const { data: job, error } = await supabase
      .from("ugc_video_jobs")
      .insert({
        brand_id: brand?.id,
        campaign_id: campaign_id || null,
        product_image_url,
        status: "pending",
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const requestUrl = new URL(request.url)
    const callbackUrl = `${requestUrl.origin}/api/n8n/ugc-video-callback`

    try {
      await generateUGCVideo(product_image_url, job.id, callbackUrl, campaign_id, brand?.id)

      await supabase
        .from("ugc_video_jobs")
        .update({ status: "processing" })
        .eq("id", job.id)
    } catch (n8nError) {
      await supabase
        .from("ugc_video_jobs")
        .update({ status: "failed", error_message: n8nError instanceof Error ? n8nError.message : "Failed to trigger workflow" })
        .eq("id", job.id)
    }

    return NextResponse.json({ job_id: job.id, status: "processing" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

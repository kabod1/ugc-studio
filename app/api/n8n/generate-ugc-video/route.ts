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
    const { product_image_url, campaign_id, ai_influencer_id } = body

    if (!product_image_url) {
      return NextResponse.json({ error: "product_image_url required" }, { status: 400 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    const tier = (brand.subscription_tier || "free") as SubscriptionTier
    const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
    const limit = tierConfig.ugcVideosPerMonth as number

    // Enforce standard video monthly limit
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

    // Resolve influencer if provided
    let influencerParams: {
      avatar_image_url?: string
      generation_quality?: "standard" | "premium"
      heygen_avatar_id?: string
      voice_id?: string
      personality?: string
    } | undefined

    if (ai_influencer_id) {
      const { data: influencer } = await supabase
        .from("ai_influencers")
        .select("*")
        .eq("id", ai_influencer_id)
        .eq("brand_id", brand.id)
        .single()

      if (!influencer) {
        return NextResponse.json({ error: "Influencer not found" }, { status: 404 })
      }

      const effectiveQuality: "standard" | "premium" =
        tier === "scale" && influencer.generation_quality === "premium" ? "premium" : "standard"

      // Enforce HeyGen monthly cap for premium
      if (effectiveQuality === "premium") {
        const heygenLimit = tierConfig.heygenVideosPerMonth as number
        if (heygenLimit > 0) {
          const now = new Date()
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

          const { count: heygenCount } = await supabase
            .from("ugc_video_jobs")
            .select("id", { count: "exact", head: true })
            .eq("brand_id", brand.id)
            .eq("generation_quality", "premium")
            .gte("created_at", startOfMonth)

          if ((heygenCount ?? 0) >= heygenLimit) {
            return NextResponse.json({
              error: `You've used all ${heygenLimit} premium HeyGen videos this month. Contact sales for a custom enterprise plan.`,
              upgradeUrl: "/dashboard/settings/billing",
            }, { status: 403 })
          }
        }
      }

      influencerParams = {
        avatar_image_url: influencer.avatar_url,
        generation_quality: effectiveQuality,
        heygen_avatar_id: influencer.heygen_avatar_id ?? undefined,
        voice_id: influencer.voice_id ?? undefined,
        personality: influencer.personality ?? undefined,
      }
    }

    const { data: job, error } = await supabase
      .from("ugc_video_jobs")
      .insert({
        brand_id: brand.id,
        campaign_id: campaign_id || null,
        product_image_url,
        ai_influencer_id: ai_influencer_id || null,
        generation_quality: influencerParams?.generation_quality ?? "standard",
        status: "pending",
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const requestUrl = new URL(request.url)
    const callbackUrl = `${requestUrl.origin}/api/n8n/ugc-video-callback`

    try {
      await generateUGCVideo(
        product_image_url,
        job.id,
        callbackUrl,
        campaign_id,
        brand.id,
        influencerParams
      )

      await supabase
        .from("ugc_video_jobs")
        .update({ status: "processing" })
        .eq("id", job.id)
    } catch (n8nError) {
      await supabase
        .from("ugc_video_jobs")
        .update({
          status: "failed",
          error_message: n8nError instanceof Error ? n8nError.message : "Failed to trigger workflow",
        })
        .eq("id", job.id)
    }

    return NextResponse.json({ job_id: job.id, status: "processing" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

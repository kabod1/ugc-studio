import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/constants"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    const { data: influencers, error } = await supabase
      .from("ai_influencers")
      .select("*")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ influencers: influencers ?? [] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    // Enforce influencer slot limit
    const tier = (brand.subscription_tier || "free") as SubscriptionTier
    const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
    const limit = tierConfig.aiInfluencers as number

    if (limit === 0) {
      return NextResponse.json({
        error: "Your plan does not include AI Influencers. Upgrade to Starter or higher.",
        upgradeUrl: "/dashboard/settings/billing",
      }, { status: 403 })
    }

    if (limit !== -1) {
      const { count } = await supabase
        .from("ai_influencers")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)

      if ((count ?? 0) >= limit) {
        return NextResponse.json({
          error: `You've used all ${limit} AI Influencer slot${limit === 1 ? "" : "s"} on your plan. Upgrade for more.`,
          upgradeUrl: "/dashboard/settings/billing",
        }, { status: 403 })
      }
    }

    const body = await request.json()
    const { name, type, avatar_url, voice_id, personality, style_data, generation_quality, heygen_avatar_id } = body

    if (!name || !type || !avatar_url) {
      return NextResponse.json({ error: "name, type, and avatar_url are required" }, { status: 400 })
    }
    if (!["uploaded", "virtual"].includes(type)) {
      return NextResponse.json({ error: "type must be 'uploaded' or 'virtual'" }, { status: 400 })
    }

    // Only Scale can use premium quality
    const effectiveQuality = tier === "scale" ? (generation_quality ?? "standard") : "standard"

    const { data: influencer, error } = await supabase
      .from("ai_influencers")
      .insert({
        brand_id: brand.id,
        name,
        type,
        avatar_url,
        voice_id: voice_id ?? null,
        personality: personality ?? null,
        style_data: style_data ?? {},
        generation_quality: effectiveQuality,
        heygen_avatar_id: heygen_avatar_id ?? null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ influencer }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

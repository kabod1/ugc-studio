import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { SUBSCRIPTION_TIERS, type SubscriptionTier, isAdminEmail } from "@/lib/constants"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ jobs: [], usage: null })

    // Admin gets Scale-tier limits regardless of DB value
    const effectiveTierKey = isAdminEmail(user.email)
      ? "scale"
      : ((brand.subscription_tier || "free") as SubscriptionTier)
    const tierConfig = SUBSCRIPTION_TIERS[effectiveTierKey] || SUBSCRIPTION_TIERS.free

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const { count: usedCount } = await supabase
      .from("ugc_video_jobs")
      .select("id", { count: "exact", head: true })
      .eq("brand_id", brand.id)
      .gte("created_at", startOfMonth)

    const { data: jobs } = await supabase
      .from("ugc_video_jobs")
      .select("*")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false })

    return NextResponse.json({
      jobs: jobs || [],
      usage: {
        used: usedCount ?? 0,
        limit: tierConfig.ugcVideosPerMonth,
        tier: tierConfig.name,
        tierKey: effectiveTierKey,
        aiInfluencers: tierConfig.aiInfluencers,
      },
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { job_id, caption } = await request.json()
    if (!job_id) return NextResponse.json({ error: "job_id required" }, { status: 400 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    const { error } = await supabase
      .from("ugc_video_jobs")
      .update({ caption })
      .eq("id", job_id)
      .eq("brand_id", brand.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { job_id } = await request.json()
    if (!job_id) return NextResponse.json({ error: "job_id required" }, { status: 400 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    const { error } = await supabase
      .from("ugc_video_jobs")
      .delete()
      .eq("id", job_id)
      .eq("brand_id", brand.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

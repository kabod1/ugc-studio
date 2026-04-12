import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const svc = createServiceClient()

    const { data: brand, error } = await svc
      .from("brands")
      .select("id, company_name, industry, description, logo_url, website, brand_colors, brand_fonts, tone_of_voice, created_at")
      .eq("id", params.id)
      .single()

    if (error || !brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    // Active campaigns
    const { data: activeCampaigns } = await svc
      .from("campaigns")
      .select("id, title, description, budget_cents, content_types, required_platforms, content_deadline, max_creators, created_at")
      .eq("brand_id", params.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(10)

    // Past campaigns (completed)
    const { count: completedCount } = await svc
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("brand_id", params.id)
      .eq("status", "completed")

    // Total creators worked with
    const { count: creatorsCount } = await svc
      .from("campaign_applications")
      .select("id, campaigns!inner(brand_id)", { count: "exact", head: true })
      .eq("campaigns.brand_id", params.id)
      .eq("status", "accepted")

    return NextResponse.json({
      brand,
      active_campaigns: activeCampaigns || [],
      stats: {
        completed_campaigns: completedCount || 0,
        total_creators: creatorsCount || 0,
        active_campaigns: activeCampaigns?.length || 0,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

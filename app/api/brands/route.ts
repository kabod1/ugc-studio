import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const svc = createServiceClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const industry = searchParams.get("industry") || ""
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)

    let query = svc
      .from("brands")
      .select("id, company_name, industry, description, logo_url, website, brand_colors")
      .order("company_name", { ascending: true })
      .limit(limit)

    if (search) query = query.ilike("company_name", `%${search}%`)
    if (industry) query = query.eq("industry", industry)

    const { data: brands, error } = await query
    if (error) return NextResponse.json({ brands: [] })

    // Enrich with active campaign counts
    const brandIds = (brands || []).map(b => b.id)
    const { data: campaignCounts } = await svc
      .from("campaigns")
      .select("brand_id")
      .in("brand_id", brandIds)
      .eq("status", "active")

    const countMap: Record<string, number> = {}
    for (const row of campaignCounts || []) {
      countMap[row.brand_id] = (countMap[row.brand_id] || 0) + 1
    }

    const enriched = (brands || []).map(b => ({
      ...b,
      active_campaigns: countMap[b.id] || 0,
    }))

    return NextResponse.json({ brands: enriched })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

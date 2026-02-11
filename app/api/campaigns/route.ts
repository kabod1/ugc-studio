import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { campaignSchema } from "@/lib/validations/campaign"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get("brand_id")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const offset = (page - 1) * limit

    // If no brand_id passed, get the user's brand
    let resolvedBrandId = brandId
    if (!resolvedBrandId) {
      const { data: brand } = await supabase
        .from("brands")
        .select("id")
        .eq("user_id", user.id)
        .single()
      if (!brand) {
        return NextResponse.json({ error: "Brand not found" }, { status: 404 })
      }
      resolvedBrandId = brand.id
    }

    let query = supabase
      .from("campaigns")
      .select("*, brands(*)", { count: "exact" })
      .eq("brand_id", resolvedBrandId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: campaigns, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    })
  } catch (err) {
    console.error("GET /api/campaigns error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = campaignSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        brand_id: brand.id,
        ...parsed.data,
        status: parsed.data.status || "draft",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (err) {
    console.error("POST /api/campaigns error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

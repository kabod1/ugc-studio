import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()

    // Determine if brand or creator
    const [{ data: brand }, { data: creator }] = await Promise.all([
      svc.from("brands").select("id").eq("user_id", user.id).single(),
      svc.from("creator_profiles").select("id").eq("user_id", user.id).single(),
    ])

    let query = svc
      .from("contracts")
      .select("*, campaigns(title), creator_profiles(display_name)")

    if (brand) {
      query = query.eq("brand_id", brand.id)
    } else if (creator) {
      query = query.eq("creator_id", creator.id)
    } else {
      return NextResponse.json([])
    }

    const { data, error } = await query
    if (error) {
      console.error("Contracts fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { campaign_id, application_id, terms, total_value_cents, deliverables } = body

    const svc = createServiceClient()

    const { data: application } = await svc
      .from("campaign_applications")
      .select("creator_id, campaigns(brand_id)")
      .eq("id", application_id)
      .single()

    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 })

    const { data, error } = await svc
      .from("contracts")
      .insert({
        campaign_id,
        creator_id: application.creator_id,
        brand_id: (application.campaigns as any)?.brand_id,
        terms: terms || "",
        total_value_cents: total_value_cents || 0,
        deliverables: deliverables || [],
        status: "draft",
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

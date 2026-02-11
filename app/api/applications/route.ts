import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: creator } = await supabase
      .from("creator_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!creator) return NextResponse.json({ error: "Creator profile not found" }, { status: 403 })

    const body = await request.json()
    const { campaign_id, pitch, proposed_rate_cents } = body

    if (!campaign_id) return NextResponse.json({ error: "campaign_id required" }, { status: 400 })

    const { data: existing } = await supabase
      .from("campaign_applications")
      .select("id")
      .eq("campaign_id", campaign_id)
      .eq("creator_id", creator.id)
      .single()

    if (existing) return NextResponse.json({ error: "Already applied" }, { status: 409 })

    const { data, error } = await supabase
      .from("campaign_applications")
      .insert({
        campaign_id,
        creator_id: creator.id,
        pitch,
        proposed_rate_cents: proposed_rate_cents || 0,
        status: "pending",
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

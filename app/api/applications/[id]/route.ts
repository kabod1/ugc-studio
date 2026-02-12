import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { canAddSeat } from "@/lib/subscription-limits"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data, error } = await supabase
      .from("campaign_applications")
      .select("*, creator_profiles(*, profiles(full_name, avatar_url)), campaigns(title, brand_id)")
      .eq("id", params.id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { status } = body

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Check seat limit when accepting
    if (status === "accepted") {
      const { data: application } = await supabase
        .from("campaign_applications")
        .select("campaign_id, campaigns(brand_id)")
        .eq("id", params.id)
        .single()

      if (application?.campaigns) {
        const brandId = (application.campaigns as any).brand_id
        const seatCheck = await canAddSeat(supabase, brandId, application.campaign_id)
        if (!seatCheck.allowed) {
          return NextResponse.json({
            error: seatCheck.reason,
            current: seatCheck.current,
            limit: seatCheck.limit,
            upgradeUrl: "/dashboard/settings/billing",
          }, { status: 403 })
        }
      }
    }

    const { data, error } = await supabase
      .from("campaign_applications")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

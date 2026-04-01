import { createClient, createServiceClient } from "@/lib/supabase/server"
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
      .select("*, campaigns(brand_id, title, budget_per_creator_cents)")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Auto-create contract when accepting — use service client to bypass RLS
    if (status === "accepted" && data) {
      const svc = createServiceClient()
      const brandId = (data.campaigns as any)?.brand_id
      const budgetCents = (data.campaigns as any)?.budget_per_creator_cents || 0
      const campaignTitle = (data.campaigns as any)?.title || "Campaign"

      // Only create if one doesn't already exist for this campaign + creator
      const { data: existing } = await svc
        .from("contracts")
        .select("id")
        .eq("campaign_id", data.campaign_id)
        .eq("creator_id", data.creator_id)
        .limit(1)
        .single()

      if (!existing) {
        await svc.from("contracts").insert({
          campaign_id: data.campaign_id,
          creator_id: data.creator_id,
          brand_id: brandId,
          terms: `Standard content creation agreement for "${campaignTitle}". Creator agrees to deliver content as specified in the campaign brief. Payment will be released upon content approval.`,
          total_value_cents: budgetCents,
          deliverables: [],
          status: "sent",
        })
      }

      // Notify creator their application was accepted
      const { data: creatorProfile } = await svc
        .from("creator_profiles")
        .select("user_id")
        .eq("id", data.creator_id)
        .single()

      if (creatorProfile?.user_id) {
        await svc.from("notifications").insert({
          user_id: creatorProfile.user_id,
          title: "Application accepted! 🎉",
          message: `Your application for "${campaignTitle}" has been accepted. A contract has been sent for your review.`,
          type: "application",
          link: "/creator",
        })
      }
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

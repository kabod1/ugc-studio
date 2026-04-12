import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { sendCampaignBriefEmail } from "@/lib/email"

// POST /api/campaigns/[id]/send-brief
// Sends the campaign brief to all accepted creators (or a specific creator_id)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const { creator_id } = body // optional — if omitted, sends to all accepted

    const svc = createServiceClient()

    // Verify brand owns this campaign
    const { data: campaign } = await svc
      .from("campaigns")
      .select("id, title, description, deadline, budget_per_creator_cents, brand_id, brands(company_name)")
      .eq("id", params.id)
      .single()

    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 })

    const { data: brand } = await svc
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand || brand.id !== (campaign as any).brand_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get accepted creators for this campaign
    let query = svc
      .from("campaign_applications")
      .select("creator_id, creator_profiles(user_id, display_name)")
      .eq("campaign_id", params.id)
      .eq("status", "accepted")

    if (creator_id) query = query.eq("creator_id", creator_id)

    const { data: applications } = await query

    if (!applications?.length) {
      return NextResponse.json({ error: "No accepted creators found" }, { status: 404 })
    }

    const brandName = (campaign as any).brands?.company_name || "Brand"
    const brief = campaign.description || "Please refer to the campaign details in your dashboard."
    const budgetCents = campaign.budget_per_creator_cents || 0

    let sent = 0
    const errors: string[] = []

    for (const app of applications) {
      const creatorProfile = app.creator_profiles as any
      if (!creatorProfile?.user_id) continue

      const { data: creatorUser } = await svc.auth.admin.getUserById(creatorProfile.user_id)
      const email = creatorUser?.user?.email
      if (!email) continue

      try {
        await sendCampaignBriefEmail({
          creatorEmail: email,
          creatorName: creatorProfile.display_name || "Creator",
          campaignTitle: campaign.title,
          brandName,
          brief,
          deliverables: [],
          deadline: campaign.deadline || undefined,
          budgetCents,
        })

        // In-app notification
        await svc.from("notifications").insert({
          user_id: creatorProfile.user_id,
          title: "Campaign brief received 📋",
          message: `The brief for "${campaign.title}" has been sent to your email.`,
          type: "campaign",
          link: "/creator",
        })

        sent++
      } catch (err) {
        console.error(`Failed to send brief to ${email}:`, err)
        errors.push(email)
      }
    }

    return NextResponse.json({ sent, errors })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

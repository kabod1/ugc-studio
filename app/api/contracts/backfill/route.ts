import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// POST /api/contracts/backfill
// Creates missing contracts for all accepted applications that don't have one
export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()

    // Only brands can backfill their own contracts
    const { data: brand } = await svc
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 403 })

    // Find all accepted applications for this brand's campaigns that have no contract
    const { data: accepted } = await svc
      .from("campaign_applications")
      .select("id, creator_id, campaign_id, campaigns(brand_id, title, budget_per_creator_cents)")
      .eq("status", "accepted")
      .eq("campaigns.brand_id", brand.id)

    if (!accepted || accepted.length === 0) {
      return NextResponse.json({ created: 0, message: "No accepted applications found" })
    }

    let created = 0
    for (const app of accepted) {
      const campaign = (app as any).campaigns
      if (!campaign) continue

      // Check if contract already exists
      const { data: existing } = await svc
        .from("contracts")
        .select("id")
        .eq("campaign_id", app.campaign_id)
        .eq("creator_id", app.creator_id)
        .limit(1)
        .single()

      if (!existing) {
        await svc.from("contracts").insert({
          campaign_id: app.campaign_id,
          creator_id: app.creator_id,
          brand_id: campaign.brand_id,
          terms: `Standard content creation agreement for "${campaign.title}". Creator agrees to deliver content as specified in the campaign brief. Payment will be released upon content approval.`,
          total_value_cents: campaign.budget_per_creator_cents || 0,
          deliverables: [],
          status: "sent",
        })
        created++
      }
    }

    return NextResponse.json({ created, message: `Created ${created} missing contract(s)` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

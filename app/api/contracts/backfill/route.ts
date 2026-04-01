import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()

    const { data: brand } = await svc
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 403 })

    // Step 1: get this brand's campaigns directly
    const { data: brandCampaigns } = await svc
      .from("campaigns")
      .select("id, title, budget_per_creator_cents, brand_id")
      .eq("brand_id", brand.id)

    if (!brandCampaigns || brandCampaigns.length === 0) {
      return NextResponse.json({ created: 0, message: "No campaigns found" })
    }

    const campaignMap = Object.fromEntries(brandCampaigns.map((c) => [c.id, c]))
    const campaignIds = brandCampaigns.map((c) => c.id)

    // Step 2: get all accepted applications for those campaigns
    const { data: accepted } = await svc
      .from("campaign_applications")
      .select("id, creator_id, campaign_id")
      .eq("status", "accepted")
      .in("campaign_id", campaignIds)

    if (!accepted || accepted.length === 0) {
      return NextResponse.json({ created: 0, message: "No accepted applications found" })
    }

    // Step 3: fix any contracts that were created with null brand_id
    await svc
      .from("contracts")
      .update({ brand_id: brand.id })
      .is("brand_id", null)
      .in("campaign_id", campaignIds)

    // Step 4: create missing contracts
    let created = 0
    for (const app of accepted) {
      const campaign = campaignMap[app.campaign_id]
      if (!campaign) continue

      const { data: existing } = await svc
        .from("contracts")
        .select("id")
        .eq("campaign_id", app.campaign_id)
        .eq("creator_id", app.creator_id)
        .limit(1)
        .single()

      if (!existing) {
        const { error } = await svc.from("contracts").insert({
          campaign_id: app.campaign_id,
          creator_id: app.creator_id,
          brand_id: brand.id,
          terms: `Standard content creation agreement for "${campaign.title}". Creator agrees to deliver content as specified in the campaign brief. Payment will be released upon content approval.`,
          total_value_cents: campaign.budget_per_creator_cents || 0,
          deliverables: [],
          status: "sent",
        })
        if (!error) created++
      }
    }

    return NextResponse.json({ created, message: `Created ${created} missing contract(s)` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

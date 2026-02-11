import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { matchCreators } from "@/lib/n8n/workflows"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { campaign_id } = body

    if (!campaign_id) return NextResponse.json({ error: "campaign_id required" }, { status: 400 })

    const { data: campaign } = await supabase
      .from("campaigns")
      .select("brief")
      .eq("id", campaign_id)
      .single()

    const result = await matchCreators(campaign_id, campaign?.brief)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Matching failed" },
      { status: 500 }
    )
  }
}

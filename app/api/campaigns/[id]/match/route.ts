import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { matchCreators } from "@/lib/n8n/workflows"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: campaign } = await supabase
      .from("campaigns")
      .select("brief, brand_id")
      .eq("id", params.id)
      .single()

    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 })

    const result = await matchCreators(params.id, campaign.brief)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Matching failed" },
      { status: 500 }
    )
  }
}

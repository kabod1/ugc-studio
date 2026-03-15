import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()

    const { data: applications, error } = await svc
      .from("campaign_applications")
      .select("id, status, pitch, proposed_rate_cents, ai_match_score, created_at, creator_id, creator_profiles(display_name, tiktok_followers, instagram_followers, platform_rating, categories)")
      .eq("campaign_id", params.id)
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(applications || [])
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

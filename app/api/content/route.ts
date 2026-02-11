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
    const { campaign_id, application_id, title, file_url, file_type, thumbnail_url } = body

    if (!campaign_id || !file_url) {
      return NextResponse.json({ error: "campaign_id and file_url required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("content_submissions")
      .insert({
        campaign_id,
        application_id,
        creator_id: creator.id,
        title: title || "Untitled",
        file_url,
        file_type: file_type || "video",
        thumbnail_url,
        status: "pending",
        version: 1,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

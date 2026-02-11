import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const jobId = new URL(request.url).searchParams.get("job_id")
    if (!jobId) return NextResponse.json({ error: "job_id required" }, { status: 400 })

    const { data, error } = await supabase
      .from("ugc_video_jobs")
      .select("*")
      .eq("id", jobId)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

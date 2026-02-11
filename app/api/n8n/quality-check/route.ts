import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { checkContentQuality } from "@/lib/n8n/workflows"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { submission_id, file_url, brief } = body

    if (!submission_id || !file_url) {
      return NextResponse.json({ error: "submission_id and file_url required" }, { status: 400 })
    }

    const result = await checkContentQuality(submission_id, file_url, brief)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Quality check failed" },
      { status: 500 }
    )
  }
}

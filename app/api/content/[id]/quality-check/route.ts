import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { checkContentQuality } from "@/lib/n8n/workflows"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: submission } = await supabase
      .from("content_submissions")
      .select("*, campaigns(brief)")
      .eq("id", params.id)
      .single()

    if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 })

    const result = await checkContentQuality(
      params.id,
      submission.file_url,
      submission.campaigns?.brief
    )

    await supabase
      .from("content_submissions")
      .update({
        quality_score: result.score,
        ai_quality_feedback: result,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Quality check failed" },
      { status: 500 }
    )
  }
}

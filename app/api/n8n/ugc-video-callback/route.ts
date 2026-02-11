import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { job_id, status, video_url, generated_image_url, audio_url, caption, tts_script, ai_analysis } = body

    if (!job_id) return NextResponse.json({ error: "job_id required" }, { status: 400 })

    const supabase = createServiceClient()

    const updateData: Record<string, any> = {
      status: status || "completed",
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    }

    if (video_url) updateData.video_url = video_url
    if (generated_image_url) updateData.generated_image_url = generated_image_url
    if (audio_url) updateData.audio_url = audio_url
    if (caption) updateData.caption = caption
    if (tts_script) updateData.tts_script = tts_script
    if (ai_analysis) updateData.ai_analysis = typeof ai_analysis === "string" ? { raw: ai_analysis } : ai_analysis

    const { error } = await supabase
      .from("ugc_video_jobs")
      .update(updateData)
      .eq("id", job_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

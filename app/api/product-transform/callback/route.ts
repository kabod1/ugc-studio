import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { job_id, status, output_url, error_message } = body

    if (!job_id) return NextResponse.json({ error: "job_id required" }, { status: 400 })

    const supabase = createServiceClient()

    const updateData: Record<string, any> = {
      status: status || "completed",
    }
    if (output_url) updateData.output_url = output_url
    if (error_message) updateData.error_message = error_message
    if (status === "completed" || status === "failed") {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from("product_transform_jobs")
      .update(updateData)
      .eq("id", job_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

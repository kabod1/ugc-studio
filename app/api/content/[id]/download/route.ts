import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: submission } = await supabase
    .from("content_submissions")
    .select("*, campaigns(brand_id)")
    .eq("id", params.id)
    .single()

  if (!submission) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 })
  }

  if (submission.status !== "approved") {
    return NextResponse.json(
      { error: "Only approved content can be downloaded" },
      { status: 403 }
    )
  }

  if (!submission.file_url) {
    return NextResponse.json({ error: "No file available" }, { status: 404 })
  }

  // R2 files are publicly accessible — return the URL directly
  return NextResponse.json({ url: submission.file_url })
}

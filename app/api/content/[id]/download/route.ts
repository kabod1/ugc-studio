import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
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

  // Extract the storage path from the file URL
  const url = new URL(submission.file_url)
  const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/(.+)/)

  if (pathMatch) {
    // Generate a signed URL for download
    const storagePath = pathMatch[1]
    const bucket = storagePath.split("/")[0]
    const filePath = storagePath.split("/").slice(1).join("/")

    const { data: signedUrl } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (signedUrl?.signedUrl) {
      return NextResponse.json({ url: signedUrl.signedUrl })
    }
  }

  // Fallback: return the public URL directly
  return NextResponse.json({ url: submission.file_url })
}

import { createServiceClient } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { filename, content_type, bucket = "content" } = body

    if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 })

    const serviceClient = createServiceClient()
    const path = `${user.id}/${Date.now()}-${filename}`

    const { data, error } = await serviceClient.storage
      .from(bucket)
      .createSignedUploadUrl(path)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
      publicUrl: serviceClient.storage.from(bucket).getPublicUrl(path).data.publicUrl,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

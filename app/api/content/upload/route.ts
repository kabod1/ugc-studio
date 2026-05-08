import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "content"

    if (!file) return NextResponse.json({ error: "file required" }, { status: 400 })

    const ext = file.name.split(".").pop() || "bin"
    const key = `${folder}/${user.id}/${Date.now()}-${file.name}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    }))

    const publicUrl = `${R2_PUBLIC_URL}/${key}`
    return NextResponse.json({ url: publicUrl, path: key, publicUrl })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

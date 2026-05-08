import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2"

// POST — upload brand logo
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"]
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Only PNG, JPG, SVG, or WebP images allowed" }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Logo must be under 2MB" }, { status: 400 })
    }

    const svc = createServiceClient()
    const { data: brand } = await svc.from("brands").select("id").eq("user_id", user.id).single()
    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    const ext = file.name.split(".").pop() || "png"
    const key = `brand-logos/${brand.id}/logo-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    const publicUrl = `${R2_PUBLIC_URL}/${key}`
    await svc.from("brands").update({ logo_url: publicUrl }).eq("id", brand.id)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE — remove brand logo
export async function DELETE() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()
    await svc.from("brands").update({ logo_url: null }).eq("user_id", user.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { isAdminEmail } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    // Free tier cannot create influencers at all (admin bypasses)
    if (!isAdminEmail(user.email) && (!brand.subscription_tier || brand.subscription_tier === "free")) {
      return NextResponse.json({
        error: "AI Influencers require a Starter plan or higher.",
        upgradeUrl: "/dashboard/settings/billing",
      }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, and WebP images are allowed" }, { status: 400 })
    }

    const maxSizeBytes = 10 * 1024 * 1024 // 10 MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "File size must be under 10 MB" }, { status: 400 })
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
    const key = `ai-influencers/${brand.id}/uploaded-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    const avatar_url = `${R2_PUBLIC_URL}/${key}`
    return NextResponse.json({ avatar_url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}

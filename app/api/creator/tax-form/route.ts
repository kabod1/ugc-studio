import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET — fetch current tax form info
export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()
    const { data } = await svc
      .from("creator_profiles")
      .select("tax_form_type, tax_form_submitted, tax_form_url, tax_form_uploaded_at")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json(data || {})
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST — upload tax form PDF
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const formType = formData.get("form_type") as string | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (!formType) return NextResponse.json({ error: "form_type is required" }, { status: 400 })

    const allowed = ["W-9", "W-8BEN", "W-8BEN-E", "EU-VAT"]
    if (!allowed.includes(formType)) {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 })
    }

    // Validate file type (PDF only)
    if (!file.type.includes("pdf")) {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 })
    }

    const svc = createServiceClient()

    const { data: profile } = await svc
      .from("creator_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!profile) return NextResponse.json({ error: "Creator profile not found" }, { status: 404 })

    // Upload to Supabase Storage
    const fileName = `tax-forms/${profile.id}/${formType}-${Date.now()}.pdf`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await svc.storage
      .from("creator-documents")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: true,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    const { data: { publicUrl } } = svc.storage
      .from("creator-documents")
      .getPublicUrl(fileName)

    // Update profile
    const { error: updateError } = await svc
      .from("creator_profiles")
      .update({
        tax_form_type: formType,
        tax_form_submitted: true,
        tax_form_url: publicUrl,
        tax_form_uploaded_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // Notify admin
    const { data: adminUsers } = await svc
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(5)

    if (adminUsers?.length) {
      await svc.from("notifications").insert(
        adminUsers.map(a => ({
          user_id: a.id,
          title: "Tax form submitted",
          message: `A creator has submitted a ${formType} tax form for review.`,
          type: "admin",
          link: `/admin/creators/${profile.id}`,
        }))
      )
    }

    return NextResponse.json({ success: true, url: publicUrl, form_type: formType })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE — remove tax form
export async function DELETE() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()
    await svc
      .from("creator_profiles")
      .update({
        tax_form_type: null,
        tax_form_submitted: false,
        tax_form_url: null,
        tax_form_uploaded_at: null,
      })
      .eq("user_id", user.id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

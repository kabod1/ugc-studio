import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id, company_name, website, industry, description, brand_guidelines_url, brand_colors, brand_fonts, tone_of_voice")
      .eq("user_id", user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    return NextResponse.json({ brand })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    const body = await request.json()
    const allowedFields = ["company_name", "website", "industry", "description", "brand_guidelines_url", "brand_colors", "brand_fonts", "tone_of_voice"]
    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    const { error } = await supabase
      .from("brands")
      .update(updates)
      .eq("id", brand.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

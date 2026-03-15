import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ payments: [] })

    const { data: payments } = await supabase
      .from("payments")
      .select("*, campaigns(title), creator_profiles(display_name)")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false })

    return NextResponse.json({ payments: payments || [] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

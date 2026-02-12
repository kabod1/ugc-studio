import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: creator } = await supabase
      .from("creator_profiles")
      .select("id, stripe_connect_account_id")
      .eq("user_id", user.id)
      .single()

    if (!creator) return NextResponse.json({ creator: null, payments: [] })

    const { data: payments } = await supabase
      .from("payments")
      .select("*, campaigns(title)")
      .eq("creator_id", creator.id)
      .order("created_at", { ascending: false })

    return NextResponse.json({ creator, payments: payments || [] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

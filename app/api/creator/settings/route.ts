import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({ profile: profile || null })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

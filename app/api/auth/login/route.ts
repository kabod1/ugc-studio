import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  // Fetch role for redirect
  let role = "brand"
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()
    if (profile?.role) role = profile.role
  } catch {}

  return NextResponse.json({ success: true, role, userId: data.user.id })
}

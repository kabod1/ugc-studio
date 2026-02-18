import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const SUPABASE_URL = "https://shqkvzzwademhglwlgiy.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocWt2enp3YWRlbWhnbHdsZ2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQxNTIsImV4cCI6MjA4NjIwMDE1Mn0.fOhyCA9mD9KmS_ktqY26E8jMMuEUvZQshDb6je0a5A8"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const cookieStore = cookies()

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch {}
        },
      },
    }
  )

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

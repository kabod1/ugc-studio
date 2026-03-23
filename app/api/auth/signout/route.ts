import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } catch {
    // Continue even if sign out fails
  }

  const res = NextResponse.json({ success: true })

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0]
  const cookieName = `sb-${projectRef}-auth-token`

  const clearOpts = {
    path: "/",
    sameSite: "lax" as const,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  }

  // Clear Supabase session cookies (non-chunked and up to 5 chunks)
  res.cookies.set(cookieName, "", clearOpts)
  for (let i = 0; i < 5; i++) {
    res.cookies.set(`${cookieName}.${i}`, "", clearOpts)
  }

  // Clear role cookie
  res.cookies.set("user-role", "", clearOpts)

  return res
}

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.headers.get("cookie")
            ?.split(";")
            .find((c) => c.trim().startsWith(name + "="))
            ?.split("=")
            .slice(1)
            .join("=")
            .trim()
        },
        set(name: string, value: string, options: CookieOptions) {
          cookiesToSet.push({ name, value, options })
        },
        remove(name: string, options: CookieOptions) {
          cookiesToSet.push({ name, value: "", options })
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

  const res = NextResponse.json({ success: true, role, userId: data.user.id })

  // Set session cookies directly on the response
  cookiesToSet.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options)
  })

  return res
}

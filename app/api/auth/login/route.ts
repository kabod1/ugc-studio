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

  // Use service role key via direct fetch to bypass RLS infinite recursion
  let role = "brand"
  try {
    const profileRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${data.user.id}&select=role&limit=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        cache: "no-store",
      }
    )
    const profiles = await profileRes.json()
    if (profiles?.[0]?.role) role = profiles[0].role
  } catch {}

  const destination =
    role === "creator" ? "/creator" : role === "admin" ? "/admin" : "/dashboard"

  const res = NextResponse.json({ destination })

  // Set all auth session cookies on the response
  cookiesToSet.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options)
  })

  return res
}

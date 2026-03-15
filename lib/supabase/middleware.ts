import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Public routes - no auth needed
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/api/stripe/webhook", "/api/n8n/ugc-video-callback"]
  if (publicRoutes.some((route) => path === route || path.startsWith(route + "/"))) {
    return response
  }

  // Auth callback
  if (path.startsWith("/auth/callback") || path.startsWith("/api/auth")) {
    return response
  }

  // Not authenticated - redirect to login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", path)
    return NextResponse.redirect(url)
  }

  // Fetch user role using service role key to bypass RLS infinite recursion bug
  // Trim env vars — Vercel may store values with trailing \n which breaks HTTP headers in Edge Runtime
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()
  let role = "brand"
  try {
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=role&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        cache: "no-store",
      }
    )
    const profiles = await profileRes.json()
    if (profiles?.[0]?.role) role = profiles[0].role
    else console.error("[middleware] profile fetch returned:", JSON.stringify(profiles))
  } catch (e) {
    console.error("[middleware] profile fetch error:", e)
  }

  // Role-based access control
  if (path.startsWith("/admin") && role !== "admin") {
    const redirect = role === "creator" ? "/creator" : "/dashboard"
    return NextResponse.redirect(new URL(redirect, request.url))
  }

  if (path.startsWith("/dashboard") && role !== "brand" && role !== "admin") {
    const redirect = role === "creator" ? "/creator" : "/login"
    return NextResponse.redirect(new URL(redirect, request.url))
  }

  if (path.startsWith("/creator") && role !== "creator" && role !== "admin") {
    const redirect = role === "brand" ? "/dashboard" : "/login"
    return NextResponse.redirect(new URL(redirect, request.url))
  }

  return response
}

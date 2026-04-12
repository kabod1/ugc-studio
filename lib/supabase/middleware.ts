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

  const path = request.nextUrl.pathname

  // Public routes - no auth needed
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/offline", "/terms", "/privacy", "/cookie-policy", "/pricing", "/checkout", "/api/stripe/webhook", "/api/n8n/ugc-video-callback", "/api/subscriptions/manual-payment", "/api/payments/schedule-payouts"]
  if (publicRoutes.some((route) => path === route || path.startsWith(route + "/"))) {
    return response
  }

  // Auth callback — allow /callback (Next.js route group strips the "(auth)" segment)
  if (path.startsWith("/auth/callback") || path.startsWith("/callback") || path.startsWith("/api/auth")) {
    return response
  }

  // Use getSession() for routing — reads cookie locally, no network call.
  // Individual pages call getUser() for proper server-side verification.
  const { data: { session } } = await supabase.auth.getSession()

  // Not authenticated - redirect to login
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", path)
    return NextResponse.redirect(url)
  }

  // Read role from cookie (set at login/signup) or fall back to session user_metadata
  const roleCookie = request.cookies.get("user-role")?.value
  let role = roleCookie || (session.user?.user_metadata?.role as string) || "brand"

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

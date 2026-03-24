import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
    const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()

    // Sign in via direct REST call — no createServerClient
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    })

    const authData = await authRes.json()

    if (!authRes.ok || authData.error || !authData.access_token) {
      return NextResponse.json(
        { error: authData.error_description || authData.msg || authData.error || "Invalid email or password" },
        { status: 401 }
      )
    }

    const userMeta = authData.user?.user_metadata || {}

    // Role is stored in user_metadata (set at signup)
    const role = (userMeta.role as string) || "brand"

    const destination =
      role === "creator" ? "/creator" : role === "admin" ? "/admin" : "/dashboard"

    const res = NextResponse.json({ destination })

    // Build session exactly as @supabase/auth-js stores it
    const session = {
      access_token: authData.access_token,
      refresh_token: authData.refresh_token,
      expires_in: authData.expires_in,
      expires_at: authData.expires_at,
      token_type: authData.token_type || "bearer",
      user: authData.user,
    }
    const sessionJson = JSON.stringify(session)

    // Cookie name matches supabase-js defaultStorageKey: sb-{projectRef}-auth-token
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0]
    const cookieName = `sb-${projectRef}-auth-token`

    // @supabase/ssr DEFAULT_COOKIE_OPTIONS: httpOnly false, sameSite lax, path /
    const cookieOpts = {
      path: "/",
      sameSite: "lax" as const,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 31536000,
    }

    // Chunk if URL-encoded length > 3180 — mirrors @supabase/ssr createChunks logic
    const encoded = encodeURIComponent(sessionJson)
    if (encoded.length <= 3180) {
      res.cookies.set(cookieName, sessionJson, cookieOpts)
    } else {
      let remaining = encoded
      let i = 0
      while (remaining.length > 0) {
        let head = remaining.slice(0, 3180)
        // Don't split a %XX escape sequence
        const lastPct = head.lastIndexOf("%")
        if (lastPct > 3180 - 3) head = head.slice(0, lastPct)
        res.cookies.set(`${cookieName}.${i}`, decodeURIComponent(head), cookieOpts)
        remaining = remaining.slice(head.length)
        i++
      }
    }

    // Set role cookie so middleware can skip Edge Runtime DB fetch
    res.cookies.set("user-role", role, cookieOpts)

    return res
  } catch (err: any) {
    console.error("[login] error:", err?.message, err?.stack?.split("\n")[1])
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}

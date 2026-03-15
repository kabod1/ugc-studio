import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

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

    const userId = authData.user?.id

    // Get role via service role key
    let role = "brand"
    try {
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=role&limit=1`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
      )
      const profiles = await profileRes.json()
      if (profiles?.[0]?.role) role = profiles[0].role
    } catch {}

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

    // Chunk if URL-encoded length > 3180 (matches @supabase/ssr CHUNK_SIZE)
    const encoded = encodeURIComponent(sessionJson)
    if (encoded.length <= 3180) {
      res.cookies.set(cookieName, sessionJson, cookieOpts)
    } else {
      const chunkSize = 3180
      const chunks = encoded.match(new RegExp(`.{1,${chunkSize}}`, "g")) || []
      chunks.forEach((chunk, i) => {
        res.cookies.set(`${cookieName}.${i}`, decodeURIComponent(chunk), cookieOpts)
      })
    }

    return res
  } catch (err: any) {
    console.error("[login] error:", err?.message, err?.stack?.split("\n")[1])
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}

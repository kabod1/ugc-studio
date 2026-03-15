import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
    const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()
    const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()

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
    const userMeta = authData.user?.user_metadata || {}

    const svcHeaders = {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Prefer": "resolution=merge-duplicates",
    }

    // Get role from profiles table, fall back to user_metadata
    let role = userMeta.role || "brand"
    try {
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=role&limit=1`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
      )
      const profiles = await profileRes.json()
      if (profiles?.[0]?.role) {
        role = profiles[0].role
      } else {
        // No profile record — create it now (handles users who signed up before the fix)
        await fetch(`${supabaseUrl}/rest/v1/profiles`, {
          method: "POST",
          headers: svcHeaders,
          body: JSON.stringify({ id: userId, role, plan: "free", generations_used: 0, generations_limit: 10 }),
        })
        if (role === "creator") {
          await fetch(`${supabaseUrl}/rest/v1/creator_profiles`, {
            method: "POST",
            headers: svcHeaders,
            body: JSON.stringify({
              user_id: userId,
              display_name: userMeta.full_name || "",
              tiktok_followers: 0, instagram_followers: 0, youtube_subscribers: 0,
              platform_rating: 0, total_campaigns_completed: 0,
              age_verified: false, tax_form_submitted: false,
            }),
          })
        } else if (role === "brand") {
          await fetch(`${supabaseUrl}/rest/v1/brands`, {
            method: "POST",
            headers: svcHeaders,
            body: JSON.stringify({
              user_id: userId,
              company_name: userMeta.company_name || userMeta.full_name || "My Brand",
              subscription_tier: "free",
            }),
          })
        }
      }
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

    // Set role cookie so middleware can skip Edge Runtime DB fetch
    res.cookies.set("user-role", role, cookieOpts)

    return res
  } catch (err: any) {
    console.error("[login] error:", err?.message, err?.stack?.split("\n")[1])
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}

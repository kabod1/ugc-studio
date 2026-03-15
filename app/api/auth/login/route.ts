import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log("[login] received request for:", email)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Step 1: Sign in via direct REST call — bypass createServerClient entirely
    console.log("[login] calling supabase auth...")
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    })

    console.log("[login] auth status:", authRes.status)
    const authData = await authRes.json()

    if (!authRes.ok || authData.error || !authData.access_token) {
      console.log("[login] auth failed:", authData.error_description || authData.error || authData.message)
      return NextResponse.json(
        { error: authData.error_description || authData.error || authData.msg || "Invalid email or password" },
        { status: 401 }
      )
    }

    const userId = authData.user?.id
    console.log("[login] auth success, userId:", userId)

    // Step 2: Get role via service role key
    let role = "brand"
    try {
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=role&limit=1`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
        }
      )
      const profiles = await profileRes.json()
      console.log("[login] profiles:", JSON.stringify(profiles))
      if (profiles?.[0]?.role) role = profiles[0].role
    } catch (e) {
      console.log("[login] profile fetch error:", e)
    }

    console.log("[login] role:", role)
    const destination =
      role === "creator" ? "/creator" : role === "admin" ? "/admin" : "/dashboard"

    // Step 3: Build response with Supabase session cookies
    const res = NextResponse.json({ destination })

    // Set the auth session cookie that @supabase/ssr expects
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1] ?? ""
    const cookieName = `sb-${projectRef}-auth-token`

    const sessionValue = JSON.stringify([authData.access_token, authData.refresh_token])
    const encodedSession = Buffer.from(sessionValue).toString("base64url")

    const cookieOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "lax" as const,
      secure: true,
      maxAge: authData.expires_in ?? 3600,
    }

    // @supabase/ssr v0.3.x uses chunked base64url cookies
    // Chunk if > 3180 chars
    const chunkSize = 3180
    if (encodedSession.length <= chunkSize) {
      res.cookies.set(cookieName, encodedSession, cookieOptions)
      res.cookies.set(`${cookieName}.0`, encodedSession, cookieOptions)
    } else {
      const chunks = encodedSession.match(new RegExp(`.{1,${chunkSize}}`, "g")) || []
      chunks.forEach((chunk, i) => {
        res.cookies.set(`${cookieName}.${i}`, chunk, cookieOptions)
      })
    }

    console.log("[login] returning destination:", destination)
    return res
  } catch (err: any) {
    console.error("[login] unhandled error:", err?.message || err)
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 })
  }
}

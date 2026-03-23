import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, full_name, role, company_name } = await request.json()

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
    const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()
    const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()

    // 1. Create auth user
    const signupRes = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
        data: { full_name, role, company_name },
      }),
    })

    const signupData = await signupRes.json()

    if (!signupRes.ok || signupData.error) {
      return NextResponse.json(
        { error: signupData.error_description || signupData.msg || signupData.error || "Signup failed" },
        { status: 400 }
      )
    }

    const userId = signupData.id || signupData.user?.id
    if (!userId) {
      return NextResponse.json({ error: "User creation failed" }, { status: 500 })
    }

    const svcHeaders = {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Prefer": "resolution=merge-duplicates",
    }

    // 2. Create brand or creator_profiles placeholder
    if (role === "creator") {
      await fetch(`${supabaseUrl}/rest/v1/creator_profiles`, {
        method: "POST",
        headers: svcHeaders,
        body: JSON.stringify({
          user_id: userId,
          display_name: full_name || "",
          tiktok_followers: 0,
          instagram_followers: 0,
          youtube_subscribers: 0,
          platform_rating: 0,
          total_campaigns_completed: 0,
          age_verified: false,
          tax_form_submitted: false,
        }),
      })
    } else {
      await fetch(`${supabaseUrl}/rest/v1/brands`, {
        method: "POST",
        headers: svcHeaders,
        body: JSON.stringify({
          user_id: userId,
          company_name: company_name || full_name || "My Brand",
          subscription_tier: "free",
        }),
      })
    }

    // Check if email confirmation is required (user has no session yet)
    const needsConfirmation = !signupData.access_token

    const res = NextResponse.json({ success: true, needsConfirmation })

    // If auto-confirmed (no email needed), set session + role cookies now
    if (!needsConfirmation && signupData.access_token) {
      const supabaseUrl2 = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
      const projectRef = new URL(supabaseUrl2).hostname.split(".")[0]
      const cookieName = `sb-${projectRef}-auth-token`
      const session = {
        access_token: signupData.access_token,
        refresh_token: signupData.refresh_token,
        expires_in: signupData.expires_in,
        expires_at: signupData.expires_at,
        token_type: signupData.token_type || "bearer",
        user: signupData.user,
      }
      const cookieOpts = {
        path: "/",
        sameSite: "lax" as const,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 31536000,
      }
      const encoded = encodeURIComponent(JSON.stringify(session))
      if (encoded.length <= 3180) {
        res.cookies.set(cookieName, JSON.stringify(session), cookieOpts)
      } else {
        const chunks = encoded.match(/.{1,3180}/g) || []
        chunks.forEach((chunk, i) => {
          res.cookies.set(`${cookieName}.${i}`, decodeURIComponent(chunk), cookieOpts)
        })
      }
      res.cookies.set("user-role", role || "brand", cookieOpts)
    }

    return res
  } catch (err: any) {
    console.error("[signup] error:", err?.message)
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}

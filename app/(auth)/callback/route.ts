import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      const role = (user?.user_metadata?.role as string) || "brand"

      const destination =
        role === "creator" ? "/creator" :
        role === "admin" ? "/admin" :
        next

      const res = NextResponse.redirect(`${origin}${destination}`)

      // Set the user-role cookie so middleware can route correctly without a DB call
      const cookieOpts = {
        path: "/",
        sameSite: "lax" as const,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 31536000,
      }
      res.cookies.set("user-role", role, cookieOpts)

      return res
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { role: newRole } = await request.json()
    if (!["brand", "creator"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role. Must be 'brand' or 'creator'" }, { status: 400 })
    }

    const service = createServiceClient()

    // Update the auth user's metadata
    await service.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, role: newRole },
    })

    // Update the profiles table
    await service.from("profiles").update({ role: newRole }).eq("id", user.id)

    // Auto-create the target profile row if this is the user's first time in this role
    if (newRole === "brand") {
      const { data: existing } = await service
        .from("brands")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!existing) {
        await service.from("brands").insert({
          user_id: user.id,
          company_name:
            user.user_metadata?.company_name ||
            user.user_metadata?.full_name ||
            user.email ||
            "My Brand",
          subscription_tier: "free",
        })
      }
    } else {
      const { data: existing } = await service
        .from("creator_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!existing) {
        await service.from("creator_profiles").insert({
          user_id: user.id,
          display_name: user.user_metadata?.full_name || "",
          tiktok_followers: 0,
          instagram_followers: 0,
          youtube_subscribers: 0,
          platform_rating: 0,
          total_campaigns_completed: 0,
          age_verified: false,
          tax_form_submitted: false,
        })
      }
    }

    const cookieOpts = {
      path: "/",
      sameSite: "lax" as const,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 31536000,
    }

    const redirectTo = newRole === "brand" ? "/dashboard" : "/creator"
    const response = NextResponse.json({ success: true, redirectTo })
    response.cookies.set("user-role", newRole, cookieOpts)
    return response
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
  }
}

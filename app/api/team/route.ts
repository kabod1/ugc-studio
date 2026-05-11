import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/constants"

function getTeamSeatLimit(tier: string): number {
  switch (tier) {
    case "free":
    case "starter":
      return 1
    case "growth":
      return 3
    case "scale":
      return -1 // unlimited
    default:
      return 1
  }
}

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    const { data: members, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const tier = brand.subscription_tier || "free"
    const limit = getTeamSeatLimit(tier)

    return NextResponse.json({
      members: members ?? [],
      currentCount: members?.length ?? 0,
      limit,
    })
  } catch (err) {
    console.error("GET /api/team error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email, role } = body

    if (!email || !role || !["admin", "member"].includes(role)) {
      return NextResponse.json({ error: "Invalid email or role" }, { status: 400 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    const tier = brand.subscription_tier || "free"
    const limit = getTeamSeatLimit(tier)

    // Check seat limit (skip if unlimited or admin)
    if (limit !== -1 && !isAdminEmail(user.email)) {
      const { count } = await supabase
        .from("team_members")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)

      if ((count ?? 0) >= limit) {
        return NextResponse.json({
          error: "Team seat limit reached. Please upgrade your plan to invite more members.",
          currentCount: count ?? 0,
          limit,
          upgradeUrl: "/dashboard/settings/billing",
        }, { status: 403 })
      }
    }

    const { data: member, error } = await supabase
      .from("team_members")
      .insert({
        brand_id: brand.id,
        email,
        role,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ member }, { status: 201 })
  } catch (err) {
    console.error("POST /api/team error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { memberId } = body

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId)
      .eq("brand_id", brand.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/team error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

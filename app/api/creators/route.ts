import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const platform = searchParams.get("platform")
    const minFollowers = searchParams.get("min_followers")
    const maxRate = searchParams.get("max_rate")
    const search = searchParams.get("search")

    let query = supabase
      .from("creator_profiles")
      .select("*, profiles(email, full_name, avatar_url)")
      .eq("is_verified", true)

    if (category) query = query.contains("categories", [category])
    if (platform) query = query.contains("platforms", [platform])
    if (minFollowers) query = query.gte("follower_count", parseInt(minFollowers))
    if (maxRate) query = query.lte("hourly_rate_cents", parseInt(maxRate))
    if (search) query = query.ilike("display_name", `%${search}%`)

    const { data, error } = await query.order("avg_rating", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

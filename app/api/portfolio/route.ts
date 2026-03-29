import { NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()
    const { data: profile } = await svc
      .from("creator_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single()

    if (!profile) return NextResponse.json({ items: [] })

    const { data: items } = await svc
      .from("portfolio_items")
      .select("*")
      .eq("creator_id", profile.id)
      .order("created_at", { ascending: false })

    return NextResponse.json({ items: items || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { type, title, url, brand, description } = body

    if (!type || !title || !url) {
      return NextResponse.json({ error: "type, title, and url are required" }, { status: 400 })
    }

    const svc = createServiceClient()
    const { data: profile } = await svc
      .from("creator_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single()

    if (!profile) return NextResponse.json({ error: "Creator profile not found" }, { status: 404 })

    const { data: item, error } = await svc
      .from("portfolio_items")
      .insert({ creator_id: profile.id, type, title, url, brand: brand || null, description: description || null })
      .select()
      .single()

    if (error) {
      // Table may not exist yet — guide user to run migration
      if (error.code === "42P01") {
        return NextResponse.json({
          error: "Portfolio table not set up. Please run the SQL migration in your Supabase dashboard.",
        }, { status: 500 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ item })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const svc = createServiceClient()
    const url = new URL(request.url)
    const userId = url.searchParams.get("id")
    const role = url.searchParams.get("role")
    const search = url.searchParams.get("search")

    if (userId) {
      // Single user fetch
      const { data, error } = await svc.from("profiles").select("*").eq("id", userId).single()
      if (error || !data) return NextResponse.json({ error: "User not found" }, { status: 404 })
      return NextResponse.json(data)
    }

    // List users
    let query = svc.from("profiles").select("*").order("created_at", { ascending: false })
    if (role && role !== "all") query = query.eq("role", role)
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)

    const { data: users } = await query.limit(100)
    return NextResponse.json(users || [])
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svcAuth = createServiceClient()
    const { data: profile } = await svcAuth
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
      const { data: authUser, error: authErr } = await svc.auth.admin.getUserById(userId)
      if (authErr || !authUser.user) return NextResponse.json({ error: "User not found" }, { status: 404 })
      const { data: prof } = await svc.from("profiles").select("role, created_at").eq("id", userId).single()
      const u = authUser.user
      return NextResponse.json({
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || u.user_metadata?.name || "",
        role: prof?.role || u.user_metadata?.role || "brand",
        created_at: prof?.created_at || u.created_at,
        is_verified: !!u.email_confirmed_at,
        is_active: !u.banned_until,
        phone: u.phone || "",
      })
    }

    // List users
    const { data: authData } = await svc.auth.admin.listUsers({ perPage: 200 })
    const { data: profiles } = await svc.from("profiles").select("id, role, created_at")
    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))
    let users = (authData?.users || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      full_name: u.user_metadata?.full_name || u.user_metadata?.name || "",
      role: profileMap.get(u.id)?.role || u.user_metadata?.role || "brand",
      created_at: profileMap.get(u.id)?.created_at || u.created_at,
      is_verified: !!u.email_confirmed_at,
      is_active: !u.banned_until,
    }))
    if (role && role !== "all") users = users.filter((u: any) => u.role === role)
    if (search) {
      const q = search.toLowerCase()
      users = users.filter((u: any) => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
    }
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

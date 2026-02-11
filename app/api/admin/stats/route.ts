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

    const [users, brands, creators, campaigns, content, payments] = await Promise.all([
      svc.from("profiles").select("id", { count: "exact", head: true }),
      svc.from("brands").select("id", { count: "exact", head: true }),
      svc.from("creator_profiles").select("id", { count: "exact", head: true }),
      svc.from("campaigns").select("id", { count: "exact", head: true }),
      svc.from("content_submissions").select("id", { count: "exact", head: true }),
      svc.from("payments").select("amount_cents").eq("status", "completed"),
    ])

    const totalRevenue = payments.data?.reduce((sum: number, p: any) => sum + (p.amount_cents || 0), 0) || 0

    return NextResponse.json({
      total_users: users.count || 0,
      total_brands: brands.count || 0,
      total_creators: creators.count || 0,
      total_campaigns: campaigns.count || 0,
      total_content: content.count || 0,
      total_revenue_cents: totalRevenue,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Use service client for role check (avoids RLS recursion)
    const svc = createServiceClient()
    const { data: profile } = await svc.from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [authData, brands, creators, campaigns, content, payments, recentBrands, recentCreators, activeCampaigns] = await Promise.all([
      svc.auth.admin.listUsers({ perPage: 1000 }),
      svc.from("brands").select("id", { count: "exact", head: true }),
      svc.from("creator_profiles").select("id", { count: "exact", head: true }),
      svc.from("campaigns").select("id", { count: "exact", head: true }),
      svc.from("content_submissions").select("id", { count: "exact", head: true }),
      svc.from("payments").select("amount_cents").eq("status", "completed"),
      svc.from("brands").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
      svc.from("creator_profiles").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
      svc.from("campaigns").select("id", { count: "exact", head: true }).eq("status", "active"),
    ])

    const totalUsers = authData.data?.users?.length || 0
    const newUsersLast30Days = authData.data?.users?.filter(
      (u: any) => new Date(u.created_at) >= new Date(thirtyDaysAgo)
    ).length || 0
    const newUsersLast7Days = authData.data?.users?.filter(
      (u: any) => new Date(u.created_at) >= new Date(sevenDaysAgo)
    ).length || 0

    const totalRevenue = payments.data?.reduce((sum: number, p: any) => sum + (p.amount_cents || 0), 0) || 0

    return NextResponse.json({
      total_users: totalUsers,
      total_brands: brands.count || 0,
      total_creators: creators.count || 0,
      total_campaigns: campaigns.count || 0,
      total_content: content.count || 0,
      total_revenue_cents: totalRevenue,
      new_users_30d: newUsersLast30Days,
      new_users_7d: newUsersLast7Days,
      new_brands_30d: recentBrands.count || 0,
      new_creators_30d: recentCreators.count || 0,
      active_campaigns: activeCampaigns.count || 0,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

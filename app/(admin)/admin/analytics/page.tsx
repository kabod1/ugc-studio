import { createServiceClient } from "@/lib/supabase/server"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { Users, Megaphone, DollarSign, BarChart3, TrendingUp, UserPlus, Building2, Star } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const svc = createServiceClient()

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

  const allUsers = authData.data?.users || []
  const totalUsers = allUsers.length
  const newUsers30d = allUsers.filter((u: any) => new Date(u.created_at) >= new Date(thirtyDaysAgo)).length
  const newUsers7d = allUsers.filter((u: any) => new Date(u.created_at) >= new Date(sevenDaysAgo)).length
  const totalRevenue = payments.data?.reduce((s: number, p: any) => s + (p.amount_cents || 0), 0) || 0

  // Recent signups (last 10)
  const recentSignups = [...allUsers]
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  const statCards = [
    { label: "Total Users", value: formatNumber(totalUsers), sub: `+${newUsers7d} this week`, icon: Users, color: "text-blue-600 bg-blue-100" },
    { label: "Brands", value: formatNumber(brands.count || 0), sub: `+${recentBrands.count || 0} this month`, icon: Building2, color: "text-purple-600 bg-purple-100" },
    { label: "Creators", value: formatNumber(creators.count || 0), sub: `+${recentCreators.count || 0} this month`, icon: Star, color: "text-pink-600 bg-pink-100" },
    { label: "Active Campaigns", value: formatNumber(activeCampaigns.count || 0), sub: `${campaigns.count || 0} total`, icon: Megaphone, color: "text-green-600 bg-green-100" },
    { label: "Platform Revenue", value: formatCurrency(totalRevenue), sub: "Completed payments", icon: DollarSign, color: "text-orange-600 bg-orange-100" },
    { label: "Content Pieces", value: formatNumber(content.count || 0), sub: "All submissions", icon: BarChart3, color: "text-teal-600 bg-teal-100" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Key platform metrics and insights</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card border rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
              <div className={`p-3 rounded-lg ${s.color}`}><s.icon className="h-5 w-5" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-sm font-medium">New Signups (7 days)</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{newUsers7d}</p>
        </div>
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium">New Signups (30 days)</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{newUsers30d}</p>
        </div>
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-purple-600" />
            <p className="text-sm font-medium">Total Registered Users</p>
          </div>
          <p className="text-3xl font-bold text-purple-600">{totalUsers}</p>
        </div>
      </div>

      {/* Recent signups */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Recent Signups</h2>
          <p className="text-sm text-muted-foreground">Latest users who joined the platform</p>
        </div>
        <div className="divide-y">
          {recentSignups.map((u: any) => (
            <div key={u.id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {(u.user_metadata?.full_name || u.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{u.user_metadata?.full_name || "No name"}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  u.user_metadata?.role === "creator" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                }`}>{u.user_metadata?.role || "brand"}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
          {recentSignups.length === 0 && (
            <p className="p-8 text-center text-muted-foreground text-sm">No signups yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

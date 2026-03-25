import { createServiceClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import {
  Users, Building2, Palette, Megaphone, DollarSign,
  ShieldCheck, ArrowRight, TrendingUp, AlertCircle
} from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = createServiceClient()

  const [
    { count: totalCreators },
    { count: activeCampaigns },
    { data: payments },
    { count: pendingVerifications },
    { count: pendingContent },
    { data: authData },
  ] = await Promise.all([
    supabase.from("creator_profiles").select("*", { count: "exact", head: true }),
    supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("payments").select("amount_cents, platform_fee_cents").eq("status", "released"),
    supabase.from("creator_profiles").select("*", { count: "exact", head: true }).eq("is_featured", false).eq("age_verified", false),
    supabase.from("content_submissions").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ])

  const allUsers = authData?.users || []
  const totalUsers = allUsers.length
  const totalBrands = allUsers.filter((u: any) => {
    const role = u.user_metadata?.role
    return !role || role === "brand"
  }).length
  const recentUsers = allUsers
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map((u: any) => ({
      id: u.id,
      full_name: u.user_metadata?.full_name || u.user_metadata?.company_name || "",
      email: u.email,
      role: u.user_metadata?.role || "brand",
      created_at: u.created_at,
    }))

  const totalRevenue = payments?.reduce((sum, p) => sum + (p.platform_fee_cents || 0), 0) || 0
  const totalVolume = payments?.reduce((sum, p) => sum + p.amount_cents, 0) || 0

  const stats = [
    { label: "Total Users", value: totalUsers || 0, icon: Users, color: "text-blue-600 bg-blue-100", href: "/admin/users" },
    { label: "Brands", value: totalBrands || 0, icon: Building2, color: "text-purple-600 bg-purple-100", href: "/admin/brands" },
    { label: "Creators", value: totalCreators || 0, icon: Palette, color: "text-pink-600 bg-pink-100", href: "/admin/creators" },
    { label: "Active Campaigns", value: activeCampaigns || 0, icon: Megaphone, color: "text-green-600 bg-green-100", href: "/admin/campaigns" },
    { label: "Platform Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-orange-600 bg-orange-100", href: "/admin/payments" },
    { label: "Total Volume", value: formatCurrency(totalVolume), icon: TrendingUp, color: "text-teal-600 bg-teal-100", href: "/admin/payments" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-card border rounded-lg p-5 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(pendingVerifications ?? 0) > 0 && (
          <Link href="/admin/creators" className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between hover:bg-yellow-100/50 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">{pendingVerifications} creators pending verification</p>
                <p className="text-sm text-muted-foreground">Review and verify creator profiles</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}

        {(pendingContent ?? 0) > 0 && (
          <Link href="/admin/content" className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between hover:bg-blue-100/50 transition-colors">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">{pendingContent} content submissions to review</p>
                <p className="text-sm text-muted-foreground">Moderate submitted content</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </div>

      {/* Recent Users */}
      <div className="bg-card border rounded-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold">Recent Users</h2>
          <Link href="/admin/users" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="divide-y">
          {recentUsers?.map((u: any) => (
            <Link key={u.id} href={`/admin/users/${u.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {(u.full_name || u.email || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{u.full_name || "No name"}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  u.role === "admin" ? "bg-red-100 text-red-800" :
                  u.role === "creator" ? "bg-purple-100 text-purple-800" :
                  "bg-blue-100 text-blue-800"
                }`}>{u.role}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

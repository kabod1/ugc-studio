import { createClient, createServiceClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Megaphone, FileVideo, DollarSign, TrendingUp,
  Plus, ArrowRight, Clock
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const service = createServiceClient()

  const { data: brand } = await service
    .from("brands")
    .select("id")
    .eq("user_id", session.user.id)
    .single()

  if (!brand) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome! Get started by setting up your brand.</p>
        </div>
        <div className="bg-card border rounded-lg p-8 text-center">
          <Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Set up your brand to get started</p>
          <p className="text-sm text-muted-foreground mb-4">Complete your brand profile to start creating campaigns</p>
          <Link href="/dashboard/settings/brand" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            Set Up Brand
          </Link>
        </div>
      </div>
    )
  }

  // Get campaign IDs first (needed for sub-queries)
  const { data: campaignIds } = await service.from("campaigns").select("id").eq("brand_id", brand.id)
  const ids = (campaignIds || []).map((c: any) => c.id)

  // Fetch stats in parallel
  const [
    { count: totalCampaigns },
    { count: activeCampaigns },
    { count: totalSubmissions },
    { data: payments },
    { data: recentCampaigns },
    { count: pendingApplications },
  ] = await Promise.all([
    service.from("campaigns").select("*", { count: "exact", head: true }).eq("brand_id", brand.id),
    service.from("campaigns").select("*", { count: "exact", head: true }).eq("brand_id", brand.id).eq("status", "active"),
    ids.length > 0
      ? service.from("content_submissions").select("*", { count: "exact", head: true }).in("campaign_id", ids)
      : Promise.resolve({ count: 0, data: null, error: null, status: 200, statusText: "OK" }),
    service.from("payments").select("amount_cents").eq("brand_id", brand.id).eq("status", "released"),
    service.from("campaigns").select("*, campaign_applications(count), content_submissions(count)")
      .eq("brand_id", brand.id).order("created_at", { ascending: false }).limit(5),
    ids.length > 0
      ? service.from("campaign_applications").select("*", { count: "exact", head: true }).eq("status", "pending").in("campaign_id", ids)
      : Promise.resolve({ count: 0, data: null, error: null, status: 200, statusText: "OK" }),
  ])

  const totalSpent = payments?.reduce((sum, p) => sum + p.amount_cents, 0) || 0

  const stats = [
    { label: "Total Campaigns", value: totalCampaigns || 0, icon: Megaphone, color: "text-blue-600 bg-blue-100" },
    { label: "Active Campaigns", value: activeCampaigns || 0, icon: TrendingUp, color: "text-green-600 bg-green-100" },
    { label: "Content Submissions", value: totalSubmissions || 0, icon: FileVideo, color: "text-purple-600 bg-purple-100" },
    { label: "Total Spent", value: formatCurrency(totalSpent), icon: DollarSign, color: "text-orange-600 bg-orange-100" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your campaign overview.</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={cn_static(stat.color, "p-3 rounded-lg")}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {(pendingApplications ?? 0) > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">You have {pendingApplications} pending applications</p>
              <p className="text-sm text-muted-foreground">Review creator applications for your active campaigns</p>
            </div>
          </div>
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Review <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Recent Campaigns */}
      <div className="bg-card border rounded-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold">Recent Campaigns</h2>
          <Link href="/dashboard/campaigns" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {recentCampaigns && recentCampaigns.length > 0 ? (
          <div className="divide-y">
            {recentCampaigns.map((campaign: any) => (
              <Link
                key={campaign.id}
                href={`/dashboard/campaigns/${campaign.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{campaign.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.content_types?.join(", ") || "No content types set"}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === "active" ? "bg-green-100 text-green-800" :
                    campaign.status === "draft" ? "bg-gray-100 text-gray-800" :
                    campaign.status === "completed" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {campaign.status}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(campaign.budget_cents)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No campaigns yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first campaign to start working with creators</p>
            <Link
              href="/dashboard/campaigns/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function cn_static(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

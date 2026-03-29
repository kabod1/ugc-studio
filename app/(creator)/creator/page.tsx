import { createClient, createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  DollarSign,
  Megaphone,
  FileVideo,
  Star,
  ArrowRight,
  Clock,
  Briefcase,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

export default async function CreatorOverviewPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect("/login")
  const user = session.user

  const svc = createServiceClient()
  let { data: creatorProfile } = await svc
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!creatorProfile) {
    const { data: newProfile } = await svc
      .from("creator_profiles")
      .insert({
        user_id: user.id,
        display_name: (user.user_metadata?.full_name as string) || user.email || "",
        tiktok_followers: 0,
        instagram_followers: 0,
        youtube_subscribers: 0,
        platform_rating: 0,
        total_campaigns_completed: 0,
        age_verified: false,
        tax_form_submitted: false,
      })
      .select()
      .single()
    creatorProfile = newProfile
  }

  if (!creatorProfile) redirect("/login")

  const { data: activeCampaigns, count: activeCampaignsCount } = await supabase
    .from("campaign_applications")
    .select("*, campaign:campaigns(*)", { count: "exact" })
    .eq("creator_id", creatorProfile.id)
    .eq("status", "accepted")

  const { count: contentCount } = await supabase
    .from("content_submissions")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", creatorProfile.id)

  const { data: payments } = await supabase
    .from("payments")
    .select("creator_payout_cents, status")
    .eq("creator_id", creatorProfile.id)
    .in("status", ["released", "escrow", "completed"])

  const totalEarnings = payments?.reduce(
    (sum, p) => sum + (p.status === "completed" || p.status === "released" ? p.creator_payout_cents : 0),
    0
  ) ?? 0

  const { count: availableCampaignsCount } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: pendingApplicationsCount } = await supabase
    .from("campaign_applications")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", creatorProfile.id)
    .eq("status", "pending")

  const { data: recentActivity } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const firstName = creatorProfile.display_name?.split(" ")[0] || "Creator"

  const actionCards = [
    {
      label: "Browse Campaigns",
      count: availableCampaignsCount ?? 0,
      sub: "active opportunities",
      href: "/creator/campaigns",
      icon: Megaphone,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "My Applications",
      count: pendingApplicationsCount ?? 0,
      sub: "pending review",
      href: "/creator/my-campaigns",
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Content Submitted",
      count: contentCount ?? 0,
      sub: "total pieces",
      href: "/creator/content",
      icon: FileVideo,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Active Campaigns",
      count: activeCampaignsCount ?? 0,
      sub: "in progress",
      href: "/creator/my-campaigns",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero earnings banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <p className="text-sm font-medium opacity-80">Welcome back, {firstName}</p>
        <p className="text-4xl font-bold mt-1">{formatCurrency(totalEarnings)}</p>
        <p className="text-sm opacity-70 mt-1">Total lifetime earnings</p>
        <div className="flex items-center gap-2 mt-4">
          <Link
            href="/creator/earnings"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            View Earnings
          </Link>
          <Link
            href="/creator/campaigns"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Find Campaigns
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Rating chip */}
      {creatorProfile.platform_rating > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-foreground">{creatorProfile.platform_rating.toFixed(1)}</span>
          creator rating from brands
        </div>
      )}

      {/* Action cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actionCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-card border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{card.count}</p>
            <p className="text-sm font-medium mt-0.5">{card.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick access */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/creator/training"
          className="bg-card border rounded-xl p-5 hover:border-primary/40 transition-all flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Creator Training</p>
            <p className="text-sm text-muted-foreground">Learn to land better brand deals</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link
          href="/creator/portfolio"
          className="bg-card border rounded-xl p-5 hover:border-primary/40 transition-all flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">My Portfolio</p>
            <p className="text-sm text-muted-foreground">Showcase your work to brands</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Active campaigns */}
      {activeCampaigns && activeCampaigns.length > 0 && (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold">Active Campaigns</h3>
            <p className="text-sm text-muted-foreground">Campaigns you are currently working on</p>
          </div>
          <div className="divide-y">
            {activeCampaigns.map((app) => (
              <Link
                key={app.id}
                href={`/creator/my-campaigns/${app.campaign_id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{app.campaign?.title ?? "Untitled Campaign"}</p>
                  <p className="text-xs text-muted-foreground">
                    {app.campaign?.content_deadline
                      ? `Due ${formatDate(app.campaign.content_deadline)}`
                      : "No deadline set"}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentActivity && recentActivity.length > 0 && (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="divide-y">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 px-5 py-4">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(activity.created_at)}</p>
                </div>
                {!activity.is_read && (
                  <span className="shrink-0 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

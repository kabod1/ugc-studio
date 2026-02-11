import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Megaphone,
  FileVideo,
  Star,
  ArrowRight,
  Clock,
} from "lucide-react"

export default async function CreatorOverviewPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Fetch creator profile
  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!creatorProfile) redirect("/login")

  // Fetch active campaigns (accepted applications)
  const { data: activeCampaigns, count: activeCampaignsCount } = await supabase
    .from("campaign_applications")
    .select("*, campaign:campaigns(*)", { count: "exact" })
    .eq("creator_id", creatorProfile.id)
    .eq("status", "accepted")

  // Fetch content submissions count
  const { count: contentCount } = await supabase
    .from("content_submissions")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", creatorProfile.id)

  // Fetch total earnings
  const { data: payments } = await supabase
    .from("payments")
    .select("creator_payout_cents, status")
    .eq("creator_id", creatorProfile.id)
    .in("status", ["released", "in_escrow"])

  const totalEarnings = payments?.reduce(
    (sum, p) => sum + (p.status === "released" ? p.creator_payout_cents : 0),
    0
  ) ?? 0

  // Fetch available campaigns count
  const { count: availableCampaignsCount } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Fetch recent notifications as activity
  const { data: recentActivity } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Total Earnings",
      value: formatCurrency(totalEarnings),
      description: "Lifetime earnings",
      icon: DollarSign,
    },
    {
      title: "Active Campaigns",
      value: activeCampaignsCount ?? 0,
      description: "Currently working on",
      icon: Megaphone,
    },
    {
      title: "Content Submitted",
      value: contentCount ?? 0,
      description: "Total submissions",
      icon: FileVideo,
    },
    {
      title: "Avg Rating",
      value:
        creatorProfile.platform_rating > 0
          ? creatorProfile.platform_rating.toFixed(1)
          : "N/A",
      description: "From brands",
      icon: Star,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {creatorProfile.display_name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is an overview of your creator activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Available Campaigns CTA */}
        <Card>
          <CardHeader>
            <CardTitle>Browse Campaigns</CardTitle>
            <CardDescription>
              There {availableCampaignsCount === 1 ? "is" : "are"}{" "}
              <span className="font-semibold text-primary">
                {availableCampaignsCount ?? 0}
              </span>{" "}
              active campaign{availableCampaignsCount !== 1 ? "s" : ""} available
              right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/creator/campaigns">
                Browse Campaigns
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest notifications and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                    {!activity.is_read && (
                      <Badge variant="secondary" className="shrink-0">
                        New
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity to show.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns Summary */}
      {activeCampaigns && activeCampaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Active Campaigns</CardTitle>
            <CardDescription>
              Campaigns you are currently working on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCampaigns.map((app) => (
                <Link
                  key={app.id}
                  href={`/creator/my-campaigns/${app.campaign_id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {app.campaign?.title ?? "Untitled Campaign"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {app.campaign?.content_deadline
                        ? `Due ${formatDate(app.campaign.content_deadline)}`
                        : "No deadline set"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

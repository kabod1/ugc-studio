import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Users, FileVideo, BarChart3, ScrollText, Clock, DollarSign } from "lucide-react"

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!campaign) return <div className="p-12 text-center text-muted-foreground">Campaign not found</div>

  const { count: applicationCount } = await supabase
    .from("campaign_applications")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", params.id)

  const { count: contentCount } = await supabase
    .from("content_submissions")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", params.id)

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/campaigns" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{campaign.title}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status] || ""}`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-muted-foreground">{campaign.description || "No description"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href={`/dashboard/campaigns/${params.id}/applications`} className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Users className="h-4 w-4" /> Applications</div>
          <p className="text-2xl font-bold">{applicationCount || 0}</p>
        </Link>
        <Link href={`/dashboard/content`} className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><FileVideo className="h-4 w-4" /> Content</div>
          <p className="text-2xl font-bold">{contentCount || 0}</p>
        </Link>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><DollarSign className="h-4 w-4" /> Budget</div>
          <p className="text-2xl font-bold">{formatCurrency(campaign.budget_cents)}</p>
        </div>
        <Link href={`/dashboard/campaigns/${params.id}/analytics`} className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><BarChart3 className="h-4 w-4" /> Analytics</div>
          <p className="text-sm text-muted-foreground mt-1">View performance</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Brief</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.brief || "No brief provided"}</p>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Requirements</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Content Types: </span>
              <span>{campaign.content_types?.join(", ") || "Any"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Platforms: </span>
              <span>{campaign.platforms?.join(", ") || "Any"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Max Creators: </span>
              <span>{campaign.max_creators}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Timeline</h2>
          <div className="space-y-3 text-sm">
            {campaign.start_date && <div><Clock className="h-3.5 w-3.5 inline mr-2 text-muted-foreground" />Start: {formatDate(campaign.start_date)}</div>}
            {campaign.content_deadline && <div><Clock className="h-3.5 w-3.5 inline mr-2 text-muted-foreground" />Content Deadline: {formatDate(campaign.content_deadline)}</div>}
            {campaign.end_date && <div><Clock className="h-3.5 w-3.5 inline mr-2 text-muted-foreground" />End: {formatDate(campaign.end_date)}</div>}
          </div>
        </div>

        {campaign.style_guidelines && (
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Style Guidelines</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.style_guidelines}</p>
          </div>
        )}
      </div>
    </div>
  )
}

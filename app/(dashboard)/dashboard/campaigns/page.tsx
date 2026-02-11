import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Plus, Megaphone, ArrowRight, Search } from "lucide-react"
import { CampaignFilters } from "@/components/dashboard/campaign-filters"

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", user!.id)
    .single()

  let query = supabase
    .from("campaigns")
    .select("*")
    .eq("brand_id", brand!.id)
    .order("created_at", { ascending: false })

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status)
  }

  if (searchParams.search) {
    query = query.ilike("title", `%${searchParams.search}%`)
  }

  const { data: campaigns } = await query

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage your UGC campaigns</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      <CampaignFilters />

      {campaigns && campaigns.length > 0 ? (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/campaigns/${campaign.id}`}
              className="bg-card border rounded-lg p-5 hover:border-primary/50 transition-colors block"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{campaign.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status] || ""}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {campaign.description || "No description"}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <span>Budget: {formatCurrency(campaign.budget_cents)}</span>
                <span>Max creators: {campaign.max_creators}</span>
                {campaign.content_deadline && (
                  <span>Deadline: {formatDate(campaign.content_deadline)}</span>
                )}
                <span>Types: {campaign.content_types?.join(", ") || "Any"}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No campaigns found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchParams.status || searchParams.search
              ? "Try adjusting your filters"
              : "Create your first campaign to start working with creators"}
          </p>
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
  )
}

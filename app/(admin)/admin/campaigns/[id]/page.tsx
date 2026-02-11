import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function AdminCampaignDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: campaign } = await supabase.from("campaigns").select("*, brands(company_name)").eq("id", params.id).single()
  if (!campaign) return <div className="p-12 text-center"><p>Campaign not found</p></div>

  const { count: appCount } = await supabase.from("campaign_applications").select("*", { count: "exact", head: true }).eq("campaign_id", params.id)
  const { count: subCount } = await supabase.from("content_submissions").select("*", { count: "exact", head: true }).eq("campaign_id", params.id)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/campaigns" className="p-2 rounded-md hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div><h1 className="text-2xl font-bold">{campaign.title}</h1><p className="text-muted-foreground">by {campaign.brands?.company_name}</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center"><p className="text-2xl font-bold">{appCount || 0}</p><p className="text-sm text-muted-foreground">Applications</p></div>
        <div className="bg-card border rounded-lg p-4 text-center"><p className="text-2xl font-bold">{subCount || 0}</p><p className="text-sm text-muted-foreground">Submissions</p></div>
        <div className="bg-card border rounded-lg p-4 text-center"><p className="text-2xl font-bold">{formatCurrency(campaign.budget_cents)}</p><p className="text-sm text-muted-foreground">Budget</p></div>
      </div>
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{campaign.status}</p></div>
          <div><p className="text-muted-foreground">Content Types</p><p>{campaign.content_types?.join(", ") || "Any"}</p></div>
          <div><p className="text-muted-foreground">Max Creators</p><p>{campaign.max_creators}</p></div>
          <div><p className="text-muted-foreground">Usage Rights</p><p className="capitalize">{campaign.usage_rights?.replace("_", " ")}</p></div>
          <div><p className="text-muted-foreground">Created</p><p>{formatDate(campaign.created_at)}</p></div>
          {campaign.content_deadline && <div><p className="text-muted-foreground">Deadline</p><p>{formatDate(campaign.content_deadline)}</p></div>}
        </div>
        {campaign.brief_objective && <div className="pt-4 border-t"><p className="text-sm text-muted-foreground mb-1">Objective</p><p className="text-sm">{campaign.brief_objective}</p></div>}
        {campaign.description && <div><p className="text-sm text-muted-foreground mb-1">Description</p><p className="text-sm">{campaign.description}</p></div>}
      </div>
    </div>
  )
}

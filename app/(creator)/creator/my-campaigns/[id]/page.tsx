import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Plus, FileVideo } from "lucide-react"

export default async function MyCampaignDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single()

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*, brands(company_name)")
    .eq("id", params.id)
    .single()

  const { data: submissions } = await supabase
    .from("content_submissions")
    .select("*")
    .eq("campaign_id", params.id)
    .eq("creator_id", creator!.id)
    .order("created_at", { ascending: false })

  if (!campaign) return <div className="p-12 text-center text-muted-foreground">Campaign not found</div>

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    revision_requested: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/creator/my-campaigns" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{campaign.title}</h1>
          <p className="text-muted-foreground">{(campaign.brands as any)?.company_name}</p>
        </div>
        <Link href={`/creator/my-campaigns/${params.id}/submit`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Submit Content
        </Link>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="font-semibold mb-2">Campaign Brief</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.brief || campaign.description}</p>
        {campaign.content_deadline && (
          <p className="text-sm text-muted-foreground mt-3">Deadline: {formatDate(campaign.content_deadline)}</p>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-4">Your Submissions ({submissions?.length || 0})</h2>
        {submissions && submissions.length > 0 ? (
          <div className="grid gap-4">
            {submissions.map((s) => (
              <div key={s.id} className="bg-card border rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileVideo className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">v{s.version} &middot; {s.file_type} &middot; {formatDate(s.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.quality_score && <span className="text-sm font-medium text-primary">{s.quality_score}/100</span>}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || ""}`}>
                      {s.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                {s.brand_feedback && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm"><span className="font-medium">Feedback:</span> {s.brand_feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
            No submissions yet. Click &quot;Submit Content&quot; to get started.
          </div>
        )}
      </div>
    </div>
  )
}

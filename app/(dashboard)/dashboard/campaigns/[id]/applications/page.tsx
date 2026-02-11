import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"

export default async function ApplicationsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("title")
    .eq("id", params.id)
    .single()

  const { data: applications } = await supabase
    .from("campaign_applications")
    .select("*, creator_profiles(display_name, avatar_url, avg_rating, follower_count, categories)")
    .eq("campaign_id", params.id)
    .order("created_at", { ascending: false })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/campaigns/${params.id}`} className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted-foreground">{campaign?.title}</p>
        </div>
      </div>

      {applications && applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-card border rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {(app.creator_profiles as any)?.display_name?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold">{(app.creator_profiles as any)?.display_name || "Creator"}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {(app.creator_profiles as any)?.avg_rating && (
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" />{(app.creator_profiles as any).avg_rating}</span>
                      )}
                      <span>{(app.creator_profiles as any)?.follower_count?.toLocaleString() || 0} followers</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {app.ai_match_score && (
                    <span className="text-sm font-medium text-primary">{app.ai_match_score}% match</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] || ""}`}>
                    {app.status}
                  </span>
                </div>
              </div>
              {app.pitch && <p className="text-sm text-muted-foreground mt-3">{app.pitch}</p>}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Rate: {formatCurrency(app.proposed_rate_cents)} &middot; Applied: {formatDate(app.created_at)}
                </div>
                {app.status === "pending" && (
                  <div className="flex gap-2">
                    <form action={`/api/applications/${app.id}`} method="POST">
                      <button type="button" className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700">Accept</button>
                    </form>
                    <button type="button" className="px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-muted">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No applications yet</p>
        </div>
      )}
    </div>
  )
}

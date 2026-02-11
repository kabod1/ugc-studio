import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import { FileVideo } from "lucide-react"

export default async function CreatorContentPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single()

  const { data: submissions } = await supabase
    .from("content_submissions")
    .select("*, campaigns(title)")
    .eq("creator_id", creator!.id)
    .order("created_at", { ascending: false })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    revision_requested: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Content</h1>
        <p className="text-muted-foreground">All your content submissions</p>
      </div>

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
                    <p className="text-sm text-muted-foreground">{(s.campaigns as any)?.title} &middot; v{s.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.quality_score && <span className="text-sm font-medium text-primary">{s.quality_score}/100</span>}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || ""}`}>
                    {s.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-muted text-xs">{s.file_type}</span>
                <span>{formatDate(s.created_at)}</span>
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
        <div className="bg-card border rounded-lg p-12 text-center">
          <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No content yet</h3>
          <p className="text-muted-foreground mt-1">Submit content to your active campaigns</p>
        </div>
      )}
    </div>
  )
}

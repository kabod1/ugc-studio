import { createClient, createServiceClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { FileVideo, Eye } from "lucide-react"

export default async function ContentPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id
  if (!userId) return <div className="p-12 text-center text-muted-foreground">Not authenticated</div>

  const svc = createServiceClient()
  const { data: brand } = await svc.from("brands").select("id").eq("user_id", userId).single()
  if (!brand) return <div className="p-12 text-center text-muted-foreground">Brand profile not found. Please refresh the page.</div>

  const { data: submissions } = await supabase
    .from("content_submissions")
    .select("*, campaigns(title), creator_profiles(display_name)")
    .eq("campaigns.brand_id", brand.id)
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
        <h1 className="text-2xl font-bold">Content Hub</h1>
        <p className="text-muted-foreground">Review and manage content submissions</p>
      </div>

      {submissions && submissions.length > 0 ? (
        <div className="grid gap-4">
          {submissions.map((s) => (
            <Link key={s.id} href={`/dashboard/content/${s.id}`} className="bg-card border rounded-lg p-5 hover:border-primary/50 transition-colors block">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <FileVideo className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(s.campaigns as any)?.title} &middot; {(s.creator_profiles as any)?.display_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.quality_score && (
                    <span className="text-sm font-medium text-primary">{s.quality_score}/100</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || ""}`}>
                    {s.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-muted text-xs">{s.file_type}</span>
                <span>v{s.version}</span>
                <span>Submitted: {formatDate(s.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No content submissions yet</h3>
          <p className="text-muted-foreground mt-1">Content will appear here once creators submit their work</p>
        </div>
      )}
    </div>
  )
}

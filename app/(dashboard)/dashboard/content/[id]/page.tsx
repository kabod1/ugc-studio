import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react"

export default async function ContentDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: submission } = await supabase
    .from("content_submissions")
    .select("*, campaigns(title, brief), creator_profiles(display_name)")
    .eq("id", params.id)
    .single()

  if (!submission) return <div className="p-12 text-center text-muted-foreground">Content not found</div>

  const { data: comments } = await supabase
    .from("content_comments")
    .select("*, profiles(full_name)")
    .eq("submission_id", params.id)
    .order("created_at", { ascending: true })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    revision_requested: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/content" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{submission.title}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[submission.status] || ""}`}>
              {submission.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-muted-foreground">
            {(submission.campaigns as any)?.title} &middot; by {(submission.creator_profiles as any)?.display_name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
              {submission.file_type === "video" ? (
                <video src={submission.file_url} controls className="w-full h-full rounded-lg object-contain" />
              ) : submission.file_type === "image" ? (
                <img src={submission.file_url} alt={submission.title} className="w-full h-full rounded-lg object-contain" />
              ) : (
                <p className="text-muted-foreground">Preview not available for {submission.file_type}</p>
              )}
            </div>

            {submission.status === "pending" && (
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700">
                  <Check className="h-4 w-4" /> Approve
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-medium hover:bg-orange-700">
                  <RotateCcw className="h-4 w-4" /> Request Revision
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">
                  <X className="h-4 w-4" /> Reject
                </button>
              </div>
            )}
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Comments ({comments?.length || 0})</h3>
            {comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium shrink-0">
                      {(c.profiles as any)?.full_name?.[0] || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{(c.profiles as any)?.full_name}</span>
                        {c.timestamp_seconds && <span className="text-xs text-primary">@{Math.floor(c.timestamp_seconds / 60)}:{String(c.timestamp_seconds % 60).padStart(2, "0")}</span>}
                        <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Type:</span> {submission.file_type}</div>
              <div><span className="text-muted-foreground">Version:</span> {submission.version}</div>
              <div><span className="text-muted-foreground">Submitted:</span> {formatDate(submission.created_at)}</div>
              {submission.approved_at && <div><span className="text-muted-foreground">Approved:</span> {formatDate(submission.approved_at)}</div>}
            </div>
          </div>

          {submission.quality_score && (
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-3">AI Quality Score</h3>
              <div className="text-3xl font-bold text-primary mb-2">{submission.quality_score}/100</div>
              {submission.ai_quality_feedback && (
                <div className="space-y-2 text-sm text-muted-foreground">
                  {(submission.ai_quality_feedback as any).feedback?.technical && (
                    <div><span className="font-medium text-foreground">Technical:</span> {(submission.ai_quality_feedback as any).feedback.technical}</div>
                  )}
                  {(submission.ai_quality_feedback as any).feedback?.compliance && (
                    <div><span className="font-medium text-foreground">Compliance:</span> {(submission.ai_quality_feedback as any).feedback.compliance}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

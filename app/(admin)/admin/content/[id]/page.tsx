"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, Loader2, FileVideo } from "lucide-react"

export default function AdminContentDetailPage() {
  const { id } = useParams()
  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data } = await supabase
        .from("content_submissions")
        .select("*, creator_profiles(display_name), campaigns(title, brands(company_name)), content_comments(*, profiles(full_name))")
        .eq("id", id)
        .single()
      setSubmission(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  async function handleModerate(action: "flag") {
    const res = await fetch("/api/admin/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, entity_type: "content", entity_id: id }),
    })
    if (res.ok) toast.success("Content flagged")
    else toast.error("Failed")
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!submission) return <div className="p-12 text-center"><p>Submission not found</p></div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/content" className="p-2 rounded-md hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex-1"><h1 className="text-2xl font-bold">{submission.title || "Content Submission"}</h1>
          <p className="text-muted-foreground">by {submission.creator_profiles?.display_name} for {submission.campaigns?.title}</p>
        </div>
        <button onClick={() => handleModerate("flag")} className="px-4 py-2 rounded-md border border-destructive text-destructive text-sm hover:bg-destructive/10">Flag Content</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="bg-card border rounded-lg overflow-hidden">
          {submission.content_type === "video" || submission.file_type?.startsWith("video") ? (
            <video src={submission.file_url} controls className="w-full aspect-video object-cover" poster={submission.thumbnail_url} />
          ) : (
            <img src={submission.file_url || submission.thumbnail_url} alt={submission.title} className="w-full aspect-video object-cover" />
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-muted-foreground">Status</p><p className="capitalize">{submission.status?.replace("_", " ")}</p></div>
              <div><p className="text-muted-foreground">Type</p><p className="capitalize">{submission.content_type}</p></div>
              <div><p className="text-muted-foreground">Version</p><p>{submission.version}</p></div>
              <div><p className="text-muted-foreground">AI Score</p><p>{submission.ai_quality_score ? `${submission.ai_quality_score}/100` : "Not scored"}</p></div>
              <div><p className="text-muted-foreground">Created</p><p>{formatDate(submission.created_at)}</p></div>
              {submission.brand_rating && <div><p className="text-muted-foreground">Brand Rating</p><p>{submission.brand_rating}/5</p></div>}
            </div>
          </div>

          {submission.ai_quality_feedback && Object.keys(submission.ai_quality_feedback).length > 0 && (
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold mb-2">AI Quality Feedback</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">{JSON.stringify(submission.ai_quality_feedback, null, 2)}</pre>
            </div>
          )}

          {submission.content_comments?.length > 0 && (
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Comments ({submission.content_comments.length})</h3>
              <div className="space-y-2">
                {submission.content_comments.map((c: any) => (
                  <div key={c.id} className="bg-muted/50 rounded p-2 text-sm">
                    <p className="font-medium text-xs">{c.profiles?.full_name || "Unknown"} {c.timestamp_seconds != null && `@ ${Math.floor(c.timestamp_seconds)}s`}</p>
                    <p>{c.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Check, X, RotateCcw, Download, Loader2, Send } from "lucide-react"

interface Submission {
  id: string
  title: string
  status: string
  file_url: string | null
  file_type: string | null
  version: number
  quality_score: number | null
  ai_quality_feedback: any
  brand_feedback: string | null
  created_at: string
  approved_at: string | null
  campaigns: { title: string } | null
  creator_profiles: { display_name: string } | null
}

interface Comment {
  id: string
  content: string
  timestamp_seconds: number | null
  created_at: string
  profiles: { full_name: string } | null
}

export default function ContentDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [sendingComment, setSendingComment] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: sub } = await supabase
        .from("content_submissions")
        .select("*, campaigns(title, brief), creator_profiles(display_name)")
        .eq("id", id)
        .single()

      if (sub) setSubmission(sub)

      const { data: cmts } = await supabase
        .from("content_comments")
        .select("*, profiles(full_name)")
        .eq("submission_id", id)
        .order("created_at", { ascending: true })

      if (cmts) setComments(cmts)
      setLoading(false)
    }
    fetchData()
  }, [id])

  async function handleStatusUpdate(newStatus: string) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to update content")
      }
      const updated = await res.json()
      setSubmission((prev) => prev ? { ...prev, ...updated } : prev)
      toast.success(`Content ${newStatus.replace("_", " ")}`)
    } catch (err: any) {
      toast.error(err.message)
    }
    setUpdating(false)
  }

  async function handleAddComment() {
    if (!newComment.trim()) return
    setSendingComment(true)
    try {
      const res = await fetch(`/api/content/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })
      if (!res.ok) throw new Error("Failed to add comment")
      const comment = await res.json()
      setComments((prev) => [...prev, comment])
      setNewComment("")
      toast.success("Comment added")
    } catch (err: any) {
      toast.error(err.message)
    }
    setSendingComment(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!submission) {
    return <div className="p-12 text-center text-muted-foreground">Content not found</div>
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    revision_requested: "bg-orange-100 text-orange-800",
    submitted: "bg-blue-100 text-blue-800",
    in_progress: "bg-blue-100 text-blue-800",
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
                <video src={submission.file_url || ""} controls className="w-full h-full rounded-lg object-contain" />
              ) : submission.file_type === "image" ? (
                <img src={submission.file_url || ""} alt={submission.title} className="w-full h-full rounded-lg object-contain" />
              ) : (
                <p className="text-muted-foreground">Preview not available for {submission.file_type}</p>
              )}
            </div>

            <div className="flex gap-3">
              {(submission.status === "pending" || submission.status === "submitted") && (
                <>
                  <button
                    onClick={() => handleStatusUpdate("approved")}
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("revision_requested")}
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                    Request Revision
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Reject
                  </button>
                </>
              )}
              {submission.status === "approved" && submission.file_url && (
                <a
                  href={submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" /> Download Content
                </a>
              )}
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
            {comments.length > 0 ? (
              <div className="space-y-4 mb-4">
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
              <p className="text-sm text-muted-foreground mb-4">No comments yet</p>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={sendingComment || !newComment.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {sendingComment ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </div>
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

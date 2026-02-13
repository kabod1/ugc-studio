"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Video, Loader2, CheckCircle2, XCircle,
  Clock, Play, Download, RefreshCw, Sparkles, Image,
  MoreVertical, Trash2, RotateCcw, Copy, ExternalLink
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"

interface UGCVideoUsage {
  used: number
  limit: number
  tier: string
}

interface UGCVideoJob {
  id: string
  status: string
  product_image_url: string
  generated_image_url: string | null
  video_url: string | null
  caption: string | null
  tts_script: string | null
  error_message: string | null
  created_at: string
  completed_at: string | null
}

export default function UGCVideosPage() {
  const [jobs, setJobs] = useState<UGCVideoJob[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [productImageUrl, setProductImageUrl] = useState("")
  const [pollingJobId, setPollingJobId] = useState<string | null>(null)
  const [usage, setUsage] = useState<UGCVideoUsage | null>(null)

  useEffect(() => {
    fetchJobs()
    fetchUsage()
  }, [])

  async function fetchUsage() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: brand } = await supabase
        .from("brands")
        .select("id, subscription_tier")
        .eq("user_id", user.id)
        .single()

      if (!brand) return

      const tier = (brand.subscription_tier || "free") as SubscriptionTier
      const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const { count } = await supabase
        .from("ugc_video_jobs")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)
        .gte("created_at", startOfMonth)

      setUsage({
        used: count ?? 0,
        limit: tierConfig.ugcVideosPerMonth,
        tier: tierConfig.name,
      })
    } catch {
      // Silently fail
    }
  }

  // Poll for job completion
  useEffect(() => {
    if (!pollingJobId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/n8n/ugc-video-status?job_id=${pollingJobId}`)
        const job = await res.json()

        if (job.status === "completed" || job.status === "failed") {
          setPollingJobId(null)
          fetchJobs()
          if (job.status === "completed") {
            toast.success("UGC video generated successfully!")
          } else {
            toast.error("Video generation failed: " + (job.error_message || "Unknown error"))
          }
        }
      } catch {
        // Continue polling
      }
    }, 15000) // Poll every 15 seconds

    return () => clearInterval(interval)
  }, [pollingJobId])

  async function fetchJobs() {
    try {
      const res = await fetch("/api/ugc-videos")
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs || [])
      }
    } catch (err) {
      console.error("Failed to fetch UGC jobs:", err)
    }
    setLoading(false)
  }

  async function handleGenerate() {
    if (!productImageUrl.trim()) {
      toast.error("Please enter a product image URL")
      return
    }

    setGenerating(true)
    try {
      const res = await fetch("/api/n8n/generate-ugc-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_image_url: productImageUrl }),
      })

      if (!res.ok) {
        const err = await res.json()
        if (res.status === 403 && err.upgradeUrl) {
          toast.error(err.error, {
            action: { label: "Upgrade", onClick: () => window.location.href = err.upgradeUrl },
            duration: 8000,
          })
          return
        }
        throw new Error(err.error || "Failed to start generation")
      }

      const { job_id } = await res.json()
      setPollingJobId(job_id)
      setProductImageUrl("")
      toast.success("UGC video generation started! This takes 3-5 minutes.")
      fetchJobs()
      fetchUsage()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  async function handleDelete(jobId: string) {
    if (!confirm("Are you sure you want to delete this video job?")) return
    try {
      const res = await fetch("/api/ugc-videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId }),
      })
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId))
        toast.success("Video job deleted")
      } else {
        toast.error("Failed to delete video job")
      }
    } catch {
      toast.error("Failed to delete video job")
    }
    setOpenMenuId(null)
  }

  async function handleRetry(job: UGCVideoJob) {
    setOpenMenuId(null)
    setProductImageUrl(job.product_image_url)
    toast.info("Product image URL loaded. Click 'Generate Video' to retry.")
  }

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
    setOpenMenuId(null)
  }

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    pending: { icon: Clock, color: "text-yellow-600 bg-yellow-100", label: "Queued" },
    processing: { icon: Loader2, color: "text-blue-600 bg-blue-100", label: "Processing" },
    completed: { icon: CheckCircle2, color: "text-green-600 bg-green-100", label: "Completed" },
    failed: { icon: XCircle, color: "text-red-600 bg-red-100", label: "Failed" },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">AI UGC Video Generator</h1>
        <p className="text-muted-foreground">
          Generate authentic UGC-style video ads with AI. Powered by GPT-4o, ElevenLabs & WaveSpeed lip-sync.
        </p>
      </div>

      {/* Generator Card */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="font-semibold text-lg">Generate UGC Video Ad</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a product image and our AI will create a realistic UGC video with a person
                reviewing your product, complete with natural speech and lip-sync animation.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="url"
                  value={productImageUrl}
                  onChange={(e) => setProductImageUrl(e.target.value)}
                  placeholder="Paste product image URL (e.g., https://example.com/product.jpg)"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={generating}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating || !productImageUrl.trim()}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    Generate Video
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Takes 3-5 minutes
                </span>
                <span className="flex items-center gap-1">
                  <Image className="h-3 w-3" /> 9:16 portrait format
                </span>
                <span className="flex items-center gap-1">
                  <Video className="h-3 w-3" /> AI lip-synced speech
                </span>
              </div>
              {usage && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  usage.limit === -1 ? "bg-green-100 text-green-700" :
                  usage.used >= usage.limit ? "bg-red-100 text-red-700" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {usage.limit === -1 ? "Unlimited" : `${usage.used}/${usage.limit} this month`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Generation */}
      {pollingJobId && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Video generation in progress</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your AI UGC video is being created. This typically takes 3-5 minutes.
                The page will update automatically when it&apos;s ready.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Past Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Generated Videos</h2>
          <button
            onClick={fetchJobs}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border rounded-lg p-4 animate-pulse">
                <div className="aspect-[9/16] bg-muted rounded-md mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const status = statusConfig[job.status] || statusConfig.pending
              const StatusIcon = status.icon

              return (
                <div key={job.id} className="bg-card border rounded-lg overflow-hidden">
                  {/* Preview */}
                  <div className="aspect-video bg-muted relative">
                    {job.video_url ? (
                      <video
                        src={job.video_url}
                        className="w-full h-full object-cover"
                        controls
                        poster={job.generated_image_url || job.product_image_url}
                      />
                    ) : job.generated_image_url ? (
                      <img
                        src={job.generated_image_url}
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {job.status === "processing" ? (
                          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                        ) : job.status === "failed" ? (
                          <XCircle className="h-8 w-8 text-destructive" />
                        ) : (
                          <Clock className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className={`h-3 w-3 ${job.status === "processing" ? "animate-spin" : ""}`} />
                        {status.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(job.created_at)}
                        </span>
                        {/* Actions Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                            className="p-1 rounded hover:bg-muted"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                          {openMenuId === job.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                              <div className="absolute right-0 top-8 z-20 w-48 bg-popover border rounded-md shadow-lg py-1">
                                {job.video_url && (
                                  <>
                                    <a
                                      href={job.video_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full"
                                      onClick={() => setOpenMenuId(null)}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      Open video
                                    </a>
                                    <button
                                      onClick={() => handleCopyUrl(job.video_url!)}
                                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
                                    >
                                      <Copy className="h-4 w-4" />
                                      Copy video URL
                                    </button>
                                  </>
                                )}
                                {(job.status === "failed" || job.status === "pending") && (
                                  <button
                                    onClick={() => handleRetry(job)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                    Retry generation
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(job.id)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {job.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{job.caption}</p>
                    )}

                    {job.error_message && (
                      <p className="text-sm text-destructive">{job.error_message}</p>
                    )}

                    {job.video_url && (
                      <div className="flex gap-2">
                        <a
                          href={job.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm hover:bg-muted flex-1 justify-center"
                        >
                          <Play className="h-3.5 w-3.5" />
                          View
                        </a>
                        <a
                          href={job.video_url}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 flex-1 justify-center"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg">No videos generated yet</h3>
            <p className="text-muted-foreground mt-1">
              Upload a product image above to generate your first AI UGC video ad
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

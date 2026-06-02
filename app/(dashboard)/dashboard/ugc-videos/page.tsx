"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import {
  Video, Loader2, CheckCircle2, XCircle,
  Clock, Play, Download, RefreshCw, Sparkles, Image,
  MoreVertical, Trash2, RotateCcw, Copy, ExternalLink, Bot, Zap,
  Upload, Link, X
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { type SubscriptionTier } from "@/lib/constants"
import { AIInfluencersTab } from "@/components/ugc/ai-influencers-tab"
import { InfluencerSelector } from "@/components/ugc/influencer-selector"
import { ProductStudioTab } from "@/components/ugc/product-studio-tab"

type ActiveTab = "generate" | "influencers" | "studio" | "past"

interface UGCVideoUsage {
  used: number
  limit: number
  tier: string
  tierKey: SubscriptionTier
  aiInfluencers: number
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
  const [activeTab, setActiveTab] = useState<ActiveTab>("generate")
  const [jobs, setJobs] = useState<UGCVideoJob[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [productImageUrl, setProductImageUrl] = useState("")
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null)
  const [pollingJobId, setPollingJobId] = useState<string | null>(null)
  const [usage, setUsage] = useState<UGCVideoUsage | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [selectorKey, setSelectorKey] = useState(0)
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null)
  const [editingCaptionValue, setEditingCaptionValue] = useState("")
  const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

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
    }, 15000)
    return () => clearInterval(interval)
  }, [pollingJobId])

  async function fetchJobs() {
    try {
      const res = await fetch("/api/ugc-videos")
      const data = await res.json()
      if (res.ok) {
        setJobs(data.jobs || [])
        if (data.usage) setUsage(data.usage)
      } else {
        toast.error(data.error || "Failed to load videos")
      }
    } catch (err: any) {
      toast.error("Failed to load videos: " + err.message)
    }
    setLoading(false)
  }

  async function handleFileSelect(file: File) {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) { toast.error("Only JPG, PNG, and WebP images are supported"); return }
    if (file.size > 10 * 1024 * 1024) { toast.error("File must be under 10 MB"); return }
    setUploadedFile(file)
    setUploadPreview(URL.createObjectURL(file))
    setProductImageUrl("")
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/product-transform/upload-image", { method: "POST", body: formData })
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed")
      const { image_url } = await res.json()
      setProductImageUrl(image_url)
    } catch (err: any) {
      toast.error(err.message)
      setUploadedFile(null)
      setUploadPreview(null)
    } finally {
      setUploading(false)
    }
  }

  function clearUpload() {
    setUploadedFile(null)
    setUploadPreview(null)
    setProductImageUrl("")
    if (fileInputRef.current) fileInputRef.current.value = ""
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
        body: JSON.stringify({
          product_image_url: productImageUrl,
          ai_influencer_id: selectedInfluencerId || undefined,
        }),
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
      setUploadedFile(null)
      setUploadPreview(null)
      toast.success("UGC video generation started! This takes 3-5 minutes.")
      fetchJobs()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

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
    setActiveTab("generate")
    toast.info("Product image URL loaded. Click 'Generate Video' to retry.")
  }

  async function handleSaveCaption(jobId: string) {
    try {
      const res = await fetch("/api/ugc-videos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, caption: editingCaptionValue }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, caption: editingCaptionValue } : j))
      toast.success("Caption saved")
    } catch {
      toast.error("Failed to save caption")
    } finally {
      setEditingCaptionId(null)
    }
  }

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
    setOpenMenuId(null)
  }

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    pending:    { icon: Clock,         color: "text-yellow-600 bg-yellow-100", label: "Queued" },
    processing: { icon: Loader2,       color: "text-blue-600 bg-blue-100",     label: "Processing" },
    completed:  { icon: CheckCircle2,  color: "text-green-600 bg-green-100",   label: "Completed" },
    failed:     { icon: XCircle,       color: "text-red-600 bg-red-100",       label: "Failed" },
  }

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "generate",    label: "Generate Video"  },
    { id: "influencers", label: "AI Influencers"  },
    { id: "studio",      label: "Product Studio"  },
    { id: "past",        label: "Past Videos"     },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">AI UGC Video Generator</h1>
        <p className="text-muted-foreground">
          AI-powered video generation · Premium HD quality on Scale plan
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.id === "generate"    && <Video className="h-3.5 w-3.5 inline mr-1.5 mb-0.5" />}
              {tab.id === "influencers" && <Bot   className="h-3.5 w-3.5 inline mr-1.5 mb-0.5" />}
              {tab.id === "studio"      && <Zap   className="h-3.5 w-3.5 inline mr-1.5 mb-0.5" />}
              {tab.id === "past"        && <Clock className="h-3.5 w-3.5 inline mr-1.5 mb-0.5" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Video Tab */}
      {activeTab === "generate" && (
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="font-semibold text-lg">Generate UGC Video Ad</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select an AI influencer and paste a product image URL to generate a realistic UGC video.
                  </p>
                </div>

                {/* Influencer selector */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">AI Influencer</label>
                  <InfluencerSelector
                    key={selectorKey}
                    value={selectedInfluencerId}
                    onChange={(id) => setSelectedInfluencerId(id)}
                    disabled={generating}
                  />
                </div>

                {/* Input mode toggle */}
                <div>
                  <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-3">
                    <button
                      onClick={() => { setImageInputMode("url"); clearUpload() }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${imageInputMode === "url" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Link className="h-3.5 w-3.5" /> Paste URL
                    </button>
                    <button
                      onClick={() => { setImageInputMode("upload"); setProductImageUrl("") }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${imageInputMode === "upload" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload Image
                    </button>
                  </div>

                  {imageInputMode === "url" ? (
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={productImageUrl}
                        onChange={(e) => setProductImageUrl(e.target.value)}
                        placeholder="Paste product image URL (e.g., https://example.com/product.jpg)"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        disabled={generating}
                      />
                      <button
                        onClick={handleGenerate}
                        disabled={generating || !productImageUrl.trim()}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
                      >
                        {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Starting...</> : <><Video className="h-4 w-4" /> Generate Video</>}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!uploadedFile ? (
                        <div
                          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f) }}
                          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                          onDragLeave={() => setIsDragOver(false)}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"}`}
                        >
                          <Upload className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground" />
                          <p className="text-sm font-medium">Drop product image here</p>
                          <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP · Max 10 MB</p>
                          <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />
                        </div>
                      ) : (
                        <div className="border rounded-lg bg-muted/30 flex items-center gap-3 p-3">
                          {uploadPreview && <img src={uploadPreview} alt="Product" className="h-14 w-14 object-cover rounded-md shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {uploading ? <><Loader2 className="h-3 w-3 animate-spin text-primary" /><span className="text-xs text-primary">Uploading…</span></>
                              : productImageUrl ? <><CheckCircle2 className="h-3 w-3 text-green-600" /><span className="text-xs text-green-600">Ready</span></> : null}
                            </div>
                          </div>
                          <button onClick={clearUpload} className="p-1.5 hover:bg-background rounded-md shrink-0">
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={handleGenerate}
                        disabled={generating || uploading || !productImageUrl}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Starting...</> : <><Video className="h-4 w-4" /> Generate Video</>}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Takes 3-5 minutes</span>
                    <span className="flex items-center gap-1"><Image className="h-3 w-3" /> 9:16 portrait format</span>
                    <span className="flex items-center gap-1"><Video className="h-3 w-3" /> AI lip-synced speech</span>
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
        </div>
      )}

      {/* AI Influencers Tab */}
      {activeTab === "influencers" && usage && (
        <AIInfluencersTab
          isScaleTier={usage.tierKey === "scale"}
          influencerLimit={usage.aiInfluencers}
          onInfluencerCreated={() => setSelectorKey((k) => k + 1)}
        />
      )}
      {activeTab === "influencers" && !usage && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Product Studio Tab */}
      {activeTab === "studio" && <ProductStudioTab />}

      {/* Past Videos Tab */}
      {activeTab === "past" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Generated Videos</h2>
            <div className="flex gap-2">
              {jobs.some(j => j.status === "processing" || j.status === "failed") && (
                <button
                  onClick={async () => {
                    if (!confirm("Delete all stuck/failed jobs?")) return
                    await Promise.all(
                      jobs
                        .filter(j => j.status === "processing" || j.status === "failed")
                        .map(j => fetch("/api/ugc-videos", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ job_id: j.id }),
                        }))
                    )
                    setJobs(prev => prev.filter(j => j.status === "completed"))
                    toast.success("Cleared stuck jobs")
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-destructive text-destructive text-sm hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear stuck
                </button>
              )}
              <button
                onClick={fetchJobs}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-muted"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
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
                  <div key={job.id} className="bg-card border rounded-lg">
                    <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                      {job.video_url ? (
                        <video
                          src={job.video_url}
                          className="w-full h-full object-cover"
                          controls
                          poster={job.generated_image_url || job.product_image_url}
                        />
                      ) : job.generated_image_url ? (
                        <img src={job.generated_image_url} alt="Generated" className="w-full h-full object-cover" />
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
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className={`h-3 w-3 ${job.status === "processing" ? "animate-spin" : ""}`} />
                          {status.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{formatDate(job.created_at)}</span>
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                              className="p-1 rounded hover:bg-muted"
                            >
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                            {openMenuId === job.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                <div className="absolute right-0 top-8 z-50 w-48 bg-popover border rounded-md shadow-lg py-1">
                                  {job.status === "completed" && (
                                    <button
                                      onClick={() => { setEditingCaptionId(job.id); setEditingCaptionValue(job.caption ?? ""); setOpenMenuId(null) }}
                                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
                                    >
                                      <Copy className="h-4 w-4" />
                                      Edit caption
                                    </button>
                                  )}
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
                                  {(job.status === "failed" || job.status === "pending" || job.status === "processing") && (
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
                      {/* Editable caption */}
                      {job.status === "completed" && (
                        editingCaptionId === job.id ? (
                          <div className="space-y-1.5">
                            <textarea
                              value={editingCaptionValue}
                              onChange={(e) => setEditingCaptionValue(e.target.value)}
                              rows={3}
                              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveCaption(job.id)}
                                className="inline-flex items-center px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCaptionId(null)}
                                className="inline-flex items-center px-3 py-1 rounded-md border text-xs hover:bg-muted"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setEditingCaptionId(job.id); setEditingCaptionValue(job.caption ?? "") }}
                            className="w-full text-left text-sm text-muted-foreground hover:text-foreground group"
                          >
                            {job.caption
                              ? <span className="line-clamp-2 group-hover:line-clamp-none">{job.caption}</span>
                              : <span className="italic opacity-50">Add caption…</span>
                            }
                          </button>
                        )
                      )}
                      {job.status !== "completed" && job.caption && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.caption}</p>
                      )}
                      {job.error_message && <p className="text-sm text-destructive">{job.error_message}</p>}
                      {job.video_url && (
                        <div className="flex gap-2">
                          <a
                            href={job.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm hover:bg-muted flex-1 justify-center"
                          >
                            <Play className="h-3.5 w-3.5" /> View
                          </a>
                          <a
                            href={job.video_url}
                            download
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 flex-1 justify-center"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
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
                Go to the Generate Video tab to create your first AI UGC video ad
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

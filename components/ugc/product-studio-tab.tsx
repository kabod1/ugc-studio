"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import {
  Zap, ImageIcon, Upload, X, Loader2, CheckCircle2, XCircle,
  Clock, Download, Trash2, RefreshCw, Sparkles, Play, Video,
  TrendingUp, Star, Minus, Bold,
} from "lucide-react"

type JobType = "ad_video" | "infographic"
type AdStyle = "viral" | "luxury" | "minimal" | "bold"

interface ProductTransformJob {
  id: string
  job_type: JobType
  status: string
  source_image_url: string
  output_url: string | null
  style: string | null
  cta_text: string | null
  error_message: string | null
  created_at: string
  completed_at: string | null
}

const STYLES: { id: AdStyle; icon: React.ElementType; label: string; description: string }[] = [
  { id: "viral",   icon: TrendingUp, label: "Viral",   description: "Bold, trending, high-energy" },
  { id: "luxury",  icon: Star,       label: "Luxury",  description: "Premium, elegant, refined"   },
  { id: "minimal", icon: Minus,      label: "Minimal", description: "Clean, modern, airy"          },
  { id: "bold",    icon: Bold,       label: "Bold",    description: "High-contrast, punchy"        },
]

const STATUS_CONFIG = {
  pending:    { icon: Clock,        color: "text-yellow-600 bg-yellow-100", label: "Queued"     },
  processing: { icon: Loader2,      color: "text-blue-600 bg-blue-100",     label: "Processing" },
  completed:  { icon: CheckCircle2, color: "text-green-600 bg-green-100",   label: "Done"       },
  failed:     { icon: XCircle,      color: "text-red-600 bg-red-100",       label: "Failed"     },
} as const

export function ProductStudioTab() {
  const [jobType, setJobType] = useState<JobType>("ad_video")
  const [style, setStyle] = useState<AdStyle>("viral")
  const [ctaText, setCtaText] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [jobs, setJobs] = useState<ProductTransformJob[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [pollingJobId, setPollingJobId] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchJobs() }, [])

  useEffect(() => {
    if (!pollingJobId) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/product-transform/status?job_id=${pollingJobId}`)
        const job = await res.json()
        if (job.status === "completed" || job.status === "failed") {
          setPollingJobId(null)
          fetchJobs()
          if (job.status === "completed") {
            toast.success("Your ad video is ready!")
          } else {
            toast.error("Generation failed: " + (job.error_message || "Unknown error"))
          }
        }
      } catch {}
    }, 15000)
    return () => clearInterval(interval)
  }, [pollingJobId])

  async function fetchJobs() {
    try {
      const res = await fetch("/api/product-transform")
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs || [])
      }
    } catch {}
    setLoadingJobs(false)
  }

  async function handleFileSelect(file: File) {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are supported")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB")
      return
    }

    setUploadedFile(file)
    setUploadPreview(URL.createObjectURL(file))
    setUploadedUrl(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/product-transform/upload-image", { method: "POST", body: formData })
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed")
      const { image_url } = await res.json()
      setUploadedUrl(image_url)
    } catch (err: any) {
      toast.error(err.message)
      clearUpload()
    } finally {
      setUploading(false)
    }
  }

  function clearUpload() {
    setUploadedFile(null)
    setUploadPreview(null)
    setUploadedUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  async function handleGenerate() {
    if (!uploadedUrl) {
      toast.error("Please upload a product image first")
      return
    }
    setGenerating(true)
    try {
      const res = await fetch("/api/product-transform/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_type: jobType,
          source_image_url: uploadedUrl,
          style,
          cta_text: ctaText.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Generation failed")
      }
      const data = await res.json()
      clearUpload()
      setCtaText("")
      fetchJobs()

      if (jobType === "infographic") {
        toast.success("Infographic generated!")
      } else {
        setPollingJobId(data.job_id)
        toast.success("Ad video started — ready in 3-5 minutes.")
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleDelete(jobId: string) {
    if (!confirm("Delete this item?")) return
    try {
      const res = await fetch("/api/product-transform", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId }),
      })
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId))
        toast.success("Deleted")
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Generator card */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 shrink-0">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-5">
            <div>
              <h2 className="font-semibold text-lg">Product Studio</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Upload any product image and transform it into viral-ready ads or infographics instantly.
              </p>
            </div>

            {/* Output type selector */}
            <div>
              <label className="text-sm font-medium block mb-2">Output Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setJobType("ad_video")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    jobType === "ad_video"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:bg-muted"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <div className="text-left">
                    <div>Viral Ad Video</div>
                    <div className="text-xs font-normal text-muted-foreground">Short-form video · 3-5 min</div>
                  </div>
                </button>
                <button
                  onClick={() => setJobType("infographic")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    jobType === "infographic"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:bg-muted"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  <div className="text-left">
                    <div>Infographic</div>
                    <div className="text-xs font-normal text-muted-foreground">AI-generated · ~30 sec</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Upload zone */}
            <div>
              <label className="text-sm font-medium block mb-2">Product Image</label>
              {!uploadedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                  onDragLeave={() => setIsDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium text-sm">Drop your product image here</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP · Max 10 MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
                  />
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden bg-muted/30">
                  <div className="flex items-center gap-3 p-3">
                    {uploadPreview && (
                      <img src={uploadPreview} alt="Product preview" className="h-16 w-16 object-cover rounded-md shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {uploading ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                            <span className="text-xs text-primary">Uploading…</span>
                          </>
                        ) : uploadedUrl ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">Ready to transform</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <button onClick={clearUpload} className="p-1.5 hover:bg-background rounded-md shrink-0">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Style picker */}
            <div>
              <label className="text-sm font-medium block mb-2">Content Style</label>
              <div className="grid grid-cols-4 gap-2">
                {STYLES.map((s) => {
                  const StyleIcon = s.icon
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        style === s.id
                          ? "border-primary bg-primary/10"
                          : "border-input hover:bg-muted"
                      }`}
                    >
                      <StyleIcon className={`h-4 w-4 mb-1.5 ${style === s.id ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs font-semibold block">{s.label}</span>
                      <span className="text-xs text-muted-foreground leading-tight">{s.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CTA text */}
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Call to Action{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder={
                  jobType === "infographic"
                    ? "e.g. Shop Now · 50% Off This Week"
                    : "e.g. Get yours at mystore.com"
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={generating}
              />
            </div>

            {/* Generate button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={generating || uploading || !uploadedUrl}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
              >
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Transform Product</>
                )}
              </button>
              <span className="text-xs text-muted-foreground">
                {jobType === "infographic" ? "Infographic ready in ~30 seconds" : "Video ready in 3-5 minutes"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Polling banner */}
      {pollingJobId && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Ad video generating</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Typically takes 3-5 minutes. Page updates automatically when ready.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Past Transformations</h3>
          <button
            onClick={fetchJobs}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border rounded-lg p-4 animate-pulse">
                <div className="aspect-video bg-muted rounded-md mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const sc = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
              const StatusIcon = sc.icon
              const isVideo = job.job_type === "ad_video"

              return (
                <div key={job.id} className="bg-card border rounded-lg overflow-hidden">
                  <div className={`${isVideo ? "aspect-video" : "aspect-square"} bg-muted relative`}>
                    {job.output_url ? (
                      isVideo ? (
                        <video
                          src={job.output_url}
                          className="w-full h-full object-cover"
                          controls
                          poster={job.source_image_url}
                        />
                      ) : (
                        <img src={job.output_url} alt="Infographic" className="w-full h-full object-cover" />
                      )
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
                    <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/60 text-white font-medium">
                      {isVideo ? "Ad Video" : "Infographic"}
                    </span>
                    {job.style && (
                      <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-black/60 text-white font-medium capitalize">
                        {job.style}
                      </span>
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}>
                        <StatusIcon className={`h-3 w-3 ${job.status === "processing" ? "animate-spin" : ""}`} />
                        {sc.label}
                      </span>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-1 rounded hover:bg-muted"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors" />
                      </button>
                    </div>

                    {job.cta_text && (
                      <p className="text-xs text-muted-foreground truncate">CTA: {job.cta_text}</p>
                    )}

                    {job.error_message && (
                      <p className="text-xs text-destructive">{job.error_message}</p>
                    )}

                    {job.output_url && (
                      <div className="flex gap-2">
                        <a
                          href={job.output_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs hover:bg-muted flex-1 justify-center"
                        >
                          <Play className="h-3 w-3" /> View
                        </a>
                        <a
                          href={job.output_url}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90 flex-1 justify-center"
                        >
                          <Download className="h-3 w-3" /> Download
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
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold">No transformations yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Upload a product image above to create your first viral ad or infographic
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

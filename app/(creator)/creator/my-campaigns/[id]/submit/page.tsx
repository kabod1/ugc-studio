"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Upload, Check } from "lucide-react"

export default function SubmitContentPage() {
  const params = useParams()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [fileType, setFileType] = useState("video")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: params.id,
          title,
          description,
          file_url: fileUrl,
          file_type: fileType,
          thumbnail_url: thumbnailUrl || undefined,
        }),
      })
      if (res.ok) setSubmitted(true)
    } catch {}
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Content Submitted!</h2>
        <p className="text-muted-foreground mb-6">Your content has been submitted for review.</p>
        <Link href={`/creator/my-campaigns/${params.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          Back to Campaign
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/creator/my-campaigns/${params.id}`} className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Submit Content</h1>
          <p className="text-muted-foreground">Upload your content for review</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="My awesome content"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief description of your content..."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">File URL *</label>
          <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} required placeholder="https://..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          <p className="text-xs text-muted-foreground">Direct link to your uploaded content file</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Type</label>
          <select value={fileType} onChange={(e) => setFileType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Thumbnail URL (optional)</label>
          <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Submit Content
        </button>
      </form>
    </div>
  )
}

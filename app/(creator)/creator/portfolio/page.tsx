"use client"

import { useState } from "react"
import { Plus, Video, ImageIcon, Link2, Trash2, ExternalLink } from "lucide-react"

interface PortfolioItem {
  id: string
  type: "video" | "image" | "link"
  title: string
  url: string
  brand?: string
  thumbnail?: string
}

// Placeholder items to make the page feel populated
const SAMPLE_ITEMS: PortfolioItem[] = []

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(SAMPLE_ITEMS)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ type: "video" as "video" | "image" | "link", title: "", url: "", brand: "" })
  const [saving, setSaving] = useState(false)

  function addItem() {
    if (!form.title || !form.url) return
    setSaving(true)
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form },
      ])
      setForm({ type: "video", title: "", url: "", brand: "" })
      setShowAdd(false)
      setSaving(false)
    }, 400)
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const typeIcon = (type: PortfolioItem["type"]) => {
    if (type === "video") return <Video className="h-5 w-5" />
    if (type === "image") return <ImageIcon className="h-5 w-5" />
    return <Link2 className="h-5 w-5" />
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Portfolio</h1>
          <p className="text-muted-foreground mt-1">Showcase your best UGC work to attract brand deals.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Work
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && !showAdd && (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Video className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">No portfolio items yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add links to your best UGC videos, images, or campaigns to impress brands.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add your first item
          </button>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold">Add portfolio item</h3>

          {/* Type selector */}
          <div className="grid grid-cols-3 gap-2">
            {(["video", "image", "link"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                  form.type === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                }`}
              >
                {typeIcon(t)}
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Skincare unboxing for Glow Brand"
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://..."
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Brand (optional)</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                placeholder="e.g. Sephora"
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addItem}
              disabled={!form.title || !form.url || saving}
              className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              {saving ? "Saving..." : "Add to Portfolio"}
            </button>
          </div>
        </div>
      )}

      {/* Portfolio grid */}
      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border rounded-xl overflow-hidden group">
              {/* Thumbnail placeholder */}
              <div className="h-36 bg-muted flex items-center justify-center text-muted-foreground">
                {typeIcon(item.type)}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    {item.brand && (
                      <p className="text-xs text-muted-foreground mt-0.5">For {item.brand}</p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Tip:</strong> Creators with 3+ portfolio items get 2x more campaign invites from brands. Add your best TikTok, Reels, or YouTube Shorts links.
      </div>
    </div>
  )
}

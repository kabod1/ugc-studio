"use client"

import { useState, useEffect } from "react"
import { Plus, Video, ImageIcon, Link2, Trash2, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface PortfolioItem {
  id: string
  type: "video" | "image" | "link"
  title: string
  url: string
  brand?: string
  description?: string
  created_at: string
}

const TYPE_ICONS = {
  video: Video,
  image: ImageIcon,
  link: Link2,
}

const TYPE_COLORS = {
  video: "bg-purple-50 text-purple-600",
  image: "bg-blue-50 text-blue-600",
  link: "bg-green-50 text-green-600",
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dbError, setDbError] = useState(false)
  const [form, setForm] = useState({
    type: "video" as "video" | "image" | "link",
    title: "",
    url: "",
    brand: "",
    description: "",
  })

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      const res = await fetch("/api/portfolio")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      setDbError(true)
    } finally {
      setLoading(false)
    }
  }

  async function addItem() {
    if (!form.title.trim() || !form.url.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error?.includes("migration")) {
          setDbError(true)
        }
        toast.error(data.error || "Failed to save item")
        return
      }
      setItems((prev) => [data.item, ...prev])
      setForm({ type: "video", title: "", url: "", brand: "", description: "" })
      setShowAdd(false)
      toast.success("Portfolio item added!")
    } catch {
      toast.error("Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  async function removeItem(id: string) {
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success("Item removed")
    } catch {
      toast.error("Failed to remove item")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Showcase your best UGC work. Creators with 5+ items get 3× more brand invites.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Work
        </button>
      </div>

      {/* DB setup banner */}
      {dbError && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Database setup required</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Run the SQL migration in your Supabase dashboard to enable portfolio persistence.
              File: <code className="bg-amber-100 px-1 rounded">scripts/migrate-portfolio-training-affiliates.sql</code>
            </p>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Portfolio strength</span>
          <span className="text-sm text-muted-foreground">{items.length} / 5 items</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min((items.length / 5) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {items.length === 0 && "Add your first portfolio item to start attracting brands."}
          {items.length >= 1 && items.length < 3 && "Good start! Add 2 more items to unlock more brand visibility."}
          {items.length >= 3 && items.length < 5 && "Almost there! 2 more items for maximum brand exposure."}
          {items.length >= 5 && "Excellent portfolio! You're fully optimised for brand discovery."}
        </p>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold">Add portfolio item</h3>

          <div className="grid grid-cols-3 gap-2">
            {(["video", "image", "link"] as const).map((t) => {
              const Icon = TYPE_ICONS[t]
              return (
                <button
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                    form.type === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {t}
                </button>
              )
            })}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Skincare unboxing — 30s vertical video"
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                URL <span className="text-destructive">*</span>
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://drive.google.com/... or https://tiktok.com/..."
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
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
              <div>
                <label className="text-sm font-medium">Notes (optional)</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. 4.9% CTR, 200K views"
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setShowAdd(false); setForm({ type: "video", title: "", url: "", brand: "", description: "" }) }}
              className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addItem}
              disabled={!form.title.trim() || !form.url.trim() || saving}
              className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Add to Portfolio"}
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !showAdd && (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Video className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">No portfolio items yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Add links to your best UGC videos, product photos, or brand campaign results. Brands check portfolios before hiring.
            </p>
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

      {/* Portfolio grid */}
      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const Icon = TYPE_ICONS[item.type]
            return (
              <div key={item.id} className="bg-card border rounded-xl overflow-hidden group hover:border-primary/30 transition-colors">
                <div className={`h-32 flex items-center justify-center ${TYPE_COLORS[item.type]} bg-opacity-20`}>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${TYPE_COLORS[item.type]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                      {item.brand && (
                        <p className="text-xs text-muted-foreground mt-0.5">For {item.brand}</p>
                      )}
                      {item.description && (
                        <p className="text-xs text-primary mt-1 font-medium">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type]}`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/40 rounded-xl p-5 space-y-2">
        <p className="text-sm font-semibold">Portfolio tips</p>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>Lead with your best work — brands often only view the first 1–2 items</li>
          <li>Include spec work if you don't have brand campaigns yet — quality is what counts</li>
          <li>Add result metrics in the Notes field (views, CTR, engagement rate)</li>
          <li>Keep links accessible — use Google Drive or YouTube, not local files</li>
        </ul>
      </div>
    </div>
  )
}

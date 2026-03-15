"use client"

import { useState, useEffect } from "react"
import { Loader2, Save, Palette, Link as LinkIcon, Plus, X } from "lucide-react"

interface BrandData {
  id: string
  company_name: string
  website: string | null
  industry: string | null
  description: string | null
  brand_guidelines_url: string | null
  brand_colors: string[]
  brand_fonts: string[]
  tone_of_voice: string | null
}

export default function BrandSettingsPage() {
  const [brand, setBrand] = useState<BrandData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newColor, setNewColor] = useState("#7c3aed")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/brand/settings")
        if (res.ok) {
          const data = await res.json()
          setBrand(data.brand)
        }
      } catch (err) {
        console.error("Failed to load brand settings:", err)
      }
      setLoading(false)
    }
    load()
  }, [])

  function updateField(field: string, value: unknown) {
    setBrand((b) => b ? { ...b, [field]: value } : b)
  }

  function addColor() {
    if (!brand) return
    const colors = brand.brand_colors || []
    if (colors.length >= 8) return
    if (!colors.includes(newColor)) {
      updateField("brand_colors", [...colors, newColor])
    }
  }

  function removeColor(color: string) {
    if (!brand) return
    updateField("brand_colors", (brand.brand_colors || []).filter((c) => c !== color))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!brand) return
    setSaving(true)
    try {
      const res = await fetch("/api/brand/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: brand.company_name,
          website: brand.website,
          industry: brand.industry,
          description: brand.description,
          brand_guidelines_url: brand.brand_guidelines_url,
          brand_colors: brand.brand_colors,
          brand_fonts: brand.brand_fonts,
          tone_of_voice: brand.tone_of_voice,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {}
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!brand) return <div className="p-6 text-muted-foreground">Unable to load brand settings.</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brand Settings</h1>
        <p className="text-muted-foreground">Manage your company profile and brand kit</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Info */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">Company Information</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <input type="text" value={brand.company_name || ""} onChange={(e) => updateField("company_name", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <input type="url" value={brand.website || ""} onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://example.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <input type="text" value={brand.industry || ""} onChange={(e) => updateField("industry", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea value={brand.description || ""} onChange={(e) => updateField("description", e.target.value)} rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        {/* Brand Kit */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Brand Kit</h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <LinkIcon className="h-3.5 w-3.5" /> Brand Guidelines URL
            </label>
            <input type="url" value={brand.brand_guidelines_url || ""} onChange={(e) => updateField("brand_guidelines_url", e.target.value)}
              placeholder="https://drive.google.com/... or link to your brand guide"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <p className="text-xs text-muted-foreground">Link to your brand guidelines document (Google Drive, Notion, PDF, etc.)</p>
          </div>

          {/* Brand Colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Colors</label>
            <div className="flex flex-wrap gap-2">
              {(brand.brand_colors || []).map((color) => (
                <div key={color} className="flex items-center gap-1 px-2 py-1 rounded-md border bg-background group">
                  <div className="h-5 w-5 rounded border" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono">{color}</span>
                  <button type="button" onClick={() => removeColor(color)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
              {(brand.brand_colors || []).length < 8 && (
                <div className="flex items-center gap-1">
                  <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border-0" />
                  <button type="button" onClick={addColor}
                    className="flex items-center gap-1 px-2 py-1 rounded-md border text-xs hover:bg-muted">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tone of Voice */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tone of Voice</label>
            <textarea value={brand.tone_of_voice || ""} onChange={(e) => updateField("tone_of_voice", e.target.value)}
              rows={2} placeholder="e.g., Professional but approachable, casual and fun, authoritative..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <p className="text-xs text-muted-foreground">Describe how your brand communicates. Creators will see this when working on content.</p>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  )
}

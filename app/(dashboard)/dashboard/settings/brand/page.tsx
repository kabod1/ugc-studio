"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Save, Palette, Link as LinkIcon, Plus, X, Upload, Image as ImageIcon, Type } from "lucide-react"
import { toast } from "sonner"
import { GdprRights } from "@/components/shared/gdpr-rights"

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
  logo_url: string | null
}

const FONT_SUGGESTIONS = ["Inter", "Roboto", "Poppins", "Montserrat", "Playfair Display", "Raleway", "Nunito", "DM Sans"]

export default function BrandSettingsPage() {
  const [brand, setBrand] = useState<BrandData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newColor, setNewColor] = useState("#7c3aed")
  const [newFont, setNewFont] = useState("")
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/brand/settings")
      .then(r => r.json())
      .then(d => { if (d.brand) setBrand(d.brand) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function updateField(field: string, value: unknown) {
    setBrand(b => b ? { ...b, [field]: value } : b)
  }

  function addColor() {
    if (!brand) return
    const colors = brand.brand_colors || []
    if (colors.length >= 8 || colors.includes(newColor)) return
    updateField("brand_colors", [...colors, newColor])
  }

  function removeColor(color: string) {
    if (!brand) return
    updateField("brand_colors", (brand.brand_colors || []).filter(c => c !== color))
  }

  function addFont(font: string) {
    if (!brand || !font.trim()) return
    const fonts = brand.brand_fonts || []
    if (fonts.includes(font.trim()) || fonts.length >= 6) return
    updateField("brand_fonts", [...fonts, font.trim()])
    setNewFont("")
  }

  function removeFont(font: string) {
    if (!brand) return
    updateField("brand_fonts", (brand.brand_fonts || []).filter(f => f !== font))
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/brand/logo", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      updateField("logo_url", data.url)
      toast.success("Logo uploaded")
    } catch (err: any) {
      toast.error(err.message || "Logo upload failed")
    } finally {
      setUploadingLogo(false)
      if (logoRef.current) logoRef.current.value = ""
    }
  }

  async function handleRemoveLogo() {
    await fetch("/api/brand/logo", { method: "DELETE" })
    updateField("logo_url", null)
    toast.success("Logo removed")
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
        toast.success("Brand settings saved")
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to save")
      }
    } catch {
      toast.error("Failed to save")
    }
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
            <input type="text" value={brand.company_name || ""} onChange={e => updateField("company_name", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <input type="url" value={brand.website || ""} onChange={e => updateField("website", e.target.value)}
                placeholder="https://example.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <input type="text" value={brand.industry || ""} onChange={e => updateField("industry", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea value={brand.description || ""} onChange={e => updateField("description", e.target.value)} rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        {/* Brand Kit */}
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Brand Kit</h2>
          </div>

          {/* Logo */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" /> Logo
            </label>
            {brand.logo_url ? (
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                  <img src={brand.logo_url} alt="Brand logo" className="max-h-full max-w-full object-contain p-2" />
                </div>
                <div className="space-y-2">
                  <button type="button" onClick={() => logoRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-muted">
                    {uploadingLogo ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    Replace
                  </button>
                  <button type="button" onClick={handleRemoveLogo}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive border border-destructive/30 rounded-md hover:bg-destructive/5">
                    <X className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => logoRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {uploadingLogo
                  ? <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
                  : <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />}
                <p className="text-sm font-medium">{uploadingLogo ? "Uploading..." : "Upload your logo"}</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG, WebP · Max 2MB</p>
              </div>
            )}
            <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
          </div>

          {/* Brand Colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Colors</label>
            <div className="flex flex-wrap gap-2">
              {(brand.brand_colors || []).map(color => (
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
                  <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border-0" />
                  <button type="button" onClick={addColor}
                    className="flex items-center gap-1 px-2 py-1 rounded-md border text-xs hover:bg-muted">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Brand Fonts */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5" /> Brand Fonts
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(brand.brand_fonts || []).map(font => (
                <span key={font} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-background text-sm">
                  {font}
                  <button type="button" onClick={() => removeFont(font)}>
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </span>
              ))}
            </div>
            {(brand.brand_fonts || []).length < 6 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFont}
                  onChange={e => setNewFont(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFont(newFont))}
                  placeholder="e.g., Inter, Poppins..."
                  list="font-suggestions"
                  className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <datalist id="font-suggestions">
                  {FONT_SUGGESTIONS.map(f => <option key={f} value={f} />)}
                </datalist>
                <button type="button" onClick={() => addFont(newFont)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm hover:bg-muted">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
            )}
          </div>

          {/* Brand Guidelines URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" /> Brand Guidelines URL
            </label>
            <input type="url" value={brand.brand_guidelines_url || ""} onChange={e => updateField("brand_guidelines_url", e.target.value)}
              placeholder="https://drive.google.com/... or link to your brand guide"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <p className="text-xs text-muted-foreground">Link to your full brand guidelines (Google Drive, Notion, PDF, etc.)</p>
          </div>

          {/* Tone of Voice */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tone of Voice</label>
            <textarea value={brand.tone_of_voice || ""} onChange={e => updateField("tone_of_voice", e.target.value)}
              rows={2} placeholder="e.g., Professional but approachable, casual and fun, authoritative..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <p className="text-xs text-muted-foreground">Describe how your brand communicates. Creators see this when creating content.</p>
          </div>

          {/* Brand Kit Preview */}
          {((brand.brand_colors || []).length > 0 || (brand.brand_fonts || []).length > 0) && (
            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Brand Kit Preview</p>
              {(brand.brand_colors || []).length > 0 && (
                <div className="flex gap-2">
                  {(brand.brand_colors || []).map(c => (
                    <div key={c} title={c} className="h-8 w-8 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}
              {(brand.brand_fonts || []).length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {(brand.brand_fonts || []).map(f => (
                    <span key={f} style={{ fontFamily: f }} className="text-sm">
                      {f} — The quick brown fox
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </form>

      <GdprRights />
    </div>
  )
}

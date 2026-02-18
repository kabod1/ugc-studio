"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings")
        if (res.ok) setSettings(await res.json())
      } catch {}
      setLoading(false)
    }
    fetchSettings()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (res.ok) toast.success("Settings saved")
      else toast.error("Failed to save")
    } catch { toast.error("Failed to save") }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-2xl font-bold">Platform Settings</h1><p className="text-muted-foreground">Configure platform-wide settings</p></div>
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform Fee (%)</label>
          <input type="number" value={typeof settings.platform_fee_percent === "string" ? parseInt(settings.platform_fee_percent) : settings.platform_fee_percent || 15}
            onChange={(e) => setSettings({ ...settings, platform_fee_percent: parseInt(e.target.value) })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Upload Size (MB)</label>
          <input type="number" value={typeof settings.max_upload_size_mb === "string" ? parseInt(settings.max_upload_size_mb) : settings.max_upload_size_mb || 500}
            onChange={(e) => setSettings({ ...settings, max_upload_size_mb: parseInt(e.target.value) })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Settings
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Save } from "lucide-react"

const CATEGORIES = ["Beauty", "Fashion", "Tech", "Food", "Fitness", "Travel", "Lifestyle", "Gaming", "Education", "Finance"]

export default function CreatorSettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      setProfile(data || {})
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/creators/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: profile.display_name,
          bio: profile.bio,
          location: profile.location,
          languages: profile.languages,
          tiktok_handle: profile.tiktok_handle,
          instagram_handle: profile.instagram_handle,
          youtube_handle: profile.youtube_handle,
          categories: profile.categories,
          hourly_rate_cents: profile.hourly_rate_cents,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {}
    setSaving(false)
  }

  function updateField(field: string, value: any) {
    setProfile((p: any) => ({ ...p, [field]: value }))
  }

  function toggleCategory(cat: string) {
    const current = profile.categories || []
    const updated = current.includes(cat) ? current.filter((c: string) => c !== cat) : [...current, cat]
    updateField("categories", updated)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">Personal Info</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <input type="text" value={profile.display_name || ""} onChange={(e) => updateField("display_name", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea value={profile.bio || ""} onChange={(e) => updateField("bio", e.target.value)} rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input type="text" value={profile.location || ""} onChange={(e) => updateField("location", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hourly Rate ($)</label>
              <input type="number" value={profile.hourly_rate_cents ? profile.hourly_rate_cents / 100 : ""}
                onChange={(e) => updateField("hourly_rate_cents", Math.round(parseFloat(e.target.value || "0") * 100))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">Social Profiles</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">TikTok Handle</label>
            <input type="text" value={profile.tiktok_handle || ""} onChange={(e) => updateField("tiktok_handle", e.target.value)} placeholder="@username"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram Handle</label>
            <input type="text" value={profile.instagram_handle || ""} onChange={(e) => updateField("instagram_handle", e.target.value)} placeholder="@username"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube Handle</label>
            <input type="text" value={profile.youtube_handle || ""} onChange={(e) => updateField("youtube_handle", e.target.value)} placeholder="@channel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  profile.categories?.includes(cat)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                {cat}
              </button>
            ))}
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

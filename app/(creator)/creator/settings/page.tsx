"use client"

import { useState, useEffect } from "react"
import { Loader2, Save, Check, Crown } from "lucide-react"

const CATEGORIES = ["Beauty", "Fashion", "Tech", "Food", "Fitness", "Travel", "Lifestyle", "Gaming", "Education", "Finance"]

export default function CreatorSettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free")
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/creator/settings")
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile || {})
          setSubscriptionTier(data.profile?.subscription_tier || "free")
        } else {
          setProfile({})
        }
      } catch (err) {
        console.error("Settings load error:", err)
        setProfile({})
      }
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
  if (!profile) return <div className="p-6 text-muted-foreground">Unable to load profile. Please try refreshing.</div>

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

      {/* Subscription Section */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h2 className="font-semibold">Subscription</h2>
        </div>

        {subscriptionTier === "free" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You are currently on the <span className="font-medium text-foreground">Free</span> plan.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Upgrade to Creator Pro and unlock:</p>
              <ul className="space-y-2">
                {[
                  "Unlimited applications to campaigns",
                  "Priority ranking in creator search",
                  "Pro badge on your profile",
                  "Advanced analytics & insights",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              disabled={subscriptionLoading}
              onClick={async () => {
                setSubscriptionLoading(true)
                try {
                  const res = await fetch("/api/subscriptions/creator-checkout", { method: "POST" })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                } catch (err) {
                  console.error("Checkout error:", err)
                } finally {
                  setSubscriptionLoading(false)
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
            >
              {subscriptionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
              Upgrade to Creator Pro - &euro;19.99/mo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Crown className="h-3 w-3" /> Pro
              </span>
              <p className="text-sm text-muted-foreground">You&apos;re on Creator Pro</p>
            </div>
            <button
              type="button"
              disabled={subscriptionLoading}
              onClick={async () => {
                setSubscriptionLoading(true)
                try {
                  const res = await fetch("/api/subscriptions/manage", { method: "POST" })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                } catch (err) {
                  console.error("Manage subscription error:", err)
                } finally {
                  setSubscriptionLoading(false)
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              {subscriptionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Manage Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

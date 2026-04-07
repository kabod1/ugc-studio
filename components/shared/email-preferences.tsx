"use client"

import { useEffect, useState } from "react"
import { Mail, Megaphone, Wrench, ShieldCheck } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type EmailPreferences = {
  marketing: boolean
  product: boolean
  security: boolean
}

const DEFAULT: EmailPreferences = { marketing: true, product: true, security: true }

export function EmailPreferencesPanel() {
  const [prefs, setPrefs] = useState<EmailPreferences>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/user/email-preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) setPrefs(data.preferences)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/user/email-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Email preferences saved.")
    } catch {
      toast.error("Failed to save email preferences.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-40 rounded-lg bg-muted" />
  }

  return (
    <div className="bg-card border rounded-lg p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Email Preferences</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Choose which emails you receive from Townshub. You can unsubscribe from individual
        categories at any time.
      </p>

      <div className="space-y-3">
        {/* Marketing */}
        <div className="flex items-start justify-between gap-4 rounded-md border p-4">
          <div className="flex items-start gap-3">
            <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Marketing &amp; Promotions</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Newsletters, platform tips, campaign opportunities, and promotional offers.
              </p>
            </div>
          </div>
          <Switch
            checked={prefs.marketing}
            onCheckedChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
            aria-label="Toggle marketing emails"
          />
        </div>

        {/* Product */}
        <div className="flex items-start justify-between gap-4 rounded-md border p-4">
          <div className="flex items-start gap-3">
            <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Product Updates</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                New features, platform improvements, and changelogs.
              </p>
            </div>
          </div>
          <Switch
            checked={prefs.product}
            onCheckedChange={(v) => setPrefs((p) => ({ ...p, product: v }))}
            aria-label="Toggle product update emails"
          />
        </div>

        {/* Security */}
        <div className="flex items-start justify-between gap-4 rounded-md border p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Security Alerts</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Login notifications, password resets, and account security updates.
                Strongly recommended.
              </p>
            </div>
          </div>
          <Switch
            checked={prefs.security}
            onCheckedChange={(v) => setPrefs((p) => ({ ...p, security: v }))}
            aria-label="Toggle security alert emails"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Email Preferences"}
        </Button>
      </div>
    </div>
  )
}

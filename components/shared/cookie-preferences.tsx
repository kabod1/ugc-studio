"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { setConsent, getConsent, withdrawAll } from "@/lib/consent"
import Link from "next/link"

interface CookiePreferencesProps {
  open: boolean
  onClose: () => void
  onSave: () => void
}

export function CookiePreferences({ open, onClose, onSave }: CookiePreferencesProps) {
  const existing = getConsent()
  const [functional, setFunctional] = useState(existing?.functional ?? true)
  const [analytics, setAnalytics] = useState(existing?.analytics ?? true)
  const [aiProcessing, setAiProcessing] = useState(existing?.aiProcessing ?? false)

  function handleSave() {
    setConsent({ functional, analytics, aiProcessing })
    onSave()
  }

  function handleWithdrawAll() {
    withdrawAll()
    setFunctional(false)
    setAnalytics(false)
    setAiProcessing(false)
    onSave()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cookie &amp; Processing Preferences</DialogTitle>
          <DialogDescription>
            Manage how Townshub uses cookies and AI processing on your account. You can update these
            preferences at any time from the footer. For more details, see our{" "}
            <Link href="/cookie-policy" className="text-primary underline underline-offset-2">
              Cookie Policy
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          {/* Essential */}
          <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-semibold">Essential Cookies</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Required for authentication, sessions, and core platform functions.
                Cannot be disabled.
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                <code className="rounded bg-muted px-1 py-0.5">sb-*-auth-token</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5">user-role</code>
              </p>
            </div>
            <Switch checked disabled aria-label="Essential cookies always enabled" />
          </div>

          {/* Functional */}
          <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-semibold">Functional Cookies</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Remember your preferences such as dark/light mode and sidebar state.
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                <code className="rounded bg-muted px-1 py-0.5">theme</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5">sidebar-collapsed</code>
              </p>
            </div>
            <Switch
              checked={functional}
              onCheckedChange={setFunctional}
              aria-label="Toggle functional cookies"
            />
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-semibold">Analytics Cookies</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Help us understand how visitors use the platform so we can improve it.
                No personally identifiable data is sent.
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                <code className="rounded bg-muted px-1 py-0.5">_ga</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5">_ga_*</code>{" "}
                (Google Analytics 4)
              </p>
            </div>
            <Switch
              checked={analytics}
              onCheckedChange={setAnalytics}
              aria-label="Toggle analytics cookies"
            />
          </div>

          {/* AI Processing */}
          <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-semibold">AI-Powered Matching &amp; Scoring</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Allow your profile data and content to be processed by AI for
                creator-campaign matching and content quality scoring. Disabling this may limit
                platform recommendations.
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Data shared: profile, niche categories, content metadata. We do not use your
                data to train third-party models.
              </p>
            </div>
            <Switch
              checked={aiProcessing}
              onCheckedChange={setAiProcessing}
              aria-label="Toggle AI processing"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
          <div className="border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={handleWithdrawAll}
            >
              Withdraw All Consent
            </Button>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Disables all optional cookies and AI processing. Essential cookies remain active.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

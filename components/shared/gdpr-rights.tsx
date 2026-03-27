"use client"

import { useState } from "react"
import { ShieldCheck, Download, Trash2, Cookie, ExternalLink } from "lucide-react"
import { CookiePreferences } from "@/components/shared/cookie-preferences"
import Link from "next/link"

export function GdprRights() {
  const [showCookiePrefs, setShowCookiePrefs] = useState(false)

  return (
    <>
      <div className="bg-card border rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Privacy &amp; Data Rights</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Under GDPR and applicable data protection law, you have the right to access, correct,
          export, or delete your personal data at any time.
        </p>

        <div className="space-y-3">
          {/* Cookie preferences */}
          <div className="flex items-start justify-between gap-4 rounded-md border p-4">
            <div className="flex items-start gap-3">
              <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Cookie Preferences</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Control which cookies Townshub uses on your device — analytics, functional, or
                  essential only.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCookiePrefs(true)}
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Manage
            </button>
          </div>

          {/* Download data */}
          <div className="flex items-start justify-between gap-4 rounded-md border p-4">
            <div className="flex items-start gap-3">
              <Download className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Export My Data</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Request a copy of all personal data we hold about you. We&apos;ll email it to
                  you within 30 days (usually within 72 hours).
                </p>
              </div>
            </div>
            <a
              href="mailto:support@townshub.com?subject=Data%20Export%20Request&body=Please%20send%20me%20a%20copy%20of%20all%20personal%20data%20held%20about%20my%20account."
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Request
            </a>
          </div>

          {/* Delete account */}
          <div className="flex items-start justify-between gap-4 rounded-md border border-destructive/30 p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">Delete My Account</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently delete your account and all associated data. This action is
                  irreversible. Outstanding payments will be processed before deletion.
                </p>
              </div>
            </div>
            <a
              href="mailto:support@townshub.com?subject=Account%20Deletion%20Request&body=Please%20permanently%20delete%20my%20account%20and%20all%20associated%20personal%20data."
              className="shrink-0 text-xs font-medium text-destructive hover:underline"
            >
              Request
            </a>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          For all data requests, contact{" "}
          <a href="mailto:support@townshub.com" className="text-primary hover:underline">
            support@townshub.com
          </a>
          . See our{" "}
          <Link href="/privacy" className="text-primary hover:underline inline-flex items-center gap-0.5">
            Privacy Policy <ExternalLink className="h-3 w-3" />
          </Link>{" "}
          for full details on how we handle your data.
        </p>
      </div>

      <CookiePreferences
        open={showCookiePrefs}
        onClose={() => setShowCookiePrefs(false)}
        onSave={() => setShowCookiePrefs(false)}
      />
    </>
  )
}

"use client"

import { useState } from "react"
import { ShieldCheck, Download, Trash2, Cookie, ExternalLink, Mail, Loader2 } from "lucide-react"
import { CookiePreferences } from "@/components/shared/cookie-preferences"
import { EmailPreferencesPanel } from "@/components/shared/email-preferences"
import Link from "next/link"
import { toast } from "sonner"

export function GdprRights() {
  const [showCookiePrefs, setShowCookiePrefs] = useState(false)
  const [showEmailPrefs, setShowEmailPrefs] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleDataExport() {
    setExportLoading(true)
    try {
      const res = await fetch("/api/gdpr/data-export", { method: "POST" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Export failed")
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `townshub-data-export-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Data export downloaded.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed. Please try again.")
    } finally {
      setExportLoading(false)
    }
  }

  async function handleAccountDeletion() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleteLoading(true)
    try {
      const res = await fetch("/api/gdpr/account-deletion", { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Deletion failed")
      }
      toast.success("Account deleted. You will be signed out.")
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Deletion failed. Please try again.")
      setConfirmDelete(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <div className="bg-card border rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Privacy &amp; Data Rights</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Under GDPR and applicable Cyprus data protection law, you have the right to access,
          correct, export, or delete your personal data at any time.
        </p>

        <div className="space-y-3">
          {/* Cookie preferences */}
          <div className="flex items-start justify-between gap-4 rounded-md border p-4">
            <div className="flex items-start gap-3">
              <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Cookie &amp; AI Processing Preferences</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Control cookies, analytics, and AI-powered matching on your account.
                  Includes bulk &quot;Withdraw All Consent&quot; option.
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

          {/* Email preferences */}
          <div className="flex items-start justify-between gap-4 rounded-md border p-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Preferences</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Opt in or out of marketing, product updates, and security alert emails.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowEmailPrefs((v) => !v)}
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              {showEmailPrefs ? "Hide" : "Manage"}
            </button>
          </div>

          {showEmailPrefs && (
            <div className="pl-1">
              <EmailPreferencesPanel />
            </div>
          )}

          {/* Download data */}
          <div className="flex items-start justify-between gap-4 rounded-md border p-4">
            <div className="flex items-start gap-3">
              <Download className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Export My Data</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Download a JSON copy of all personal data we hold: profile, campaigns,
                  payments, contracts, and notifications.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDataExport}
              disabled={exportLoading}
              className="shrink-0 text-xs font-medium text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              {exportLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              {exportLoading ? "Exporting…" : "Download"}
            </button>
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
                {confirmDelete && (
                  <p className="mt-1.5 text-xs font-medium text-destructive">
                    Click again to confirm permanent deletion.
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleAccountDeletion}
              disabled={deleteLoading}
              className="shrink-0 text-xs font-medium text-destructive hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              {deleteLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              {deleteLoading ? "Deleting…" : confirmDelete ? "Confirm Delete" : "Delete"}
            </button>
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
          and{" "}
          <Link href="/privacy/subprocessors" className="text-primary hover:underline inline-flex items-center gap-0.5">
            Data Subprocessors <ExternalLink className="h-3 w-3" />
          </Link>{" "}
          for full details.
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

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CookiePreferences } from "@/components/shared/cookie-preferences"
import { hasConsented, acceptAll, rejectAll } from "@/lib/consent"
import Link from "next/link"
import { Cookie } from "lucide-react"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)

  useEffect(() => {
    // Small delay so it doesn't flash during hydration
    const t = setTimeout(() => {
      if (!hasConsented()) setVisible(true)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  function handleAcceptAll() {
    acceptAll()
    setVisible(false)
  }

  function handleRejectAll() {
    rejectAll()
    setVisible(false)
  }

  function handleSavePrefs() {
    setShowPrefs(false)
    setVisible(false)
  }

  return (
    <>
      <div
        role="dialog"
        aria-label="Cookie consent"
        aria-live="polite"
        className="fixed bottom-0 left-0 right-0 z-[100] border-t bg-background shadow-2xl"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6 lg:px-8">
          {/* Icon + text */}
          <div className="flex items-start gap-3 sm:flex-1">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              We use cookies to keep you signed in, remember your preferences, and
              understand how you use our platform. By clicking &quot;Accept All&quot; you
              consent to our use of cookies as described in our{" "}
              <Link
                href="/cookie-policy"
                className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrefs(true)}
              className="text-xs"
            >
              Manage Preferences
            </Button>
            <Button variant="outline" size="sm" onClick={handleRejectAll} className="text-xs">
              Reject All
            </Button>
            <Button size="sm" onClick={handleAcceptAll} className="text-xs">
              Accept All
            </Button>
          </div>
        </div>
      </div>

      <CookiePreferences
        open={showPrefs}
        onClose={() => setShowPrefs(false)}
        onSave={handleSavePrefs}
      />
    </>
  )
}

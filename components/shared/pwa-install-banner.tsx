"use client"

import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { PWAInstallModal } from "@/components/shared/pwa-install-modal"

const DISMISSED_KEY = "townshub-pwa-dismissed"

export function PWAInstallBanner() {
  const { canInstall, isStandalone, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setDismissed(!!localStorage.getItem(DISMISSED_KEY))
  }, [])

  // Don't show if already installed as PWA or user dismissed
  if (isStandalone || dismissed) return null

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1")
    setDismissed(true)
  }

  async function handleInstall() {
    if (canInstall) {
      const outcome = await install()
      if (outcome === "accepted") { setDismissed(true); return }
    }
    setShowModal(true)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[200] border-t bg-background shadow-2xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:gap-4">
          <img
            src="/icon-192.png"
            alt="Townshub"
            className="h-11 w-11 shrink-0 rounded-xl border"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-none">Install Townshub</p>
            <p className="text-xs text-muted-foreground mt-1">
              Faster access, offline support, and a native app experience.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm" onClick={handleInstall} className="gap-1.5 text-xs h-8">
              <Download className="h-3.5 w-3.5" />
              Install
            </Button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <PWAInstallModal
        open={showModal}
        onClose={() => setShowModal(false)}
        canNativeInstall={canInstall}
        onNativeInstall={async () => {
          await install()
          setShowModal(false)
          setDismissed(true)
        }}
      />
    </>
  )
}

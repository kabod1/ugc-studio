"use client"

import { useEffect, useState } from "react"
import { X, Download, Smartphone } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { PWAInstallModal } from "@/components/shared/pwa-install-modal"

const DISMISSED_KEY = "townshub-pwa-dismissed"

export function PWAInstallBanner() {
  const { canInstall, isIOS, isStandalone, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setDismissed(!!localStorage.getItem(DISMISSED_KEY))
  }, [])

  // Don't show if already installed as PWA or user dismissed
  // Show on mobile only (< 768px) and only if installable or iOS
  if (isStandalone || dismissed) return null
  if (!canInstall && !isIOS) return null

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
      {/* Top banner — avoids conflict with bottom navigation */}
      <div className="fixed top-0 left-0 right-0 z-[200] border-b bg-primary text-primary-foreground shadow-lg">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Smartphone className="h-5 w-5 shrink-0 opacity-90" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-none">Add to Home Screen</p>
            <p className="text-xs opacity-80 mt-0.5">
              Install for faster access and offline support
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="rounded-md p-1.5 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer so the fixed banner doesn't cover content */}
      <div className="h-14" />

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

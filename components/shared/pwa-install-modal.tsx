"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type Browser = "chrome" | "edge" | "firefox" | "safari-ios" | "safari-mac" | "other"

function detectBrowser(): Browser {
  if (typeof window === "undefined") return "other"
  const ua = navigator.userAgent
  const isIOS = /iphone|ipad|ipod/i.test(ua)
  if (isIOS) return "safari-ios"
  if (/edg\//i.test(ua)) return "edge"
  if (/chrome/i.test(ua)) return "chrome"
  if (/firefox/i.test(ua)) return "firefox"
  if (/safari/i.test(ua)) return "safari-mac"
  return "other"
}

const INSTRUCTIONS: Record<Browser, { title: string; steps: string[] }> = {
  chrome: {
    title: "Install on Chrome",
    steps: [
      'Click the ⋮ menu in the top-right corner of Chrome',
      'Select "Install Townshub…" or "Cast, save, and share" → "Install page as app"',
      'Click "Install" in the confirmation dialog',
    ],
  },
  edge: {
    title: "Install on Edge",
    steps: [
      'Click the … menu (top right)',
      'Select "Apps" → "Install this site as an app"',
      'Click "Install" to confirm',
    ],
  },
  "safari-ios": {
    title: "Add to Home Screen (iOS)",
    steps: [
      'Tap the Share button at the bottom of Safari',
      'Scroll down and tap "Add to Home Screen"',
      'Tap "Add" in the top-right corner',
    ],
  },
  "safari-mac": {
    title: "Add to Dock (Safari)",
    steps: [
      'Click "File" in the menu bar',
      'Select "Add to Dock…"',
      'Click "Add" to confirm',
    ],
  },
  firefox: {
    title: "Install on Firefox",
    steps: [
      'Firefox does not support installing PWAs on desktop',
      'For the best experience, open this page in Chrome or Edge',
      'Then use their install option from the browser menu',
    ],
  },
  other: {
    title: "Install App",
    steps: [
      'Look for an install or "Add to Home Screen" option in your browser menu',
      'If using Chrome or Edge, click the ⋮/… menu',
      'Select "Install Townshub" or "Install App"',
    ],
  },
}

function getInstructions(browser: Browser) {
  return INSTRUCTIONS[browser] ?? INSTRUCTIONS.other
}

interface PWAInstallModalProps {
  open: boolean
  onClose: () => void
  onNativeInstall?: () => void
  canNativeInstall: boolean
}

export function PWAInstallModal({
  open,
  onClose,
  onNativeInstall,
  canNativeInstall,
}: PWAInstallModalProps) {
  const browser = detectBrowser()
  const { title, steps } = getInstructions(browser)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <img src="/icon-192.png" alt="Townshub" className="h-10 w-10 rounded-xl border" />
            <div>
              <DialogTitle className="text-base">Install Townshub</DialogTitle>
              <DialogDescription className="text-xs">
                Get faster access and offline support
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {canNativeInstall ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your browser is ready to install Townshub as a native app.
            </p>
            <Button className="w-full gap-2" onClick={onNativeInstall}>
              <Download className="h-4 w-4" />
              Install Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium">{title}</p>
            <ol className="space-y-2">
              {steps.map((step: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Got it
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

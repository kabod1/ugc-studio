"use client"

import { useEffect, useState } from "react"

// ─── Module-level prompt capture ─────────────────────────────────────────────
// Must live outside React so it captures the event even before any component
// mounts. The event often fires immediately after page load.

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

let _prompt: BeforeInstallPromptEvent | null = null
let _installed = false

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    _prompt = e as BeforeInstallPromptEvent
    console.info("[PWA] beforeinstallprompt captured ✓")
    window.dispatchEvent(new CustomEvent("pwa:prompt-ready"))
  })

  window.addEventListener("appinstalled", () => {
    _prompt = null
    _installed = true
    console.info("[PWA] app installed ✓")
    window.dispatchEvent(new CustomEvent("pwa:installed"))
  })
}

// ─────────────────────────────────────────────────────────────────────────────

function getIsIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function getIsStandalone() {
  return (
    ("standalone" in navigator &&
      (navigator as { standalone?: boolean }).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches
  )
}

export type PWAInstallState = {
  /** True on Android/desktop when the browser install prompt is ready */
  canInstall: boolean
  /** True on iOS — no prompt available, show manual instructions instead */
  isIOS: boolean
  /** True if already running as installed PWA */
  isStandalone: boolean
  /** Call this to trigger the browser's install dialog */
  install: () => Promise<"accepted" | "dismissed" | "unavailable">
}

export function usePWAInstall(): PWAInstallState {
  const [canInstall, setCanInstall] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [ios, setIos] = useState(false)

  useEffect(() => {
    setIsStandalone(getIsStandalone())
    setIos(getIsIOS())

    // Check if already captured before this component mounted
    if (_prompt && !_installed) setCanInstall(true)

    function onReady() {
      if (_prompt) setCanInstall(true)
    }
    function onInstalled() {
      setCanInstall(false)
      setIsStandalone(true)
    }

    window.addEventListener("pwa:prompt-ready", onReady)
    window.addEventListener("pwa:installed", onInstalled)
    return () => {
      window.removeEventListener("pwa:prompt-ready", onReady)
      window.removeEventListener("pwa:installed", onInstalled)
    }
  }, [])

  async function install(): Promise<"accepted" | "dismissed" | "unavailable"> {
    if (!_prompt) return "unavailable"
    await _prompt.prompt()
    const { outcome } = await _prompt.userChoice
    if (outcome === "accepted") {
      _prompt = null
      setCanInstall(false)
    }
    return outcome
  }

  return { canInstall, isIOS: ios, isStandalone, install }
}

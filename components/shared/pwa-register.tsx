"use client"

import { useEffect } from "react"

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.info("[PWA] Service workers not supported in this browser")
      return
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        console.info("[PWA] Service worker registered ✓", reg.scope)
        reg.update()
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update()
        })
      })
      .catch((err) => {
        console.warn("[PWA] Service worker registration failed:", err)
      })
  }, [])

  return null
}

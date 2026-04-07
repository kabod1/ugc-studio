"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { CookieBanner } from "@/components/shared/cookie-banner"
import { PWAInstallBanner } from "@/components/shared/pwa-install-banner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-right" richColors />
      <CookieBanner />
      <PWAInstallBanner />
    </ThemeProvider>
  )
}

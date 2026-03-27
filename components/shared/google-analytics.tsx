"use client"

import Script from "next/script"
import { useEffect } from "react"
import { getConsent } from "@/lib/consent"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

function updateGtagConsent(analytics: boolean) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}

export function GoogleAnalytics() {
  useEffect(() => {
    // Apply saved consent on mount
    const consent = getConsent()
    if (consent) {
      updateGtagConsent(consent.analytics)
    }

    // Listen for future consent changes (banner / preferences modal)
    function onConsentUpdate(e: Event) {
      const detail = (e as CustomEvent).detail
      updateGtagConsent(detail?.analytics === true)
    }
    window.addEventListener("consent-updated", onConsentUpdate)
    return () => window.removeEventListener("consent-updated", onConsentUpdate)
  }, [])

  if (!GA_ID) return null

  return (
    <>
      {/* Set consent defaults BEFORE the GA script loads — required for Consent Mode v2 */}
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  )
}

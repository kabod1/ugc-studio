import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/shared/providers"
import { GoogleAnalytics } from "@/components/shared/google-analytics"
import { PWARegister } from "@/components/shared/pwa-register"

const inter = Inter({ subsets: ["latin"] })

const APP_URL = "https://ugc-studio-zeta.vercel.app"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7C3AED" },
    { media: "(prefers-color-scheme: dark)", color: "#7C3AED" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // enables safe-area-inset env() vars on iOS
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Townshub — UGC Studio",
    template: "%s | Townshub",
  },
  description: "Townshub UGC Studio — manage your entire UGC workflow from brief to published content to payment.",
  applicationName: "Townshub",
  keywords: ["UGC", "content creators", "brand campaigns", "user generated content", "Townshub"],
  authors: [{ name: "Townshub Limited" }],
  creator: "Townshub Limited",
  publisher: "Townshub Limited",

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Townshub",
    startupImage: [
      {
        url: "/icon-512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  formatDetection: {
    telephone: false,
  },

  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Townshub",
    title: "Townshub — UGC Studio",
    description: "Connect brands with creators. Manage campaigns, content, and payments — all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Townshub Limited",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Townshub — UGC Studio",
    description: "Connect brands with creators. Manage campaigns, content, and payments — all in one place.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleAnalytics />
        <PWARegister />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

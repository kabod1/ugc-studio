import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Data Subprocessors - Townshub",
  description: "List of third-party data processors used by Townshub UGC Studio.",
}

const subprocessors = [
  {
    name: "Supabase",
    purpose: "Database hosting, authentication, and file storage",
    dataTypes: "Account credentials, profile data, campaign data, content metadata, messages",
    location: "EU (AWS eu-west-1 / eu-central-1)",
    dpa: "https://supabase.com/privacy",
  },
  {
    name: "Stripe",
    purpose: "Payment processing, escrow management, Stripe Connect payouts",
    dataTypes: "Payment card data, bank account details, transaction history, identity verification",
    location: "USA / EU (PCI-DSS Level 1 certified)",
    dpa: "https://stripe.com/privacy",
  },
  {
    name: "OpenAI",
    purpose: "AI-powered creator-campaign matching and content quality scoring (GPT-4o)",
    dataTypes: "Creator profile excerpts, campaign briefs, content metadata (when AI processing consent is given)",
    location: "USA",
    dpa: "https://openai.com/policies/privacy-policy",
  },
  {
    name: "Google Analytics",
    purpose: "Platform usage analytics and performance measurement",
    dataTypes: "Anonymised usage events, page views, device type, browser (no PII sent)",
    location: "USA / EU (Consent Mode v2 — only active with analytics consent)",
    dpa: "https://policies.google.com/privacy",
  },
  {
    name: "Vercel",
    purpose: "Web application hosting and edge delivery",
    dataTypes: "IP addresses (for edge routing), request logs retained for 24 hours",
    location: "Global CDN (primary: EU regions)",
    dpa: "https://vercel.com/legal/privacy-policy",
  },
]

export default function SubprocessorsPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/"><LogoHorizontal /></Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-primary">Log In</Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <article className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-gray dark:prose-invert mb-8">
            <h1>Data Subprocessors</h1>
            <p className="text-muted-foreground">Last updated: April 1, 2026</p>
            <p>
              Townshub Limited engages the following third-party subprocessors to operate the
              UGC Studio platform. Each processor has been vetted for GDPR compliance. We maintain
              Data Processing Agreements (DPAs) with all subprocessors where required.
            </p>
            <p>
              We will update this page at least 30 days before adding a new subprocessor that
              materially changes how your data is processed. For questions, contact{" "}
              <a href="mailto:support@townshub.com">support@townshub.com</a>.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold">Processor</th>
                  <th className="text-left px-4 py-3 font-semibold">Purpose</th>
                  <th className="text-left px-4 py-3 font-semibold">Data Processed</th>
                  <th className="text-left px-4 py-3 font-semibold">Location</th>
                  <th className="text-left px-4 py-3 font-semibold">Privacy Policy</th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((sp, i) => (
                  <tr key={sp.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="px-4 py-4 font-medium align-top">{sp.name}</td>
                    <td className="px-4 py-4 text-muted-foreground align-top">{sp.purpose}</td>
                    <td className="px-4 py-4 text-muted-foreground align-top">{sp.dataTypes}</td>
                    <td className="px-4 py-4 text-muted-foreground align-top whitespace-nowrap">{sp.location}</td>
                    <td className="px-4 py-4 align-top">
                      <a
                        href={sp.dpa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 prose prose-gray dark:prose-invert">
            <h2>International Data Transfers</h2>
            <p>
              Some subprocessors (OpenAI, Google Analytics, Stripe) process data in the United
              States. These transfers are covered by Standard Contractual Clauses (SCCs) as
              approved by the European Commission, ensuring an adequate level of protection
              equivalent to that within the EEA.
            </p>

            <h2>Your Rights</h2>
            <p>
              If you have consented to AI processing, your data may be sent to OpenAI for
              matching and quality scoring. You can withdraw this consent at any time from your{" "}
              <Link href="/dashboard/settings">account settings</Link> or via the cookie
              preferences panel. See our{" "}
              <Link href="/privacy">Privacy Policy</Link> for full details on your GDPR rights.
            </p>
          </div>
        </div>
      </article>

      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Townshub Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <ManageCookiesButton />
            <a href="mailto:support@townshub.com" className="text-primary hover:underline">
              support@townshub.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

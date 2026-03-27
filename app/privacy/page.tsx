import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Townshub",
  description: "Townshub privacy policy. Learn how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/"><LogoHorizontal /></Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-primary">Log In</Link>
            <Link href="/signup" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <article className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: February 18, 2026</p>

          <p>
            Townshub Limited (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Townshub UGC
            Studio platform (the &quot;Service&quot;). This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our Service.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>Personal Information</h3>
          <p>When you register for an account, we collect:</p>
          <ul>
            <li>Name, email address, and password</li>
            <li>Company name and website (for brand accounts)</li>
            <li>Date of birth (for creator age verification)</li>
            <li>Social media handles and follower counts</li>
            <li>Tax form type (W-9, W-8BEN, EU VAT registration)</li>
            <li>Payment information (processed securely via Stripe)</li>
          </ul>

          <h3>Content Data</h3>
          <p>We store content submissions including videos, images, and associated metadata
          (titles, descriptions, file types, thumbnails) that you upload to the platform.</p>

          <h3>Usage Data</h3>
          <p>We automatically collect information about how you interact with the Service,
          including pages visited, features used, browser type, IP address, and device information.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service</li>
            <li>Process transactions and send payment notifications</li>
            <li>Match creators with brand campaigns using AI-powered algorithms</li>
            <li>Score content quality using automated analysis</li>
            <li>Verify creator age and identity</li>
            <li>Send you updates, marketing communications, and support messages</li>
            <li>Comply with legal obligations (tax reporting, GDPR requests)</li>
          </ul>

          <h2>3. AI-Powered Features</h2>
          <p>
            Our platform uses OpenAI&apos;s GPT-4o to power creator-campaign matching and content
            quality scoring. When these features are used:
          </p>
          <ul>
            <li>Creator profile data and campaign briefs are sent to OpenAI for analysis</li>
            <li>Content submissions may be analyzed for quality scoring</li>
            <li>We do not use your data to train third-party AI models</li>
            <li>AI-generated scores and recommendations are used to assist, not replace, human decision-making</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We share your information only in the following circumstances:</p>
          <ul>
            <li><strong>With other users:</strong> Creator profiles are visible to brands searching for creators. Brand campaign details are visible to creators browsing campaigns.</li>
            <li><strong>Payment processors:</strong> Stripe processes all payments and receives necessary transaction data.</li>
            <li><strong>AI service providers:</strong> OpenAI processes data for matching and quality scoring features.</li>
            <li><strong>Legal compliance:</strong> When required by law, court order, or governmental authority.</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed
            to provide the Service. You may request deletion of your account and associated data at
            any time by contacting us.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement industry-standard security measures including encrypted connections (TLS),
            secure password hashing, and role-based access controls. Payment data is handled entirely
            by Stripe and never stored on our servers.
          </p>

          <h2>7. Your Rights (GDPR)</h2>
          <p>If you are in the European Economic Area, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>To exercise these rights, contact us at <a href="mailto:support@townshub.com">support@townshub.com</a>.</p>

          <h2>8. Cookies</h2>
          <p>
            We use cookies and similar technologies to maintain sessions, remember preferences, and
            analyze platform usage. See our <Link href="/cookie-policy">Cookie Policy</Link> for details.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            The Service is not intended for users under 18 years of age. We require age verification
            for all creator accounts and do not knowingly collect data from minors.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes
            by email or through the Service. Your continued use after changes constitutes acceptance.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            For questions about this Privacy Policy, contact us at:<br />
            <a href="mailto:support@townshub.com">support@townshub.com</a>
          </p>
        </div>
      </article>

      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Townshub Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <ManageCookiesButton />
            <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - UGC Studio",
  description: "UGC Studio terms of service. Rules and guidelines for using our platform.",
}

export default function TermsPage() {
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
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: February 18, 2026</p>

          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of UGC Studio
            (the &quot;Service&quot;), operated by UGC Studio (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;). By using the Service, you agree to these Terms.
          </p>

          <h2>1. Account Registration</h2>
          <p>To use the Service, you must:</p>
          <ul>
            <li>Be at least 18 years old</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>
          <p>
            You are responsible for all activity under your account. We reserve the right to suspend
            or terminate accounts that violate these Terms.
          </p>

          <h2>2. Platform Services</h2>

          <h3>For Brands</h3>
          <p>UGC Studio provides tools to:</p>
          <ul>
            <li>Create and manage UGC campaigns</li>
            <li>Discover and match with creators using AI-powered search</li>
            <li>Review, approve, and manage content submissions</li>
            <li>Process escrow payments to creators via Stripe Connect</li>
            <li>Generate contracts and manage usage rights</li>
            <li>Track analytics and ROI across campaigns</li>
          </ul>

          <h3>For Creators</h3>
          <p>UGC Studio provides tools to:</p>
          <ul>
            <li>Browse and apply to brand campaigns</li>
            <li>Submit content with version tracking</li>
            <li>Receive secure payments via Stripe Connect</li>
            <li>Manage contracts and usage rights</li>
            <li>Track earnings and campaign history</li>
          </ul>

          <h2>3. Subscriptions & Payments</h2>
          <p>
            The Service offers free and paid subscription tiers. Paid subscriptions are billed monthly
            or annually in EUR through Stripe. By subscribing, you authorize recurring charges.
          </p>
          <ul>
            <li>You may cancel your subscription at any time through the billing settings</li>
            <li>Cancellation takes effect at the end of the current billing period</li>
            <li>We do not provide refunds for partial billing periods</li>
            <li>We reserve the right to change pricing with 30 days notice</li>
          </ul>

          <h2>4. Platform Fees</h2>
          <p>
            UGC Studio charges a 15% platform fee on all payments processed through the Service.
            This fee is deducted from the payment amount before the creator payout. The fee covers
            payment processing, escrow management, and platform services.
          </p>

          <h2>5. Escrow Payments</h2>
          <p>
            When a brand initiates a payment, funds are held in escrow until the brand approves
            the creator&apos;s content. Upon approval, funds are released to the creator&apos;s
            Stripe Connect account. This process protects both parties:
          </p>
          <ul>
            <li>Brands are protected from paying for undelivered or substandard content</li>
            <li>Creators are protected by guaranteed payment upon content approval</li>
            <li>Disputes are handled through our support team</li>
          </ul>

          <h2>6. Content & Intellectual Property</h2>
          <ul>
            <li>Creators retain ownership of their original content until usage rights are transferred via contract</li>
            <li>Upon contract execution, usage rights are transferred as specified (exclusive, non-exclusive, limited, or perpetual)</li>
            <li>Brands may use approved content only within the scope of the agreed usage rights, territories, and duration</li>
            <li>You may not upload content that infringes on third-party intellectual property</li>
          </ul>

          <h2>7. AI-Powered Features</h2>
          <p>
            The Service uses AI (GPT-4o) for creator matching and content quality scoring. These
            features provide recommendations and scores to assist decision-making. AI-generated
            results are advisory and do not constitute guarantees of creator performance or content quality.
          </p>

          <h2>8. Prohibited Uses</h2>
          <p>You may not:</p>
          <ul>
            <li>Use the Service for any illegal purpose</li>
            <li>Upload harmful, offensive, or misleading content</li>
            <li>Attempt to circumvent platform fees by transacting outside the Service</li>
            <li>Create fake accounts, reviews, or engagement metrics</li>
            <li>Scrape, crawl, or automated-access the Service without permission</li>
            <li>Interfere with the Service&apos;s operation or security</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, UGC Studio shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the
            Service. Our total liability shall not exceed the fees you paid in the 12 months
            preceding the claim.
          </p>

          <h2>10. Dispute Resolution</h2>
          <p>
            Any disputes arising from these Terms shall be resolved through good-faith negotiation.
            If unresolved, disputes shall be subject to the courts of Ireland, and Irish law shall
            govern these Terms.
          </p>

          <h2>11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of material changes via
            email or through the Service at least 30 days before they take effect. Continued use
            after changes constitutes acceptance.
          </p>

          <h2>12. Contact</h2>
          <p>
            For questions about these Terms, contact us at:<br />
            <a href="mailto:support@townshub.com">support@townshub.com</a>
          </p>
        </div>
      </article>

      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UGC Studio. All rights reserved.</p>
          <p>Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a></p>
        </div>
      </footer>
    </div>
  )
}

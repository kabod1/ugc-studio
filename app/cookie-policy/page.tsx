import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy - Townshub",
  description: "How Townshub uses cookies and similar technologies on our platform.",
}

export default function CookiePolicyPage() {
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
          <h1>Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: March 27, 2026</p>

          <p>
            This Cookie Policy explains how Townshub Limited (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) uses cookies and similar technologies when you visit the Townshub UGC
            Studio platform (&quot;Service&quot;). By using the Service you agree to the use of
            cookies as described in this policy.
          </p>

          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device by websites you visit. They allow the
            website to remember your actions and preferences over time. Cookies can be
            &quot;session&quot; cookies (deleted when you close your browser) or
            &quot;persistent&quot; cookies (remaining until they expire or you delete them).
          </p>

          <h2>2. Your Consent</h2>
          <p>
            We use a consent banner when you first visit Townshub. You can choose to:
          </p>
          <ul>
            <li><strong>Accept All</strong> — enable all cookie categories including analytics</li>
            <li><strong>Reject All</strong> — restrict cookies to essential only</li>
            <li><strong>Manage Preferences</strong> — choose exactly which categories to allow</li>
          </ul>
          <p>
            Your preference is saved in your browser&apos;s local storage under the key{" "}
            <code>townshub-cookie-consent</code>. You can change your preferences at any time
            using the &quot;Manage Cookies&quot; link in the footer or your account settings.
          </p>
          <p>
            We use <strong>Google Analytics Consent Mode v2</strong>, which means analytics
            cookies are blocked by default until you grant consent. Even if you decline analytics,
            Google may receive anonymous, cookieless pings used for conversion modelling — no
            personal data is shared in that mode.
          </p>

          <h2>3. Cookies We Use</h2>

          <h3>Essential Cookies (always active)</h3>
          <p>
            Required for the platform to function. These cannot be disabled because the Service
            would not work without them.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>sb-*-auth-token</code></td>
                <td>Authentication session (Supabase)</td>
                <td>7 days</td>
              </tr>
              <tr>
                <td><code>sb-*-auth-token-code-verifier</code></td>
                <td>PKCE OAuth flow security</td>
                <td>Session</td>
              </tr>
              <tr>
                <td><code>user-role</code></td>
                <td>Stores your account role (brand / creator) for routing</td>
                <td>Session</td>
              </tr>
              <tr>
                <td><code>townshub-cookie-consent</code></td>
                <td>Remembers your cookie preference</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h3>Functional Cookies (optional)</h3>
          <p>
            Remember your preferences for a more personalised experience. Disabling these means
            your settings will reset each visit.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>theme</code></td>
                <td>Remembers light / dark mode preference</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td><code>sidebar-collapsed</code></td>
                <td>Remembers dashboard sidebar state</td>
                <td>30 days</td>
              </tr>
            </tbody>
          </table>

          <h3>Analytics Cookies (optional, consent required)</h3>
          <p>
            Used to understand how visitors interact with the platform so we can improve it.
            These are blocked by default and only set after you give consent.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Purpose</th>
                <th>Duration</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>_ga</code></td>
                <td>Distinguishes unique visitors (Google Analytics 4)</td>
                <td>2 years</td>
                <td>Google</td>
              </tr>
              <tr>
                <td><code>_ga_*</code></td>
                <td>Maintains session state (Google Analytics 4)</td>
                <td>2 years</td>
                <td>Google</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Third-Party Cookies</h2>
          <p>Some third-party services we use may set their own cookies:</p>
          <ul>
            <li>
              <strong>Stripe</strong> — payment processing cookies for secure transaction handling.
              See{" "}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                Stripe&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Google Analytics</strong> — usage analytics (only after consent).
              See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy Policy
              </a>
              .
            </li>
          </ul>

          <h2>5. Managing Your Preferences</h2>
          <p>You can update your cookie preferences at any time:</p>
          <ul>
            <li>
              <strong>In-app:</strong>{" "}
              Click <strong>&quot;Manage Cookies&quot;</strong> in the website footer or in your
              account Settings under Privacy &amp; Data Rights.
            </li>
            <li>
              <strong>Browser settings:</strong> Most browsers let you block or delete cookies via
              their privacy settings. Note that blocking essential cookies will prevent you from
              signing in.
              <ul>
                <li>Chrome → Settings → Privacy and Security → Cookies</li>
                <li>Firefox → Settings → Privacy &amp; Security → Cookies</li>
                <li>Safari → Preferences → Privacy → Manage Website Data</li>
                <li>Edge → Settings → Cookies and Site Permissions</li>
              </ul>
            </li>
          </ul>

          <h2>6. Do Not Track</h2>
          <p>
            We honour your cookie preferences as set through our consent banner. We do not
            separately process browser-level &quot;Do Not Track&quot; signals as there is no
            legally recognised standard for them. Our consent mechanism gives you equivalent control.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy as our platform evolves or as laws change. Material
            changes will be communicated via the Service or by email. The revision date at the top
            of this page reflects when the policy was last changed.
          </p>

          <h2>8. Contact</h2>
          <p>
            For questions about our use of cookies or to exercise your data rights, contact us at:{" "}
            <a href="mailto:support@townshub.com">support@townshub.com</a>
          </p>

          <p>
            See also our <Link href="/privacy">Privacy Policy</Link> and{" "}
            <Link href="/terms">Terms of Service</Link>.
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

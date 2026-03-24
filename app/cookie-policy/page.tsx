import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy - UGC Studio",
  description: "UGC Studio cookie policy. Learn how we use cookies and similar technologies.",
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
          <p className="text-muted-foreground">Last updated: February 18, 2026</p>

          <p>
            This Cookie Policy explains how UGC Studio (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) uses cookies and similar technologies when you visit our platform.
          </p>

          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help
            the website remember your preferences and improve your experience. Cookies can be
            &quot;session&quot; (deleted when you close your browser) or &quot;persistent&quot;
            (remaining until they expire or you delete them).
          </p>

          <h2>2. Cookies We Use</h2>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are required for the platform to function. They cannot be disabled.
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
                <td>PKCE authentication flow</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>

          <h3>Functional Cookies</h3>
          <p>
            These cookies remember your preferences and choices to provide a more personalized experience.
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
                <td>Remembers light/dark mode preference</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td><code>sidebar-collapsed</code></td>
                <td>Remembers dashboard sidebar state</td>
                <td>30 days</td>
              </tr>
            </tbody>
          </table>

          <h3>Analytics Cookies</h3>
          <p>
            We may use analytics cookies to understand how visitors interact with our platform.
            These help us improve the user experience.
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
                <td><code>_vercel_insights</code></td>
                <td>Vercel Web Analytics (anonymous usage data)</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Third-Party Cookies</h2>
          <p>Our platform integrates with third-party services that may set their own cookies:</p>
          <ul>
            <li><strong>Stripe:</strong> Payment processing cookies for secure transactions</li>
            <li><strong>Vercel:</strong> Deployment and analytics cookies</li>
          </ul>
          <p>
            We do not control third-party cookies. Please refer to their respective privacy policies
            for more information.
          </p>

          <h2>4. Managing Cookies</h2>
          <p>You can control cookies through your browser settings:</p>
          <ul>
            <li><strong>Chrome:</strong> Settings &rarr; Privacy and Security &rarr; Cookies</li>
            <li><strong>Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Cookies</li>
            <li><strong>Safari:</strong> Preferences &rarr; Privacy &rarr; Manage Website Data</li>
            <li><strong>Edge:</strong> Settings &rarr; Cookies and Site Permissions</li>
          </ul>
          <p>
            Please note that disabling essential cookies will prevent you from using the platform,
            as they are required for authentication and core functionality.
          </p>

          <h2>5. Do Not Track</h2>
          <p>
            We currently do not respond to &quot;Do Not Track&quot; browser signals, as there is no
            industry-standard approach. We limit data collection to what is necessary for the
            platform to function.
          </p>

          <h2>6. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy as our platform evolves. Changes will be posted on
            this page with an updated revision date.
          </p>

          <h2>7. Contact</h2>
          <p>
            For questions about our use of cookies, contact us at:<br />
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
          <p>&copy; {new Date().getFullYear()} UGC Studio. All rights reserved.</p>
          <p>Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a></p>
        </div>
      </footer>
    </div>
  )
}

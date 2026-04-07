"use client"

import { useState } from "react"
import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button"
import { LegalLangSwitcher, type LegalLang } from "@/components/shared/legal-lang-switcher"

const content: Record<LegalLang, React.ReactNode> = {
  en: (
    <>
      <h1>Cookie Policy</h1>
      <p className="text-muted-foreground">Last updated: March 27, 2026</p>
      <p>
        This Cookie Policy explains how Townshub Limited (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
        uses cookies and similar technologies when you visit the Townshub UGC Studio platform
        (&quot;Service&quot;). By using the Service you agree to the use of cookies as described in this policy.
      </p>
      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files placed on your device by websites you visit. They allow the website to
        remember your actions and preferences over time. Cookies can be &quot;session&quot; cookies (deleted
        when you close your browser) or &quot;persistent&quot; cookies (remaining until they expire or you
        delete them).
      </p>
      <h2>2. Your Consent</h2>
      <p>We use a consent banner when you first visit Townshub. You can choose to:</p>
      <ul>
        <li><strong>Accept All</strong> — enable all cookie categories including analytics and AI processing</li>
        <li><strong>Reject All</strong> — restrict cookies to essential only</li>
        <li><strong>Manage Preferences</strong> — choose exactly which categories to allow</li>
        <li><strong>Withdraw All Consent</strong> — disable all optional cookies and AI processing at once</li>
      </ul>
      <p>
        Your preference is saved in your browser&apos;s local storage under the key{" "}
        <code>townshub-cookie-consent</code>. You can change your preferences at any time using the
        &quot;Manage Cookies&quot; link in the footer or your account settings.
      </p>
      <p>
        We use <strong>Google Analytics Consent Mode v2</strong>, which means analytics cookies are blocked
        by default until you grant consent.
      </p>
      <h2>3. Cookies We Use</h2>
      <h3>Essential Cookies (always active)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td><code>sb-*-auth-token</code></td><td>Authentication session (Supabase)</td><td>7 days</td></tr>
          <tr><td><code>sb-*-auth-token-code-verifier</code></td><td>PKCE OAuth flow security</td><td>Session</td></tr>
          <tr><td><code>user-role</code></td><td>Stores your account role (brand / creator)</td><td>Session</td></tr>
          <tr><td><code>townshub-cookie-consent</code></td><td>Remembers your cookie preference</td><td>1 year</td></tr>
        </tbody>
      </table>
      <h3>Functional Cookies (optional)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td><code>theme</code></td><td>Remembers light / dark mode preference</td><td>1 year</td></tr>
          <tr><td><code>sidebar-collapsed</code></td><td>Remembers dashboard sidebar state</td><td>30 days</td></tr>
        </tbody>
      </table>
      <h3>Analytics Cookies (optional, consent required)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th><th>Provider</th></tr></thead>
        <tbody>
          <tr><td><code>_ga</code></td><td>Distinguishes unique visitors (Google Analytics 4)</td><td>2 years</td><td>Google</td></tr>
          <tr><td><code>_ga_*</code></td><td>Maintains session state (Google Analytics 4)</td><td>2 years</td><td>Google</td></tr>
        </tbody>
      </table>
      <h3>AI Processing (optional, consent required)</h3>
      <p>
        When you opt in to AI processing, profile and content data is sent to OpenAI for creator-campaign
        matching and quality scoring. No cookies are set for this — consent is stored in{" "}
        <code>townshub-cookie-consent</code> alongside other preferences.
      </p>
      <h2>4. Third-Party Cookies</h2>
      <ul>
        <li><strong>Stripe</strong> — payment processing cookies. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.</li>
        <li><strong>Google Analytics</strong> — usage analytics (only after consent). See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>.</li>
      </ul>
      <h2>5. Managing Your Preferences</h2>
      <ul>
        <li><strong>In-app:</strong> Click &quot;Manage Cookies&quot; in the footer or go to account Settings → Privacy &amp; Data Rights.</li>
        <li><strong>Browser settings:</strong>
          <ul>
            <li>Chrome → Settings → Privacy and Security → Cookies</li>
            <li>Firefox → Settings → Privacy &amp; Security → Cookies</li>
            <li>Safari → Preferences → Privacy → Manage Website Data</li>
            <li>Edge → Settings → Cookies and Site Permissions</li>
          </ul>
        </li>
      </ul>
      <h2>6. Do Not Track</h2>
      <p>We honour your cookie preferences as set through our consent banner. Our consent mechanism gives you equivalent control to Do Not Track signals.</p>
      <h2>7. Changes to This Policy</h2>
      <p>Material changes will be communicated via the Service or by email. The revision date at the top reflects when the policy was last changed.</p>
      <h2>8. Contact</h2>
      <p>For questions, contact us at: <a href="mailto:support@townshub.com">support@townshub.com</a></p>
      <p>See also our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.</p>
    </>
  ),
  de: (
    <>
      <h1>Cookie-Richtlinie</h1>
      <p className="text-muted-foreground">Zuletzt aktualisiert: 27. März 2026</p>
      <p>
        Diese Cookie-Richtlinie erläutert, wie Townshub Limited Cookies und ähnliche Technologien verwendet,
        wenn Sie die Townshub UGC Studio-Plattform besuchen.
      </p>
      <h2>1. Was sind Cookies?</h2>
      <p>
        Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden.
        Sie können &quot;Sitzungscookies&quot; (werden beim Schließen des Browsers gelöscht) oder
        &quot;persistente Cookies&quot; (bleiben bis zum Ablaufdatum oder zur manuellen Löschung) sein.
      </p>
      <h2>2. Ihre Einwilligung</h2>
      <p>Beim ersten Besuch zeigen wir ein Einwilligungsbanner. Sie können wählen:</p>
      <ul>
        <li><strong>Alle akzeptieren</strong> — alle Cookie-Kategorien aktivieren</li>
        <li><strong>Alle ablehnen</strong> — nur essenzielle Cookies zulassen</li>
        <li><strong>Einstellungen verwalten</strong> — genau auswählen, welche Kategorien erlaubt sind</li>
        <li><strong>Alle Einwilligungen widerrufen</strong> — alle optionalen Cookies und KI-Verarbeitung auf einmal deaktivieren</li>
      </ul>
      <h2>3. Von uns verwendete Cookies</h2>
      <h3>Essenzielle Cookies (immer aktiv)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Zweck</th><th>Dauer</th></tr></thead>
        <tbody>
          <tr><td><code>sb-*-auth-token</code></td><td>Authentifizierungs-Session (Supabase)</td><td>7 Tage</td></tr>
          <tr><td><code>user-role</code></td><td>Speichert Ihre Kontorolle (Marke / Creator)</td><td>Session</td></tr>
          <tr><td><code>townshub-cookie-consent</code></td><td>Merkt sich Ihre Cookie-Präferenz</td><td>1 Jahr</td></tr>
        </tbody>
      </table>
      <h3>Funktionale Cookies (optional)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Zweck</th><th>Dauer</th></tr></thead>
        <tbody>
          <tr><td><code>theme</code></td><td>Speichert Hell-/Dunkel-Modus-Präferenz</td><td>1 Jahr</td></tr>
          <tr><td><code>sidebar-collapsed</code></td><td>Speichert Sidebar-Status</td><td>30 Tage</td></tr>
        </tbody>
      </table>
      <h3>Analyse-Cookies (optional, Einwilligung erforderlich)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Zweck</th><th>Dauer</th><th>Anbieter</th></tr></thead>
        <tbody>
          <tr><td><code>_ga</code></td><td>Unterscheidet eindeutige Besucher (GA4)</td><td>2 Jahre</td><td>Google</td></tr>
          <tr><td><code>_ga_*</code></td><td>Hält Session-Status aufrecht (GA4)</td><td>2 Jahre</td><td>Google</td></tr>
        </tbody>
      </table>
      <h2>4. Cookies Dritter</h2>
      <ul>
        <li><strong>Stripe</strong> — Zahlungsverarbeitungs-Cookies. Siehe <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripes Datenschutzrichtlinie</a>.</li>
        <li><strong>Google Analytics</strong> — Nutzungsanalyse (nur nach Einwilligung). Siehe <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Googles Datenschutzrichtlinie</a>.</li>
      </ul>
      <h2>5. Einstellungen verwalten</h2>
      <p>Klicken Sie auf &quot;Cookies verwalten&quot; in der Fußzeile oder gehen Sie zu Kontoeinstellungen → Datenschutz &amp; Datenschutzrechte.</p>
      <h2>6. Änderungen dieser Richtlinie</h2>
      <p>Wesentliche Änderungen werden über den Dienst oder per E-Mail mitgeteilt.</p>
      <h2>7. Kontakt</h2>
      <p>Bei Fragen kontaktieren Sie uns unter: <a href="mailto:support@townshub.com">support@townshub.com</a></p>
    </>
  ),
  fr: (
    <>
      <h1>Politique en matière de cookies</h1>
      <p className="text-muted-foreground">Dernière mise à jour : 27 mars 2026</p>
      <p>
        Cette Politique en matière de cookies explique comment Townshub Limited utilise les cookies et
        technologies similaires lorsque vous visitez la plateforme Townshub UGC Studio.
      </p>
      <h2>1. Que sont les cookies ?</h2>
      <p>
        Les cookies sont de petits fichiers texte placés sur votre appareil par les sites web que vous
        visitez. Ils peuvent être des cookies de &quot;session&quot; (supprimés à la fermeture du
        navigateur) ou &quot;persistants&quot; (conservés jusqu&apos;à leur expiration ou suppression).
      </p>
      <h2>2. Votre consentement</h2>
      <p>Nous affichons une bannière de consentement lors de votre première visite. Vous pouvez :</p>
      <ul>
        <li><strong>Tout accepter</strong> — activer toutes les catégories de cookies</li>
        <li><strong>Tout refuser</strong> — limiter les cookies aux essentiels uniquement</li>
        <li><strong>Gérer les préférences</strong> — choisir exactement les catégories autorisées</li>
        <li><strong>Retirer tout consentement</strong> — désactiver tous les cookies optionnels et le traitement IA en une seule fois</li>
      </ul>
      <h2>3. Cookies que nous utilisons</h2>
      <h3>Cookies essentiels (toujours actifs)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Objectif</th><th>Durée</th></tr></thead>
        <tbody>
          <tr><td><code>sb-*-auth-token</code></td><td>Session d&apos;authentification (Supabase)</td><td>7 jours</td></tr>
          <tr><td><code>user-role</code></td><td>Stocke votre rôle (marque / créateur)</td><td>Session</td></tr>
          <tr><td><code>townshub-cookie-consent</code></td><td>Mémorise votre préférence de cookies</td><td>1 an</td></tr>
        </tbody>
      </table>
      <h3>Cookies fonctionnels (optionnels)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Objectif</th><th>Durée</th></tr></thead>
        <tbody>
          <tr><td><code>theme</code></td><td>Mémorise la préférence clair/sombre</td><td>1 an</td></tr>
          <tr><td><code>sidebar-collapsed</code></td><td>Mémorise l&apos;état de la barre latérale</td><td>30 jours</td></tr>
        </tbody>
      </table>
      <h3>Cookies analytiques (optionnels, consentement requis)</h3>
      <table>
        <thead><tr><th>Cookie</th><th>Objectif</th><th>Durée</th><th>Fournisseur</th></tr></thead>
        <tbody>
          <tr><td><code>_ga</code></td><td>Distingue les visiteurs uniques (GA4)</td><td>2 ans</td><td>Google</td></tr>
          <tr><td><code>_ga_*</code></td><td>Maintient l&apos;état de session (GA4)</td><td>2 ans</td><td>Google</td></tr>
        </tbody>
      </table>
      <h2>4. Cookies tiers</h2>
      <ul>
        <li><strong>Stripe</strong> — cookies de traitement des paiements. Voir <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">la politique de confidentialité de Stripe</a>.</li>
        <li><strong>Google Analytics</strong> — analyses d&apos;utilisation (uniquement après consentement). Voir <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">la politique de confidentialité de Google</a>.</li>
      </ul>
      <h2>5. Gérer vos préférences</h2>
      <p>Cliquez sur &quot;Gérer les cookies&quot; dans le pied de page ou accédez aux paramètres du compte → Confidentialité &amp; Droits sur les données.</p>
      <h2>6. Modifications de cette politique</h2>
      <p>Les modifications importantes seront communiquées via le Service ou par e-mail.</p>
      <h2>7. Contact</h2>
      <p>Pour toute question, contactez-nous à : <a href="mailto:support@townshub.com">support@townshub.com</a></p>
      <p>Voir aussi notre <Link href="/privacy">Politique de confidentialité</Link> et nos <Link href="/terms">Conditions d&apos;utilisation</Link>.</p>
    </>
  ),
}

export function CookiePolicyContent() {
  const [lang, setLang] = useState<LegalLang>("en")

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/"><LogoHorizontal /></Link>
          <div className="flex items-center gap-3">
            <LegalLangSwitcher lang={lang} onChange={setLang} />
            <Link href="/login" className="text-sm font-medium hover:text-primary">Log In</Link>
            <Link href="/signup" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <article className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
          {content[lang]}
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

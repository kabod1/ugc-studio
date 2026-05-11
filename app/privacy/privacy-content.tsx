"use client"

import { useState } from "react"
import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button"
import { LegalLangSwitcher, type LegalLang } from "@/components/shared/legal-lang-switcher"

const content: Record<LegalLang, React.ReactNode> = {
  en: (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: February 18, 2026</p>
      <p>
        Townshub Limited (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Townshub UGC Studio
        platform (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose,
        and safeguard your information when you use our Service.
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
      <p>We store content submissions including videos, images, and associated metadata that you upload to the platform.</p>
      <h3>Usage Data</h3>
      <p>We automatically collect information about how you interact with the Service, including pages visited, features used, browser type, IP address, and device information.</p>
      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Process transactions and send payment notifications</li>
        <li>Match creators with brand campaigns using AI-powered algorithms (with your consent)</li>
        <li>Score content quality using automated analysis (with your consent)</li>
        <li>Verify creator age and identity</li>
        <li>Send you updates, marketing communications, and support messages (where opted in)</li>
        <li>Comply with legal obligations (tax reporting, GDPR requests)</li>
      </ul>
      <h2>3. AI-Powered Features</h2>
      <p>Our platform uses AI to power creator-campaign matching and content quality scoring. These features require your explicit consent via the AI Processing preference in your account settings.</p>
      <ul>
        <li>Creator profile data and campaign briefs are sent to OpenAI for analysis</li>
        <li>Content submissions may be analyzed for quality scoring</li>
        <li>We do not use your data to train third-party AI models</li>
        <li>AI-generated scores are advisory, not guaranteed</li>
      </ul>
      <h2>4. How We Share Your Information</h2>
      <ul>
        <li><strong>With other users:</strong> Creator profiles are visible to brands; brand campaigns are visible to creators browsing campaigns.</li>
        <li><strong>Payment processors:</strong> Stripe processes all payments and receives necessary transaction data.</li>
        <li><strong>AI service providers:</strong> OpenAI processes data for matching and scoring (consent required).</li>
        <li><strong>Legal compliance:</strong> When required by law, court order, or governmental authority.</li>
      </ul>
      <p>See our <Link href="/privacy/subprocessors">Data Subprocessors</Link> page for the full list.</p>
      <h2>5. Data Retention</h2>
      <p>We retain your personal information for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data at any time.</p>
      <h2>6. Data Security</h2>
      <p>We implement industry-standard security measures including encrypted connections (TLS), secure password hashing, and role-based access controls. Payment data is handled entirely by Stripe and never stored on our servers.</p>
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
      <p>
        To exercise these rights, contact us at <a href="mailto:support@townshub.com">support@townshub.com</a> or use the self-service tools in your account settings.
        All disputes are governed by Cyprus law and subject to the courts of Cyprus.
      </p>
      <h2>8. Cookies</h2>
      <p>We use cookies and similar technologies to maintain sessions, remember preferences, and analyze platform usage. See our <Link href="/cookie-policy">Cookie Policy</Link> for details.</p>
      <h2>9. Children&apos;s Privacy</h2>
      <p>The Service is not intended for users under 18 years of age. We require age verification for all creator accounts and do not knowingly collect data from minors.</p>
      <h2>10. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the Service. Your continued use after changes constitutes acceptance.</p>
      <h2>11. Contact Us</h2>
      <p>For questions about this Privacy Policy, contact us at:<br /><a href="mailto:support@townshub.com">support@townshub.com</a></p>
    </>
  ),
  de: (
    <>
      <h1>Datenschutzerklärung</h1>
      <p className="text-muted-foreground">Zuletzt aktualisiert: 18. Februar 2026</p>
      <p>
        Townshub Limited (&quot;wir&quot; oder &quot;uns&quot;) betreibt die Townshub UGC Studio-Plattform
        (der &quot;Dienst&quot;). Diese Datenschutzerklärung erläutert, wie wir Ihre Informationen
        erfassen, verwenden, offenlegen und schützen.
      </p>
      <h2>1. Erhobene Daten</h2>
      <h3>Persönliche Informationen</h3>
      <ul>
        <li>Name, E-Mail-Adresse und Passwort</li>
        <li>Firmenname und Website (für Markenkonten)</li>
        <li>Geburtsdatum (zur Altersverifizierung für Creator)</li>
        <li>Social-Media-Handles und Follower-Zahlen</li>
        <li>Steuerformulartyp (W-9, W-8BEN, EU-USt-ID)</li>
        <li>Zahlungsinformationen (sicher über Stripe verarbeitet)</li>
      </ul>
      <h2>2. Verwendung Ihrer Daten</h2>
      <ul>
        <li>Bereitstellung, Wartung und Verbesserung des Dienstes</li>
        <li>Zahlungsabwicklung und Benachrichtigungen</li>
        <li>KI-gestützte Creator-Kampagnen-Zuordnung (mit Ihrer Einwilligung)</li>
        <li>Alters- und Identitätsverifizierung</li>
        <li>Marketing-Kommunikation (sofern eingewilligt)</li>
        <li>Erfüllung gesetzlicher Pflichten</li>
      </ul>
      <h2>3. KI-gestützte Funktionen</h2>
      <p>Unsere Plattform nutzt KI für Creator-Matching und Content-Qualitätsbewertung. Diese Funktionen erfordern Ihre ausdrückliche Einwilligung über die KI-Verarbeitungseinstellung in Ihrem Konto.</p>
      <ul>
        <li>Wir verwenden Ihre Daten nicht zum Training von KI-Modellen Dritter</li>
        <li>KI-generierte Ergebnisse sind beratend, keine Garantien</li>
      </ul>
      <h2>4. Weitergabe Ihrer Daten</h2>
      <ul>
        <li><strong>An andere Nutzer:</strong> Creator-Profile sind für Marken sichtbar; Markenkampagnen sind für Creator sichtbar.</li>
        <li><strong>Zahlungsanbieter:</strong> Stripe verarbeitet alle Zahlungen.</li>
        <li><strong>KI-Dienstanbieter:</strong> OpenAI verarbeitet Daten für Matching (Einwilligung erforderlich).</li>
      </ul>
      <p>Unsere vollständige Liste der Unterauftragsverarbeiter finden Sie auf unserer <Link href="/privacy/subprocessors">Unterauftragsverarbeiter-Seite</Link>.</p>
      <h2>5. Datenspeicherung</h2>
      <p>Wir speichern Ihre persönlichen Daten, solange Ihr Konto aktiv ist. Sie können jederzeit die Löschung Ihres Kontos beantragen.</p>
      <h2>6. Datensicherheit</h2>
      <p>Wir implementieren branchenübliche Sicherheitsmaßnahmen einschließlich verschlüsselter Verbindungen (TLS), sicherem Passwort-Hashing und rollenbasierter Zugangskontrolle.</p>
      <h2>7. Ihre Rechte (DSGVO)</h2>
      <p>Im Europäischen Wirtschaftsraum haben Sie das Recht auf:</p>
      <ul>
        <li>Auskunft über Ihre gespeicherten Daten</li>
        <li>Berichtigung unrichtiger Daten</li>
        <li>Löschung Ihrer Daten</li>
        <li>Widerspruch gegen die Verarbeitung</li>
        <li>Datenportabilität</li>
        <li>Widerruf der Einwilligung jederzeit</li>
      </ul>
      <p>Um diese Rechte auszuüben, kontaktieren Sie uns unter <a href="mailto:support@townshub.com">support@townshub.com</a>. Alle Streitigkeiten unterliegen dem Recht Zyperns.</p>
      <h2>8. Cookies</h2>
      <p>Wir verwenden Cookies für Sessions, Einstellungen und Analysen. Details finden Sie in unserer <Link href="/cookie-policy">Cookie-Richtlinie</Link>.</p>
      <h2>9. Datenschutz von Minderjährigen</h2>
      <p>Der Dienst richtet sich nicht an Personen unter 18 Jahren. Wir fordern eine Altersverifizierung für alle Creator-Konten.</p>
      <h2>10. Änderungen dieser Richtlinie</h2>
      <p>Wir informieren Sie über wesentliche Änderungen per E-Mail mindestens 30 Tage im Voraus.</p>
      <h2>11. Kontakt</h2>
      <p>Bei Fragen zu dieser Datenschutzerklärung kontaktieren Sie uns unter:<br /><a href="mailto:support@townshub.com">support@townshub.com</a></p>
    </>
  ),
  fr: (
    <>
      <h1>Politique de confidentialité</h1>
      <p className="text-muted-foreground">Dernière mise à jour : 18 février 2026</p>
      <p>
        Townshub Limited (&quot;nous&quot;) exploite la plateforme Townshub UGC Studio (le
        &quot;Service&quot;). Cette Politique de confidentialité explique comment nous collectons,
        utilisons, divulguons et protégeons vos informations.
      </p>
      <h2>1. Informations collectées</h2>
      <h3>Informations personnelles</h3>
      <ul>
        <li>Nom, adresse e-mail et mot de passe</li>
        <li>Nom de l&apos;entreprise et site web (pour les comptes marques)</li>
        <li>Date de naissance (pour la vérification de l&apos;âge des créateurs)</li>
        <li>Pseudonymes de réseaux sociaux et nombre d&apos;abonnés</li>
        <li>Type de formulaire fiscal (W-9, W-8BEN, numéro de TVA UE)</li>
        <li>Informations de paiement (traitées de manière sécurisée via Stripe)</li>
      </ul>
      <h2>2. Utilisation de vos informations</h2>
      <ul>
        <li>Fournir, maintenir et améliorer le Service</li>
        <li>Traiter les transactions et envoyer des notifications de paiement</li>
        <li>Associer les créateurs aux campagnes de marques via l&apos;IA (avec votre consentement)</li>
        <li>Vérifier l&apos;âge et l&apos;identité des créateurs</li>
        <li>Envoyer des communications marketing (si consentement donné)</li>
        <li>Respecter les obligations légales</li>
      </ul>
      <h2>3. Fonctionnalités alimentées par IA</h2>
      <p>Notre plateforme utilise l&apos;IA pour la mise en correspondance créateurs-campagnes et la notation de la qualité du contenu. Ces fonctionnalités nécessitent votre consentement explicite.</p>
      <ul>
        <li>Nous n&apos;utilisons pas vos données pour entraîner des modèles d&apos;IA tiers</li>
        <li>Les résultats générés par IA sont consultatifs, non garantis</li>
      </ul>
      <h2>4. Partage de vos informations</h2>
      <ul>
        <li><strong>Avec d&apos;autres utilisateurs :</strong> Les profils de créateurs sont visibles par les marques ; les campagnes de marques sont visibles par les créateurs.</li>
        <li><strong>Processeurs de paiement :</strong> Stripe traite tous les paiements.</li>
        <li><strong>Fournisseurs d&apos;IA :</strong> OpenAI traite les données pour la mise en correspondance (consentement requis).</li>
      </ul>
      <p>Consultez notre page <Link href="/privacy/subprocessors">Sous-traitants</Link> pour la liste complète.</p>
      <h2>5. Conservation des données</h2>
      <p>Nous conservons vos informations personnelles aussi longtemps que votre compte est actif. Vous pouvez demander la suppression de votre compte à tout moment.</p>
      <h2>6. Sécurité des données</h2>
      <p>Nous mettons en œuvre des mesures de sécurité standard incluant des connexions chiffrées (TLS), le hachage sécurisé des mots de passe et des contrôles d&apos;accès basés sur les rôles.</p>
      <h2>7. Vos droits (RGPD)</h2>
      <p>Si vous êtes dans l&apos;Espace économique européen, vous avez le droit de :</p>
      <ul>
        <li>Accéder aux données personnelles que nous détenons sur vous</li>
        <li>Demander la correction de données inexactes</li>
        <li>Demander la suppression de vos données</li>
        <li>Vous opposer au traitement de vos données</li>
        <li>Demander la portabilité des données</li>
        <li>Retirer votre consentement à tout moment</li>
      </ul>
      <p>Pour exercer ces droits, contactez-nous à <a href="mailto:support@townshub.com">support@townshub.com</a>. Tous les litiges sont régis par le droit chypriote.</p>
      <h2>8. Cookies</h2>
      <p>Nous utilisons des cookies pour maintenir les sessions, mémoriser les préférences et analyser l&apos;utilisation de la plateforme. Consultez notre <Link href="/cookie-policy">Politique de cookies</Link> pour plus de détails.</p>
      <h2>9. Confidentialité des mineurs</h2>
      <p>Le Service n&apos;est pas destiné aux personnes de moins de 18 ans. Nous exigeons une vérification d&apos;âge pour tous les comptes créateurs.</p>
      <h2>10. Modifications de cette politique</h2>
      <p>Nous vous informerons des modifications importantes par e-mail au moins 30 jours avant leur entrée en vigueur.</p>
      <h2>11. Nous contacter</h2>
      <p>Pour toute question, contactez-nous à :<br /><a href="mailto:support@townshub.com">support@townshub.com</a></p>
    </>
  ),
}

export function PrivacyContent() {
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

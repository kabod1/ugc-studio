"use client"

import { useState } from "react"
import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button"
import { LegalLangSwitcher, type LegalLang } from "@/components/shared/legal-lang-switcher"

const content: Record<LegalLang, React.ReactNode> = {
  en: (
    <>
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: February 18, 2026</p>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Townshub
        UGC Studio platform (the &quot;Service&quot;), operated by Townshub Limited (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;). By using the Service, you agree to these Terms.
      </p>
      <h2>1. Account Registration</h2>
      <p>To use the Service, you must:</p>
      <ul>
        <li>Be at least 18 years old</li>
        <li>Provide accurate and complete registration information</li>
        <li>Maintain the security of your account credentials</li>
        <li>Notify us immediately of any unauthorized access</li>
      </ul>
      <p>You are responsible for all activity under your account. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
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
      <h2>3. Subscriptions &amp; Payments</h2>
      <p>The Service offers free and paid subscription tiers. Paid subscriptions are billed monthly or annually in EUR through Stripe. By subscribing, you authorize recurring charges.</p>
      <ul>
        <li>You may cancel your subscription at any time through the billing settings</li>
        <li>Cancellation takes effect at the end of the current billing period</li>
        <li>We do not provide refunds for partial billing periods</li>
        <li>We reserve the right to change pricing with 30 days notice</li>
      </ul>
      <h2>4. Platform Fees</h2>
      <p>UGC Studio charges a 15% platform fee on all payments processed through the Service. This fee is deducted from the payment amount before the creator payout.</p>
      <h2>5. Escrow Payments</h2>
      <p>When a brand initiates a payment, funds are held in escrow until the brand approves the creator&apos;s content. Upon approval, funds are released to the creator&apos;s Stripe Connect account.</p>
      <ul>
        <li>Brands are protected from paying for undelivered or substandard content</li>
        <li>Creators are protected by guaranteed payment upon content approval</li>
        <li>Disputes are handled through our support team</li>
      </ul>
      <h2>6. Content &amp; Intellectual Property</h2>
      <ul>
        <li>Creators retain ownership of their original content until usage rights are transferred via contract</li>
        <li>Upon contract execution, usage rights are transferred as specified (exclusive, non-exclusive, limited, or perpetual)</li>
        <li>Brands may use approved content only within the scope of the agreed usage rights, territories, and duration</li>
        <li>You may not upload content that infringes on third-party intellectual property</li>
      </ul>
      <h2>7. AI-Powered Features</h2>
      <p>The Service uses AI (GPT-4o) for creator matching and content quality scoring. AI-generated results are advisory and do not constitute guarantees of creator performance or content quality.</p>
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
      <p>To the maximum extent permitted by law, UGC Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the fees you paid in the 12 months preceding the claim.</p>
      <h2>10. Dispute Resolution</h2>
      <p>Any disputes arising from these Terms shall be resolved through good-faith negotiation. If unresolved, disputes shall be subject to the courts of Cyprus, and Cyprus law shall govern these Terms.</p>
      <h2>11. Changes to These Terms</h2>
      <p>We may update these Terms from time to time. We will notify you of material changes via email or through the Service at least 30 days before they take effect. Continued use after changes constitutes acceptance.</p>
      <h2>12. Contact</h2>
      <p>For questions about these Terms, contact us at:<br /><a href="mailto:support@townshub.com">support@townshub.com</a></p>
    </>
  ),
  de: (
    <>
      <h1>Nutzungsbedingungen</h1>
      <p className="text-muted-foreground">Zuletzt aktualisiert: 18. Februar 2026</p>
      <p>
        Diese Nutzungsbedingungen (&quot;Bedingungen&quot;) regeln Ihren Zugang zu und die Nutzung der
        Townshub UGC Studio-Plattform (der &quot;Dienst&quot;), betrieben von Townshub Limited
        (&quot;wir&quot; oder &quot;uns&quot;). Durch die Nutzung des Dienstes stimmen Sie diesen Bedingungen zu.
      </p>
      <h2>1. Kontoregistrierung</h2>
      <p>Um den Dienst zu nutzen, müssen Sie:</p>
      <ul>
        <li>Mindestens 18 Jahre alt sein</li>
        <li>Genaue und vollständige Registrierungsdaten angeben</li>
        <li>Die Sicherheit Ihrer Kontodaten gewährleisten</li>
        <li>Uns unverzüglich über jeden unbefugten Zugriff informieren</li>
      </ul>
      <p>Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich. Wir behalten uns das Recht vor, Konten, die gegen diese Bedingungen verstoßen, zu sperren oder zu kündigen.</p>
      <h2>2. Plattformdienste</h2>
      <h3>Für Marken</h3>
      <ul>
        <li>UGC-Kampagnen erstellen und verwalten</li>
        <li>Creator durch KI-gestützte Suche finden und zuordnen</li>
        <li>Content-Einreichungen prüfen, genehmigen und verwalten</li>
        <li>Treuhandzahlungen über Stripe Connect abwickeln</li>
        <li>Verträge erstellen und Nutzungsrechte verwalten</li>
      </ul>
      <h3>Für Creator</h3>
      <ul>
        <li>Markenkampagnen durchsuchen und bewerben</li>
        <li>Inhalte mit Versionsverfolgung einreichen</li>
        <li>Sichere Zahlungen über Stripe Connect erhalten</li>
        <li>Verträge und Nutzungsrechte verwalten</li>
      </ul>
      <h2>3. Abonnements &amp; Zahlungen</h2>
      <p>Der Dienst bietet kostenlose und kostenpflichtige Abonnementstufen an. Kostenpflichtige Abonnements werden monatlich oder jährlich in EUR über Stripe abgerechnet.</p>
      <ul>
        <li>Sie können Ihr Abonnement jederzeit über die Abrechnungseinstellungen kündigen</li>
        <li>Die Kündigung tritt am Ende des aktuellen Abrechnungszeitraums in Kraft</li>
        <li>Wir gewähren keine Rückerstattungen für anteilige Abrechnungszeiträume</li>
        <li>Wir behalten uns das Recht vor, Preise mit 30-tägiger Vorankündigung zu ändern</li>
      </ul>
      <h2>4. Plattformgebühren</h2>
      <p>UGC Studio erhebt eine Plattformgebühr von 15 % auf alle über den Dienst abgewickelten Zahlungen.</p>
      <h2>5. Treuhandzahlungen</h2>
      <p>Wenn eine Marke eine Zahlung einleitet, werden die Gelder treuhänderisch gehalten, bis die Marke den Content des Creators genehmigt.</p>
      <h2>6. Inhalte &amp; Geistiges Eigentum</h2>
      <ul>
        <li>Creator behalten das Eigentum an ihren Originalinhalten bis zur Übertragung der Nutzungsrechte per Vertrag</li>
        <li>Nach Vertragsabschluss werden Nutzungsrechte wie angegeben übertragen</li>
        <li>Sie dürfen keine Inhalte hochladen, die geistige Eigentumsrechte Dritter verletzen</li>
      </ul>
      <h2>7. KI-gestützte Funktionen</h2>
      <p>Der Dienst nutzt KI (GPT-4o) für Creator-Matching und Content-Qualitätsbewertung. KI-Ergebnisse sind beratend und stellen keine Garantien dar.</p>
      <h2>8. Verbotene Nutzung</h2>
      <ul>
        <li>Den Dienst für illegale Zwecke nutzen</li>
        <li>Schädliche, beleidigende oder irreführende Inhalte hochladen</li>
        <li>Versuchen, Plattformgebühren zu umgehen</li>
        <li>Gefälschte Konten, Bewertungen oder Engagement-Kennzahlen erstellen</li>
      </ul>
      <h2>9. Haftungsbeschränkung</h2>
      <p>Im gesetzlich zulässigen Umfang haftet UGC Studio nicht für indirekte oder Folgeschäden. Unsere Gesamthaftung übersteigt nicht die Gebühren, die Sie in den 12 Monaten vor dem Anspruch gezahlt haben.</p>
      <h2>10. Streitbeilegung</h2>
      <p>Streitigkeiten aus diesen Bedingungen unterliegen dem Recht Zyperns und sind vor den Gerichten Zyperns zu klären.</p>
      <h2>11. Änderungen dieser Bedingungen</h2>
      <p>Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Wir werden Sie über wesentliche Änderungen mindestens 30 Tage vorher per E-Mail informieren.</p>
      <h2>12. Kontakt</h2>
      <p>Bei Fragen zu diesen Bedingungen kontaktieren Sie uns unter:<br /><a href="mailto:support@townshub.com">support@townshub.com</a></p>
    </>
  ),
  fr: (
    <>
      <h1>Conditions d&apos;utilisation</h1>
      <p className="text-muted-foreground">Dernière mise à jour : 18 février 2026</p>
      <p>
        Les présentes Conditions d&apos;utilisation (&quot;Conditions&quot;) régissent votre accès et votre
        utilisation de la plateforme Townshub UGC Studio (le &quot;Service&quot;), exploitée par
        Townshub Limited (&quot;nous&quot;). En utilisant le Service, vous acceptez ces Conditions.
      </p>
      <h2>1. Inscription au compte</h2>
      <p>Pour utiliser le Service, vous devez :</p>
      <ul>
        <li>Avoir au moins 18 ans</li>
        <li>Fournir des informations d&apos;inscription exactes et complètes</li>
        <li>Maintenir la sécurité de vos identifiants de compte</li>
        <li>Nous notifier immédiatement de tout accès non autorisé</li>
      </ul>
      <p>Vous êtes responsable de toutes les activités effectuées sous votre compte.</p>
      <h2>2. Services de la plateforme</h2>
      <h3>Pour les marques</h3>
      <ul>
        <li>Créer et gérer des campagnes UGC</li>
        <li>Découvrir et associer des créateurs grâce à la recherche alimentée par IA</li>
        <li>Examiner, approuver et gérer les soumissions de contenu</li>
        <li>Traiter les paiements en séquestre via Stripe Connect</li>
      </ul>
      <h3>Pour les créateurs</h3>
      <ul>
        <li>Parcourir et postuler aux campagnes de marques</li>
        <li>Soumettre du contenu avec suivi des versions</li>
        <li>Recevoir des paiements sécurisés via Stripe Connect</li>
      </ul>
      <h2>3. Abonnements &amp; paiements</h2>
      <p>Le Service propose des niveaux d&apos;abonnement gratuits et payants. Les abonnements payants sont facturés mensuellement ou annuellement en EUR via Stripe.</p>
      <ul>
        <li>Vous pouvez annuler votre abonnement à tout moment via les paramètres de facturation</li>
        <li>L&apos;annulation prend effet à la fin de la période de facturation en cours</li>
        <li>Nous ne remboursons pas les périodes de facturation partielles</li>
        <li>Nous nous réservons le droit de modifier les tarifs avec un préavis de 30 jours</li>
      </ul>
      <h2>4. Frais de plateforme</h2>
      <p>UGC Studio prélève des frais de plateforme de 15 % sur tous les paiements traités via le Service.</p>
      <h2>5. Paiements en séquestre</h2>
      <p>Lorsqu&apos;une marque initie un paiement, les fonds sont détenus en séquestre jusqu&apos;à ce que la marque approuve le contenu du créateur.</p>
      <h2>6. Contenu &amp; propriété intellectuelle</h2>
      <ul>
        <li>Les créateurs conservent la propriété de leur contenu original jusqu&apos;au transfert des droits d&apos;utilisation par contrat</li>
        <li>Vous ne pouvez pas télécharger du contenu qui enfreint les droits de propriété intellectuelle de tiers</li>
      </ul>
      <h2>7. Fonctionnalités alimentées par IA</h2>
      <p>Le Service utilise l&apos;IA (GPT-4o) pour la mise en correspondance des créateurs et la notation de la qualité du contenu. Les résultats générés par l&apos;IA sont consultatifs.</p>
      <h2>8. Utilisations interdites</h2>
      <ul>
        <li>Utiliser le Service à des fins illégales</li>
        <li>Télécharger du contenu nuisible, offensant ou trompeur</li>
        <li>Tenter de contourner les frais de plateforme</li>
        <li>Créer de faux comptes, avis ou indicateurs d&apos;engagement</li>
      </ul>
      <h2>9. Limitation de responsabilité</h2>
      <p>Dans toute la mesure permise par la loi, UGC Studio ne sera pas responsable des dommages indirects ou consécutifs. Notre responsabilité totale ne dépassera pas les frais que vous avez payés au cours des 12 mois précédant la réclamation.</p>
      <h2>10. Résolution des litiges</h2>
      <p>Tout litige découlant des présentes Conditions sera soumis aux tribunaux de Chypre, et le droit chypriote régira ces Conditions.</p>
      <h2>11. Modifications des présentes Conditions</h2>
      <p>Nous pouvons mettre à jour ces Conditions périodiquement. Nous vous informerons des modifications importantes au moins 30 jours avant leur entrée en vigueur.</p>
      <h2>12. Contact</h2>
      <p>Pour toute question relative aux présentes Conditions, contactez-nous à :<br /><a href="mailto:support@townshub.com">support@townshub.com</a></p>
    </>
  ),
}

export function TermsContent() {
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

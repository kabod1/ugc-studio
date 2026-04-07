import type { Metadata } from "next"
import Link from "next/link"
import { Check, Sparkles, Crown, Star, ArrowRight } from "lucide-react"
import { PricingToggle } from "./pricing-toggle"
import { LogoHorizontal } from "@/components/shared/logo"

export const metadata: Metadata = {
  title: "Pricing - UGC Studio",
}

const businessTiers = [
  {
    name: "Starter",
    monthlyPrice: "€44",
    annualPrice: "€28",
    period: "/mo",
    description: "For small businesses getting started with UGC.",
    features: [
      "5 campaigns per month",
      "Up to 20 seats per campaign",
      "AI-powered creator search",
      "Advanced search filters",
      "Content approval workflow",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Growth",
    monthlyPrice: "€95",
    annualPrice: "€60",
    period: "/mo",
    description: "For growing businesses scaling their content.",
    features: [
      "10 campaigns per month",
      "Up to 50 seats per campaign",
      "Everything in Starter",
      "Priority support",
      "Analytics dashboard",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    name: "Scale",
    monthlyPrice: "€227",
    annualPrice: "€143",
    period: "/mo",
    description: "For enterprises with unlimited content needs.",
    features: [
      "Unlimited campaigns",
      "Unlimited seats per campaign",
      "Everything in Growth",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    popular: false,
  },
]

const creatorTiers = [
  {
    name: "Free",
    monthlyPrice: "€0",
    annualPrice: "€0",
    period: "",
    description: "Start getting discovered by brands.",
    features: [
      "5 campaign applications per month",
      "Basic creator profile",
      "Standard search ranking",
      "Community support",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: "€24.99",
    annualPrice: "€15.75",
    period: "/mo",
    description: "For serious creators ready to grow.",
    features: [
      "Unlimited campaign applications",
      "Priority search ranking",
      "Verified creator badge",
      "Advanced analytics & insights",
      "Portfolio showcase",
      "Priority support",
      "Early access to campaigns",
    ],
    popular: true,
  },
  {
    name: "Elite",
    monthlyPrice: "€99",
    annualPrice: "€62",
    period: "/mo",
    description: "Maximum visibility and premium perks.",
    features: [
      "Everything in Pro",
      "Featured homepage placement",
      "Custom profile URL",
      "24-hour priority support",
      "Verified elite status",
      "0% platform fee on first €1,000/mo",
    ],
    popular: false,
  },
]

const faqs = [
  {
    question: "Can I start with a free plan?",
    answer:
      "Both businesses and creators can start with our free plan. You'll get access to core features and can upgrade anytime when you're ready to unlock more capabilities.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period, then automatically revert to the free plan.",
  },
  {
    question: "Is there a discount for annual billing?",
    answer:
      "Yes! Annual plans save you approximately 40% compared to monthly billing. Simply toggle to annual pricing above to see the discounted rates.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 7-day money-back guarantee for all premium plans. If you're not satisfied within the first 7 days, contact us for a full refund, no questions asked.",
  },
  {
    question: "What's the difference between Pro and Elite for creators?",
    answer:
      "Pro includes unlimited applications, priority search ranking, and advanced analytics. Elite adds featured homepage placement, verified elite status, custom profile URL, and 24-hour priority support.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, PayPal, and bank transfers. Payments are processed securely through Stripe.",
  },
  {
    question: "How does the platform fee work?",
    answer:
      "UGC Studio charges a small platform fee on each transaction between brands and creators. Higher-tier plans enjoy reduced fees — Scale plan users get the lowest rate, and Elite creators pay 0% on their first €1,000/month in earnings.",
  },
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the end of your current billing cycle.",
  },
  {
    question: "How many team members can I add?",
    answer:
      "The Growth plan includes 3 team seats. The Scale plan offers unlimited team seats. Starter plan users can manage their account with a single seat. Additional seats can be purchased separately on the Growth plan.",
  },
  {
    question: "Who owns the content created through UGC Studio?",
    answer:
      "Content rights are defined in each campaign brief. By default, brands receive full usage rights for approved content. Creators retain portfolio rights unless otherwise specified. The Content Rights Management feature on Growth and Scale plans helps manage licensing terms.",
  },
  {
    question: "What countries and currencies do you support?",
    answer:
      "UGC Studio is available worldwide. We support creators and brands from over 50 countries. Payments are processed in EUR, with automatic currency conversion for international users via Stripe.",
  },
  {
    question: "How does AI-powered creator matching work?",
    answer:
      "Available on Growth and Scale plans, our AI analyzes your campaign brief, target audience, and past performance data to recommend the best-fit creators. It considers factors like content style, engagement rates, audience demographics, and category expertise.",
  },
  {
    question: "Is my data secure on UGC Studio?",
    answer:
      "Absolutely. We use industry-standard encryption, secure cloud infrastructure, and comply with GDPR. All payments are processed through Stripe with PCI DSS compliance. Your data is never shared with third parties.",
  },
  {
    question: "Do creators need a paid plan to get started?",
    answer:
      "No. Creators can join for free, build their profile, and apply to up to 5 campaigns per month. The Creator Pro plan unlocks unlimited applications, priority search ranking, and advanced analytics for creators ready to grow.",
  },
  {
    question: "What happens to my campaigns if I downgrade?",
    answer:
      "Active campaigns will continue running until completion. However, you won't be able to create new campaigns beyond your new plan's limit. We recommend completing or pausing excess campaigns before downgrading.",
  },
]

function TierIcon({ tier }: { tier: string }) {
  if (tier === "Scale" || tier === "Elite") return <Crown className="h-5 w-5 text-primary" />
  if (tier === "Growth" || tier === "Pro") return <Star className="h-5 w-5 text-primary" />
  return <Sparkles className="h-5 w-5 text-primary" />
}

function PricingCard({
  tier,
  annual,
}: {
  tier: (typeof businessTiers)[number]
  annual: boolean
}) {
  const price = annual ? tier.annualPrice : tier.monthlyPrice
  return (
    <div
      className={`bg-card border rounded-xl p-6 relative flex flex-col ${
        tier.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : ""
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
          Most Popular
        </div>
      )}
      <div className="flex items-center gap-2 mb-1">
        <TierIcon tier={tier.name} />
        <h3 className="font-semibold text-lg">{tier.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-muted-foreground">{tier.period}</span>
        {annual && tier.monthlyPrice !== "€0" && (
          <p className="text-xs text-muted-foreground mt-1">billed annually</p>
        )}
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`block text-center px-4 py-2.5 rounded-md text-sm font-medium ${
          tier.popular
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border hover:bg-muted"
        }`}
      >
        Get Started
      </Link>
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/"><LogoHorizontal /></Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-foreground">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-8 px-4 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            No credit card required. Free to get started. Cancel anytime.
          </p>
        </div>
      </section>

      <PricingToggle
        businessTiers={businessTiers}
        creatorTiers={creatorTiers}
        faqs={faqs}
      />

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Scale Your UGC?
          </h2>
          <p className="text-lg opacity-90 mb-2">
            Creators start free &middot; Cancel anytime
          </p>
          <p className="text-sm opacity-70 mb-8">
            Join 500+ brands and 10,000+ creators already using UGC Studio.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-white text-primary font-medium hover:bg-gray-100 text-lg"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4"><LogoHorizontal /></div>
              <p className="text-sm text-muted-foreground">
                The end-to-end UGC production platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-foreground">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} UGC Studio. All rights reserved.</p>
            <p>Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

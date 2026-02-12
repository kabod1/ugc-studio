import type { Metadata } from "next"
import Link from "next/link"
import { Check, Sparkles, Crown, Star, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing - UGC Studio",
}

const brandTiers = [
  {
    name: "Starter",
    price: "$99",
    period: "/mo",
    description: "Perfect for small brands getting started with UGC campaigns.",
    features: [
      "5 campaigns per month",
      "25 creator searches",
      "Basic analytics",
      "Email support",
      "15% platform fee on creator payments",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$199",
    period: "/mo",
    description: "For growing brands that need more power and team collaboration.",
    features: [
      "25 campaigns per month",
      "Unlimited creator searches",
      "AI-powered creator matching",
      "Advanced analytics",
      "Priority support",
      "Team management (3 seats)",
      "15% platform fee on creator payments",
    ],
    popular: true,
  },
  {
    name: "Scale",
    price: "$499",
    period: "/mo",
    description: "For agencies and enterprises running UGC at scale.",
    features: [
      "Unlimited campaigns",
      "Unlimited creator searches",
      "AI video generation",
      "Dedicated account manager",
      "API access",
      "White-label option",
      "Custom integrations",
      "15% platform fee on creator payments",
    ],
    popular: false,
  },
]

const creatorTiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Get started and discover campaigns that match your niche.",
    features: [
      "5 campaign applications per month",
      "Basic creator profile",
      "Standard search ranking",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/mo",
    description: "Stand out from the crowd and land more brand deals.",
    features: [
      "Unlimited campaign applications",
      "Priority search ranking",
      "Verified creator badge",
      "Advanced analytics",
      "Portfolio showcase",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "$49.99",
    period: "/mo",
    description: "Maximum visibility and premium perks for top creators.",
    features: [
      "Everything in Pro",
      "Featured homepage placement",
      "Custom profile URL",
      "Dedicated support",
      "Early access to campaigns",
      "0% platform fee on first $1,000/mo",
    ],
    popular: false,
  },
]

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing cycle. Downgrades take effect at the start of your next billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) through Stripe. For Enterprise plans, we also offer invoice-based billing with net-30 terms.",
  },
  {
    question: "How does the platform fee on creator payments work?",
    answer:
      "When a brand pays a creator through UGC Studio, a 15% platform fee is applied on top of the creator's rate. For example, if a creator charges $500, the brand pays $575. Elite creators enjoy 0% fees on their first $1,000 in monthly earnings.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can explore all features during the trial and only pay when you're ready to commit.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "We'll notify you when you're approaching your limits. You can upgrade at any time to unlock more capacity. We never cut off access mid-campaign -- your active campaigns will continue to run.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, annual billing saves you 20% compared to monthly pricing. Contact our sales team for custom Enterprise pricing and volume discounts for agencies managing multiple brands.",
  },
]

function TierIcon({ tier }: { tier: string }) {
  if (tier === "Scale" || tier === "Elite") return <Crown className="h-5 w-5 text-primary" />
  if (tier === "Growth" || tier === "Pro") return <Star className="h-5 w-5 text-primary" />
  return <Sparkles className="h-5 w-5 text-primary" />
}

function PricingCard({
  tier,
}: {
  tier: (typeof brandTiers)[number]
}) {
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
        <span className="text-4xl font-bold">{tier.price}</span>
        <span className="text-muted-foreground">{tier.period}</span>
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
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">UGC Studio</span>
          </Link>
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
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're a brand looking to scale UGC or a creator ready to grow your career, we have a plan that fits. Start free, upgrade anytime.
          </p>
        </div>
      </section>

      {/* For Brands */}
      <section id="brands" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              For Brands
            </div>
            <h2 className="text-3xl font-bold mb-2">Brand Plans</h2>
            <p className="text-muted-foreground">
              Launch campaigns, discover creators, and scale your UGC production.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brandTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* For Creators */}
      <section id="creators" className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              For Creators
            </div>
            <h2 className="text-3xl font-bold mb-2">Creator Plans</h2>
            <p className="text-muted-foreground">
              Get discovered, land brand deals, and grow your creator business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creatorTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing and plans.
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join 500+ brands and 10,000+ creators already using UGC Studio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-white text-primary font-medium hover:bg-gray-100 text-lg"
            >
              Start Your Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-bold">UGC Studio</span>
              </div>
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
                <li>
                  <a href="#" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UGC Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

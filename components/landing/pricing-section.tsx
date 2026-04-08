"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ChevronDown } from "lucide-react"

const businessTiers = {
  monthly: [
    {
      name: "Starter",
      description: "For small businesses getting started with UGC",
      price: "€44",
      period: "/month",
      features: [
        "5 campaigns per month",
        "Up to 20 seats per campaign",
        "AI-powered creator search",
        "Advanced search filters",
        "Content approval workflow",
        "Email support",
      ],
      recommended: false,
    },
    {
      name: "Growth",
      description: "For growing businesses scaling their content",
      price: "€95",
      period: "/month",
      features: [
        "10 campaigns per month",
        "Up to 50 seats per campaign",
        "Everything in Starter",
        "Priority support",
        "Analytics dashboard",
        "Team collaboration",
      ],
      recommended: true,
    },
    {
      name: "Scale",
      description: "For enterprises with unlimited content needs",
      price: "€227",
      period: "/month",
      features: [
        "Unlimited campaigns",
        "Unlimited seats per campaign",
        "Everything in Growth",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
      ],
      recommended: false,
    },
  ],
  annual: [
    {
      name: "Starter",
      description: "For small businesses getting started with UGC",
      price: "€28",
      period: "/month",
      savings: "Save €192 (36%) with annual billing",
      billedYearly: "Billed €336 per year",
      monthlyPrice: "€44",
      features: [
        "5 campaigns per month",
        "Up to 20 seats per campaign",
        "AI-powered creator search",
        "Advanced search filters",
        "Content approval workflow",
        "Email support",
      ],
      recommended: false,
    },
    {
      name: "Growth",
      description: "For growing businesses scaling their content",
      price: "€60",
      period: "/month",
      savings: "Save €420 (37%) with annual billing",
      billedYearly: "Billed €720 per year",
      monthlyPrice: "€95",
      features: [
        "10 campaigns per month",
        "Up to 50 seats per campaign",
        "Everything in Starter",
        "Priority support",
        "Analytics dashboard",
        "Team collaboration",
      ],
      recommended: true,
    },
    {
      name: "Scale",
      description: "For enterprises with unlimited content needs",
      price: "€143",
      period: "/month",
      savings: "Save €1,008 (37%) with annual billing",
      billedYearly: "Billed €1,716 per year",
      monthlyPrice: "€227",
      features: [
        "Unlimited campaigns",
        "Unlimited seats per campaign",
        "Everything in Growth",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
      ],
      recommended: false,
    },
  ],
}

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

const creatorTiers = {
  monthly: [
    {
      name: "Free",
      description: "Start your creator journey",
      price: "Free",
      period: "",
      features: [
        "Public creator profile",
        "1 seat claim per month",
        "Stripe payouts",
        "Content submission tools",
        "Campaign marketplace access",
      ],
      recommended: false,
    },
    {
      name: "Creator Pro",
      description: "For active creators seeking more opportunities",
      price: "€24.99",
      period: "/month",
      features: [
        "Everything in Free",
        "Unlimited seat claims",
        "Profile badge (Pro)",
        "Priority in search results",
        "Advanced portfolio showcase",
        "Detailed earnings analytics",
        "Email notifications",
      ],
      recommended: true,
    },
  ],
  annual: [
    {
      name: "Free",
      description: "Start your creator journey",
      price: "Free",
      period: "",
      features: [
        "Public creator profile",
        "1 seat claim per month",
        "Stripe payouts",
        "Content submission tools",
        "Campaign marketplace access",
      ],
      recommended: false,
    },
    {
      name: "Creator Pro",
      description: "For active creators seeking more opportunities",
      price: "€15.75",
      period: "/month",
      features: [
        "Everything in Free",
        "Unlimited seat claims",
        "Profile badge (Pro)",
        "Priority in search results",
        "Advanced portfolio showcase",
        "Detailed earnings analytics",
        "Email notifications",
      ],
      recommended: true,
    },
  ],
}

export function PricingSection() {
  const [tab, setTab] = useState<"business" | "creator">("business")
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const tiers = tab === "business"
    ? (annual ? businessTiers.annual : businessTiers.monthly)
    : (annual ? creatorTiers.annual : creatorTiers.monthly)

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground mb-8">
            No credit card required. Free to get started. Cancel anytime.
          </p>

          {/* Business / Creator tabs */}
          <div className="inline-flex items-center rounded-full border p-1 mb-6">
            <button
              onClick={() => setTab("business")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === "business"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              For Businesses
            </button>
            <button
              onClick={() => setTab("creator")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === "creator"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              For Creators
            </button>
          </div>

          {/* Monthly / Annual toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                annual ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  annual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual (Save up to 37%)
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className={`grid grid-cols-1 gap-6 ${
          tiers.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-3"
        }`}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-card border rounded-xl p-6 relative flex flex-col ${
                tier.recommended ? "border-primary shadow-lg ring-2 ring-primary/20" : ""
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Recommended
                </div>
              )}
              <h3 className="font-semibold text-lg">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground ml-1">{tier.period}</span>}
                {annual && "savings" in tier && (
                  <div className="mt-1">
                    <p className="text-xs font-semibold text-green-600">{(tier as any).savings}</p>
                    <p className="text-xs text-muted-foreground">{(tier as any).billedYearly}</p>
                  </div>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  tier.recommended
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border hover:bg-muted"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include secure Stripe payments.{" "}
          <Link href="/pricing" className="text-primary hover:underline">
            View full pricing details
          </Link>
        </p>

        {/* FAQ */}
        <div className="mt-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h3>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="bg-card border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-semibold pr-4">{faq.question}</h4>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === index ? "max-h-96 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-muted-foreground px-5">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

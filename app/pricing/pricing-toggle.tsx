"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles, Crown, Star } from "lucide-react"

function TierIcon({ tier }: { tier: string }) {
  if (tier === "Scale" || tier === "Elite") return <Crown className="h-5 w-5 text-primary" />
  if (tier === "Growth" || tier === "Pro") return <Star className="h-5 w-5 text-primary" />
  return <Sparkles className="h-5 w-5 text-primary" />
}

interface Tier {
  name: string
  monthlyPrice: string
  annualPrice: string
  period: string
  description: string
  features: string[]
  popular: boolean
}

interface FAQ {
  question: string
  answer: string
}

function PricingCard({ tier, annual }: { tier: Tier; annual: boolean }) {
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
          <div className="mt-1">
            <p className="text-xs font-semibold text-green-600">
              Save with annual billing
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="line-through">{tier.monthlyPrice}/mo</span> — billed annually
            </p>
          </div>
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

export function PricingToggle({
  businessTiers,
  creatorTiers,
  faqs,
}: {
  businessTiers: Tier[]
  creatorTiers: Tier[]
  faqs: FAQ[]
}) {
  const [annual, setAnnual] = useState(false)

  return (
    <>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3 py-8 px-4">
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
          Annual (Save up to 40%)
        </span>
      </div>

      {/* For Businesses */}
      <section id="businesses" className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              For Businesses
            </div>
            <h2 className="text-3xl font-bold mb-2">Business Plans</h2>
            <p className="text-muted-foreground">
              Launch campaigns, discover creators, and scale your UGC production.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} annual={annual} />
            ))}
          </div>
        </div>
      </section>

      {/* For Creators */}
      <section id="creators" className="py-12 px-4 bg-muted/30">
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
              <PricingCard key={tier.name} tier={tier} annual={annual} />
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
    </>
  )
}

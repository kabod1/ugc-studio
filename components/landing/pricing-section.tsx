"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

const businessTiers = {
  monthly: [
    {
      name: "Starter",
      description: "For small businesses",
      price: "€79",
      period: "/month",
      features: [
        "1 active campaign",
        "Browse creator marketplace",
        "Basic creator search",
        "Direct messaging",
        "Email support",
      ],
      recommended: false,
    },
    {
      name: "Growth",
      description: "For growing businesses",
      price: "€199",
      period: "/month",
      features: [
        "Everything in Starter",
        "10 active campaigns",
        "AI-powered creator matching",
        "Advanced analytics",
        "Priority support",
        "Team management (3 seats)",
      ],
      recommended: true,
    },
    {
      name: "Scale",
      description: "For enterprises and agencies",
      price: "€399",
      period: "/month",
      features: [
        "Everything in Growth",
        "Unlimited campaigns",
        "Dedicated account manager",
        "API access",
        "White-label option",
        "Custom integrations",
      ],
      recommended: false,
    },
  ],
  annual: [
    {
      name: "Starter",
      description: "For small businesses",
      price: "€47",
      period: "/month",
      features: [
        "1 active campaign",
        "Browse creator marketplace",
        "Basic creator search",
        "Direct messaging",
        "Email support",
      ],
      recommended: false,
    },
    {
      name: "Growth",
      description: "For growing businesses",
      price: "€125",
      period: "/month",
      features: [
        "Everything in Starter",
        "10 active campaigns",
        "AI-powered creator matching",
        "Advanced analytics",
        "Priority support",
        "Team management (3 seats)",
      ],
      recommended: true,
    },
    {
      name: "Scale",
      description: "For enterprises and agencies",
      price: "€239",
      period: "/month",
      features: [
        "Everything in Growth",
        "Unlimited campaigns",
        "Dedicated account manager",
        "API access",
        "White-label option",
        "Custom integrations",
      ],
      recommended: false,
    },
  ],
}

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
      price: "€19.99",
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
      price: "€11.99",
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
              Annual
            </span>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Save up to 40%
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
      </div>
    </section>
  )
}

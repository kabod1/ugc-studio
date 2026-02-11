"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Check, CreditCard, Loader2 } from "lucide-react"

const tiers = [
  { key: "brand", name: "Brand", price: "$199", period: "/month", features: ["5 campaigns", "50 creators", "Basic analytics", "Email support", "Standard matching"] },
  { key: "agency", name: "Agency", price: "$499", period: "/month", features: ["25 campaigns", "Unlimited creators", "Advanced analytics", "Team management", "Priority matching", "API access"], popular: true },
  { key: "enterprise", name: "Enterprise", price: "$1,999", period: "/month", features: ["Unlimited campaigns", "Unlimited creators", "Custom analytics", "Dedicated support", "AI video generation", "White-label option"] },
]

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(tier: string) {
    setLoading(tier)
    try {
      const res = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert("Failed to create checkout session")
    }
    setLoading(null)
  }

  async function handleManage() {
    setLoading("manage")
    try {
      const res = await fetch("/api/subscriptions/manage", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert("Failed to open billing portal")
    }
    setLoading(null)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription plan</p>
        </div>
        <button
          onClick={handleManage}
          disabled={loading === "manage"}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          {loading === "manage" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          Manage Billing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.key} className={`bg-card border rounded-xl p-6 relative ${t.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : ""}`}>
            {t.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                Most Popular
              </div>
            )}
            <h3 className="font-semibold text-lg">{t.name}</h3>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold">{t.price}</span>
              <span className="text-muted-foreground">{t.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(t.key)}
              disabled={loading === t.key}
              className={`w-full text-center px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 ${
                t.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border hover:bg-muted"
              }`}
            >
              {loading === t.key ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

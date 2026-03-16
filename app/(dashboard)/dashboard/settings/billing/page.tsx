"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Check, CreditCard, Loader2, BarChart3 } from "lucide-react"

const tiers = [
  {
    key: "starter",
    name: "Starter",
    price: "€67",
    period: "/month",
    features: [
      "5 campaigns per month",
      "Up to 20 seats per campaign",
      "10 AI UGC videos/month",
      "AI-powered creator search",
      "Content approval workflow",
      "Email support",
    ],
  },
  {
    key: "growth",
    name: "Growth",
    price: "€187",
    period: "/month",
    features: [
      "10 campaigns per month",
      "Up to 50 seats per campaign",
      "50 AI UGC videos/month",
      "Everything in Starter",
      "Analytics dashboard",
      "Team collaboration (3 seats)",
    ],
    popular: true,
  },
  {
    key: "scale",
    name: "Scale",
    price: "€387",
    period: "/month",
    features: [
      "Unlimited campaigns",
      "Unlimited seats per campaign",
      "Unlimited AI UGC videos",
      "Everything in Growth",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
]

interface UsageData {
  currentTier: string
  campaignsUsed: number
  campaignsLimit: number
  seatsUsed: number
  seatsLimit: number
  ugcVideosUsed: number
  ugcVideosLimit: number
}

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: brand } = await supabase
          .from("brands")
          .select("id, subscription_tier")
          .eq("user_id", user.id)
          .single()

        if (!brand) return

        const { count: campaignCount } = await supabase
          .from("campaigns")
          .select("id", { count: "exact", head: true })
          .eq("brand_id", brand.id)
          .in("status", ["active", "draft"])

        const { count: seatCount } = await supabase
          .from("campaign_applications")
          .select("id, campaigns!inner(brand_id)", { count: "exact", head: true })
          .eq("campaigns.brand_id", brand.id)
          .eq("status", "accepted")

        const tierLimits: Record<string, { campaigns: number; seats: number; ugcVideos: number }> = {
          free: { campaigns: 2, seats: 5, ugcVideos: 2 },
          starter: { campaigns: 5, seats: 20, ugcVideos: 10 },
          growth: { campaigns: 10, seats: 50, ugcVideos: 50 },
          scale: { campaigns: -1, seats: -1, ugcVideos: -1 },
        }

        const tier = brand.subscription_tier || "free"
        const limits = tierLimits[tier] || tierLimits.free

        // Count UGC videos this month
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const { count: ugcCount } = await supabase
          .from("ugc_video_jobs")
          .select("id", { count: "exact", head: true })
          .eq("brand_id", brand.id)
          .gte("created_at", startOfMonth)

        setUsage({
          currentTier: tier,
          campaignsUsed: campaignCount ?? 0,
          campaignsLimit: limits.campaigns,
          seatsUsed: seatCount ?? 0,
          seatsLimit: limits.seats,
          ugcVideosUsed: ugcCount ?? 0,
          ugcVideosLimit: limits.ugcVideos,
        })
      } catch (error) {
        console.error("Failed to fetch usage:", error)
      }
    }
    fetchUsage()
  }, [])

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
      else alert(data.error || "Failed to create checkout session")
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
      else alert(data.error || "Failed to open billing portal")
    } catch {
      alert("Failed to open billing portal")
    }
    setLoading(null)
  }

  const formatLimit = (n: number) => (n === -1 ? "Unlimited" : String(n))

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

      {/* Usage Overview */}
      {usage && (
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Current Usage</h2>
            <span className="ml-auto text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
              {usage.currentTier} Plan
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Active Campaigns</span>
                <span className="font-medium">{usage.campaignsUsed} / {formatLimit(usage.campaignsLimit)}</span>
              </div>
              {usage.campaignsLimit !== -1 && (
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, (usage.campaignsUsed / usage.campaignsLimit) * 100)}%` }}
                  />
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Accepted Creators</span>
                <span className="font-medium">{usage.seatsUsed} / {formatLimit(usage.seatsLimit)}</span>
              </div>
              {usage.seatsLimit !== -1 && (
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, (usage.seatsUsed / usage.seatsLimit) * 100)}%` }}
                  />
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>AI UGC Videos</span>
                <span className="font-medium">{usage.ugcVideosUsed} / {formatLimit(usage.ugcVideosLimit)}/mo</span>
              </div>
              {usage.ugcVideosLimit !== -1 && (
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${usage.ugcVideosUsed >= usage.ugcVideosLimit ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${Math.min(100, (usage.ugcVideosUsed / usage.ugcVideosLimit) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const isCurrentTier = usage?.currentTier === t.key
          return (
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
                disabled={loading === t.key || isCurrentTier}
                className={`w-full text-center px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 ${
                  t.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border hover:bg-muted"
                }`}
              >
                {loading === t.key ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : isCurrentTier ? (
                  "Current Plan"
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CheckoutForm } from "./checkout-form"

const PLANS: Record<string, {
  name: string
  role: "brand" | "creator"
  monthly: { price: number; label: string }
  annual: { price: number; label: string; billedAs: string }
  features: string[]
  tagline: string
  tier: string
}> = {
  starter: {
    name: "Starter",
    role: "brand",
    tier: "starter",
    tagline: "For small businesses getting started with UGC.",
    monthly: { price: 44, label: "€44" },
    annual: { price: 28, label: "€28", billedAs: "€336 billed annually" },
    features: [
      "5 campaigns per month",
      "Up to 20 creator seats per campaign",
      "AI-powered creator search",
      "Advanced search filters",
      "Content approval workflow",
      "Email support",
      "7-day free trial",
    ],
  },
  growth: {
    name: "Growth",
    role: "brand",
    tier: "growth",
    tagline: "For growing businesses scaling their content.",
    monthly: { price: 95, label: "€95" },
    annual: { price: 60, label: "€60", billedAs: "€720 billed annually" },
    features: [
      "10 campaigns per month",
      "Up to 50 creator seats per campaign",
      "Everything in Starter",
      "Priority support",
      "Analytics dashboard",
      "Team collaboration",
      "7-day free trial",
    ],
  },
  scale: {
    name: "Scale",
    role: "brand",
    tier: "scale",
    tagline: "For enterprises with unlimited content needs.",
    monthly: { price: 227, label: "€227" },
    annual: { price: 143, label: "€143", billedAs: "€1,716 billed annually" },
    features: [
      "Unlimited campaigns",
      "Unlimited creator seats",
      "Everything in Growth",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "7-day free trial",
    ],
  },
  pro: {
    name: "Creator Pro",
    role: "creator",
    tier: "pro",
    tagline: "For serious creators ready to grow.",
    monthly: { price: 24.99, label: "€24.99" },
    annual: { price: 15.75, label: "€15.75", billedAs: "€189 billed annually" },
    features: [
      "Unlimited campaign applications",
      "Priority search ranking",
      "Verified creator badge",
      "Advanced analytics & insights",
      "Portfolio showcase",
      "Priority support",
      "Early access to campaigns",
    ],
  },
  elite: {
    name: "Creator Elite",
    role: "creator",
    tier: "elite",
    tagline: "Maximum visibility and premium perks.",
    monthly: { price: 99, label: "€99" },
    annual: { price: 62, label: "€62", billedAs: "€744 billed annually" },
    features: [
      "Everything in Pro",
      "Featured homepage placement",
      "Custom profile URL",
      "24-hour priority support",
      "Verified elite status",
      "0% platform fee on first €1,000/mo",
    ],
  },
}

export async function generateMetadata({ params }: { params: { plan: string } }): Promise<Metadata> {
  const plan = PLANS[params.plan]
  return {
    title: plan ? `Checkout — ${plan.name} | Townshub` : "Checkout | Townshub",
  }
}

export default function CheckoutPage({
  params,
  searchParams,
}: {
  params: { plan: string }
  searchParams: { billing?: string }
}) {
  const plan = PLANS[params.plan]
  if (!plan) redirect("/pricing")

  const isAnnual = searchParams.billing === "annual"

  return (
    <CheckoutForm
      plan={plan}
      planKey={params.plan}
      isAnnual={isAnnual}
    />
  )
}

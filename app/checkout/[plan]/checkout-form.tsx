"use client"

import { useState } from "react"
import Link from "next/link"
import { LogoHorizontal } from "@/components/shared/logo"
import { Check, Loader2, Shield, CreditCard, Building2, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type PlanDef = {
  name: string
  role: "brand" | "creator"
  tier: string
  tagline: string
  monthly: { price: number; label: string }
  annual: { price: number; label: string; billedAs: string }
  features: string[]
}

type PayMethod = "card" | "bank" | "paypal" | "revolut" | "wise"

const PAY_METHODS: { id: PayMethod; label: string; icon: string }[] = [
  { id: "card", label: "Card", icon: "💳" },
  { id: "bank", label: "Bank", icon: "🏦" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "revolut", label: "Revolut", icon: "🔄" },
  { id: "wise", label: "Wise", icon: "🌍" },
]

// Manual payment account details — update these with your real details
const BANK_DETAILS = {
  accountName: "Townshub Limited",
  iban: "CY12 0000 0000 0000 0000 0000 0000",   // ← replace with real IBAN
  bic: "XXXXXXXX",                                // ← replace with real BIC/SWIFT
  bank: "Bank of Cyprus",
  country: "Cyprus",
}
const PAYPAL_EMAIL = "payments@townshub.com"      // ← replace with real PayPal
const REVOLUT_TAG = "@townshub"                   // ← replace with real Revolut tag
const WISE_EMAIL = "payments@townshub.com"        // ← replace with real Wise email

export function CheckoutForm({
  plan,
  planKey,
  isAnnual: initialAnnual,
}: {
  plan: PlanDef
  planKey: string
  isAnnual: boolean
}) {
  const [annual, setAnnual] = useState(initialAnnual)
  const [method, setMethod] = useState<PayMethod>("card")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [loading, setLoading] = useState(false)
  const [manualSent, setManualSent] = useState(false)
  const [showAllFeatures, setShowAllFeatures] = useState(false)

  const pricing = annual ? plan.annual : plan.monthly
  const total = pricing.price.toFixed(2)
  const reference = `TOWNSHUB-${planKey.toUpperCase()}-${Date.now().toString().slice(-6)}`

  async function handleCardCheckout() {
    setLoading(true)
    try {
      const endpoint = plan.role === "creator"
        ? "/api/subscriptions/creator-checkout"
        : "/api/subscriptions/create-checkout"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: plan.tier, billing: annual ? "annual" : "monthly" }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || "Checkout failed. Please try again.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleManualPayment() {
    if (!firstName || !email) {
      toast.error("Please fill in your name and email.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/subscriptions/manual-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, company,
          plan: planKey, tier: plan.tier, role: plan.role,
          method, billing: annual ? "annual" : "monthly",
          amount: total, reference,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setManualSent(true)
      } else {
        toast.error(data.error || "Failed to submit. Please try again.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const visibleFeatures = showAllFeatures ? plan.features : plan.features.slice(0, 4)

  if (manualSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Payment Request Received</h1>
          <p className="text-muted-foreground">
            We&apos;ve received your payment request for <strong>{plan.name}</strong>. Please
            complete your {method === "bank" ? "bank transfer" : method === "paypal" ? "PayPal payment" : method === "revolut" ? "Revolut payment" : "Wise transfer"} using the details shown, with reference{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{reference}</code>.
          </p>
          <p className="text-sm text-muted-foreground">
            Your account will be activated within <strong>1 business day</strong> once payment is confirmed.
            We&apos;ll email <strong>{email}</strong> with next steps.
          </p>
          <div className="rounded-lg border p-4 text-left text-sm space-y-1">
            <p><span className="text-muted-foreground">Reference:</span> <strong className="font-mono">{reference}</strong></p>
            <p><span className="text-muted-foreground">Amount:</span> <strong>€{total}{annual ? "/mo (billed annually)" : "/mo"}</strong></p>
            <p><span className="text-muted-foreground">Plan:</span> <strong>{plan.name}</strong></p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-4">
        <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <LogoHorizontal />
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-green-600" />
          <span>Secure checkout</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

        {/* ── LEFT: Form ── */}
        <div className="space-y-6">

          {/* Billing toggle */}
          <div className="bg-background border rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Billing cycle</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Monthly", value: false, sub: `€${plan.monthly.price}/mo` },
                { label: "Annual", value: true, sub: `€${plan.annual.price}/mo · Save ~37%` },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAnnual(opt.value)}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    annual === opt.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>
                  {opt.value && (
                    <span className="inline-block mt-1 text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                      Best value
                    </span>
                  )}
                </button>
              ))}
            </div>
            {annual && (
              <p className="text-xs text-muted-foreground mt-2">{plan.annual.billedAs}</p>
            )}
          </div>

          {/* Contact details */}
          <div className="bg-background border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold mb-1 text-muted-foreground uppercase tracking-wide">Your details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                <Input id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Smith" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {plan.role === "brand" && (
              <div className="space-y-1.5">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Acme Inc." value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            )}
          </div>

          {/* Payment method */}
          <div className="bg-background border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold mb-1 text-muted-foreground uppercase tracking-wide">Payment method</h2>

            <div className="grid grid-cols-5 gap-2">
              {PAY_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg border py-3 px-1 text-xs font-medium transition-all ${
                    method === m.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Card */}
            {method === "card" && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Visa, Mastercard, Amex, Apple Pay, Google Pay</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You&apos;ll be taken to Stripe&apos;s secure checkout page to enter your card details.
                  Your 7-day free trial starts immediately.
                </p>
                <Button
                  className="w-full"
                  onClick={handleCardCheckout}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Start Free Trial → Pay €${total}/mo`}
                </Button>
              </div>
            )}

            {/* Bank */}
            {method === "bank" && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4" />
                  Bank Transfer Details
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {[
                    ["Account Name", BANK_DETAILS.accountName],
                    ["IBAN", BANK_DETAILS.iban],
                    ["BIC / SWIFT", BANK_DETAILS.bic],
                    ["Bank", `${BANK_DETAILS.bank}, ${BANK_DETAILS.country}`],
                    ["Amount", `€${total}${annual ? " (first annual payment)" : "/month"}`],
                    ["Reference", reference],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-2 py-1.5 border-b last:border-0">
                      <span className="text-muted-foreground shrink-0">{label}</span>
                      <span className="font-mono text-right break-all">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Use the reference above exactly. Click below after initiating the transfer — we&apos;ll activate your account within 1 business day.
                </p>
                <Button className="w-full" onClick={handleManualPayment} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "I've Sent the Transfer"}
                </Button>
              </div>
            )}

            {/* PayPal */}
            {method === "paypal" && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="text-sm space-y-2">
                  <p className="font-medium flex items-center gap-2">🅿️ Pay via PayPal</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      ["PayPal Email", PAYPAL_EMAIL],
                      ["Amount", `€${total}${annual ? " (annual)" : "/month"}`],
                      ["Reference / Note", reference],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-start justify-between gap-2 py-1.5 border-b last:border-0 text-sm">
                        <span className="text-muted-foreground shrink-0">{label}</span>
                        <span className="font-mono text-right break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send payment to the PayPal email above. Include the reference in the payment note.
                    Click below after sending — we&apos;ll activate your account within 1 business day.
                  </p>
                </div>
                <Button className="w-full" onClick={handleManualPayment} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "I've Sent the Payment"}
                </Button>
              </div>
            )}

            {/* Revolut */}
            {method === "revolut" && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="text-sm space-y-2">
                  <p className="font-medium flex items-center gap-2">🔄 Pay via Revolut</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      ["Revolut Tag", REVOLUT_TAG],
                      ["Amount", `€${total}${annual ? " (annual)" : "/month"}`],
                      ["Reference / Note", reference],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-start justify-between gap-2 py-1.5 border-b last:border-0 text-sm">
                        <span className="text-muted-foreground shrink-0">{label}</span>
                        <span className="font-mono text-right break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Open Revolut, search for <strong>{REVOLUT_TAG}</strong>, and send payment with
                    the reference above. Click below after sending.
                  </p>
                </div>
                <Button className="w-full" onClick={handleManualPayment} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "I've Sent the Payment"}
                </Button>
              </div>
            )}

            {/* Wise */}
            {method === "wise" && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="text-sm space-y-2">
                  <p className="font-medium flex items-center gap-2">🌍 Pay via Wise</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      ["Wise Email", WISE_EMAIL],
                      ["Account Name", BANK_DETAILS.accountName],
                      ["Amount", `€${total}${annual ? " (annual)" : "/month"}`],
                      ["Reference / Note", reference],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-start justify-between gap-2 py-1.5 border-b last:border-0 text-sm">
                        <span className="text-muted-foreground shrink-0">{label}</span>
                        <span className="font-mono text-right break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send to the Wise email above. Include the reference in the transfer note.
                    Click below after sending — we&apos;ll activate within 1 business day.
                  </p>
                </div>
                <Button className="w-full" onClick={handleManualPayment} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "I've Sent the Payment"}
                </Button>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By completing your purchase you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>

        {/* ── RIGHT: Plan summary ── */}
        <div className="lg:sticky lg:top-24 space-y-4">
          {/* Plan card */}
          <div className="bg-background border rounded-xl overflow-hidden">
            <div className="bg-primary px-5 py-4 text-primary-foreground">
              <p className="text-xs font-medium opacity-80 uppercase tracking-wide">
                {plan.role === "brand" ? "Brand Plan" : "Creator Plan"}
              </p>
              <h2 className="text-2xl font-bold mt-0.5">{plan.name}</h2>
              <p className="text-sm opacity-80 mt-0.5">{plan.tagline}</p>
            </div>
            <div className="px-5 py-4 border-b">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">€{total}</span>
                <span className="text-muted-foreground mb-1">/mo</span>
                {method === "card" && (
                  <span className="mb-1 ml-2 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                    7-day free trial
                  </span>
                )}
              </div>
              {annual && (
                <p className="text-xs text-muted-foreground mt-1">{plan.annual.billedAs}</p>
              )}
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">What&apos;s included</p>
              <ul className="space-y-2.5">
                {visibleFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.features.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllFeatures((v) => !v)}
                  className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {showAllFeatures ? (
                    <><ChevronUp className="h-3 w-3" /> Show less</>
                  ) : (
                    <><ChevronDown className="h-3 w-3" /> +{plan.features.length - 4} more features</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Trust signals */}
          <div className="bg-background border rounded-xl px-5 py-4 space-y-3">
            {[
              { icon: "✅", text: "Cancel anytime, hassle-free" },
              { icon: "🔒", text: "256-bit SSL encrypted checkout" },
              { icon: "💶", text: "Payments processed securely" },
              { icon: "🎁", text: "7-day money-back guarantee" },
              { icon: "🇨🇾", text: "Governed by Cyprus law" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm">
                <span>{icon}</span>
                <span className="text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Switch billing toggle shortcut */}
          <div className="text-center text-xs text-muted-foreground">
            Want a different plan?{" "}
            <Link href="/pricing" className="text-primary hover:underline">
              View all plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

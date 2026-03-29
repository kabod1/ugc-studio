"use client"

import { useState, useEffect } from "react"
import { Share2, Copy, Users, DollarSign, TrendingUp, Check, Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface ReferralStats {
  total: number
  active: number
  paid: number
  total_commission_cents: number
}

interface Referral {
  id: string
  status: "pending" | "active" | "paid"
  commission_cents: number
  plan: string | null
  created_at: string
}

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  active: "bg-green-50 text-green-700",
  paid: "bg-blue-50 text-blue-700",
}

export default function AffiliatesPage() {
  const [loading, setLoading] = useState(true)
  const [referralCode, setReferralCode] = useState("")
  const [stats, setStats] = useState<ReferralStats>({ total: 0, active: 0, paid: 0, total_commission_cents: 0 })
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [copied, setCopied] = useState(false)

  const referralLink = referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : "https://ugc-studio-zeta.vercel.app"}/signup?ref=${referralCode}`
    : ""

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/creator/referral")
        if (res.ok) {
          const data = await res.json()
          setReferralCode(data.referral_code || "")
          setStats(data.stats || { total: 0, active: 0, paid: 0, total_commission_cents: 0 })
          setReferrals(data.referrals || [])
        }
      } catch {
        // non-critical
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function copyLink() {
    if (!referralLink) return
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success("Referral link copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy. Please copy manually.")
    }
  }

  const totalEarned = (stats.total_commission_cents / 100).toFixed(2)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Affiliates</h1>
        <p className="text-muted-foreground mt-1">
          Earn recurring commission by referring creators and brands to UGC Studio.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Earnings stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">€{totalEarned}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Earned</p>
            </div>
            <div className="bg-card border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Referrals</p>
            </div>
            <div className="bg-card border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-muted-foreground mt-1">Active Subs</p>
            </div>
          </div>

          {/* Referral link card */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              Your Referral Link
            </h3>

            {referralCode ? (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 h-10 rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground select-all"
                    onFocus={(e) => e.target.select()}
                  />
                  <button
                    onClick={copyLink}
                    className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <p className="text-xs text-muted-foreground">Your code:</p>
                  <code className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{referralCode}</code>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Loading your referral link...</p>
            )}

            {/* Share shortcuts */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">Share on:</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "TikTok", url: `https://www.tiktok.com/` },
                  { label: "Instagram", url: `https://www.instagram.com/` },
                  { label: "Twitter/X", url: `https://twitter.com/intent/tweet?text=Get paid to create UGC content for brands → ${encodeURIComponent(referralLink)}` },
                  { label: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`Get paid to create brand content: ${referralLink}`)}` },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Commission rates */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Commission Rates
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { plan: "Creator Pro", rate: "€4 / month", desc: "Per active creator subscriber" },
                { plan: "Brand Starter", rate: "€6 / month", desc: "Per active brand subscriber" },
                { plan: "Brand Pro", rate: "€15 / month", desc: "Per active brand Pro subscriber" },
              ].map((r) => (
                <div key={r.plan} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <div>
                    <span className="font-medium">{r.plan}</span>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  <span className="font-bold text-primary">{r.rate}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Commissions are recurring — you earn every month they stay subscribed.</p>
          </div>

          {/* How it works */}
          <div className="space-y-3">
            <h3 className="font-semibold">How it works</h3>
            <div className="space-y-3">
              {[
                { icon: Share2, title: "Share your link", desc: "Post in your bio, videos, or send directly to creator friends." },
                { icon: Users, title: "They sign up", desc: "When someone creates a paid account via your link, it's permanently tracked." },
                { icon: DollarSign, title: "You earn instantly", desc: "Commission is added to your earnings when they go active." },
                { icon: TrendingUp, title: "Recurring for life", desc: "You earn every month they stay subscribed — no cap." },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 bg-card border rounded-xl p-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referrals list */}
          {referrals.length > 0 && (
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b">
                <h3 className="font-semibold">Your Referrals</h3>
              </div>
              <div className="divide-y">
                {referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium">{ref.plan || "New signup"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ref.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-primary">
                        €{(ref.commission_cents / 100).toFixed(2)}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[ref.status]}`}>
                        {ref.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {referrals.length === 0 && (
            <div className="bg-card border rounded-xl p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">No referrals yet</p>
              <p className="text-sm text-muted-foreground mt-1">Share your link on social media to start earning passive income.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

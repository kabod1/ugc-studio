"use client"

import { useState, useEffect } from "react"
import { Clock, CreditCard, TrendingUp, Loader2, ExternalLink, Euro } from "lucide-react"


const formatEur = (cents: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(cents / 100)

export default function EarningsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settingUp, setSettingUp] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/creator/earnings")
        if (res.ok) {
          const data = await res.json()
          setCreator(data.creator)
          setPayments(data.payments || [])
        }
      } catch (err) {
        console.error("Earnings load error:", err)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function setupConnect() {
    setSettingUp(true)
    setConnectError(null)
    try {
      const res = await fetch("/api/payments/create-connect-account", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      const errMsg = data.error || "Failed to set up Stripe Connect"
      if (
        errMsg.includes("signed up for Connect") ||
        errMsg.includes("create new accounts") ||
        errMsg.includes("transfers") ||
        errMsg.includes("capability") ||
        errMsg.includes("approval")
      ) {
        setConnectError(
          "Stripe Connect payouts are not yet active on this platform. The platform owner needs to complete Stripe Connect setup and approval. Please check back soon — payouts will be available once this is approved."
        )
      } else {
        setConnectError(errMsg)
      }
    } catch (err: any) {
      setConnectError("Connection error: " + (err?.message || "Unknown error"))
    }
    setSettingUp(false)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>

  const totals = payments.reduce(
    (acc, p) => {
      const creatorAmount = (p.amount_cents || 0) - (p.platform_fee_cents || 0)
      acc.total += creatorAmount
      if (p.status === "completed") acc.completed += creatorAmount
      if (p.status === "escrow" || p.status === "pending") acc.pending += creatorAmount
      return acc
    },
    { total: 0, completed: 0, pending: 0 }
  )

  const thisMonth = payments
    .filter((p) => p.status === "completed" && new Date(p.paid_at).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + ((p.amount_cents || 0) - (p.platform_fee_cents || 0)), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">Track your income and payouts</p>
      </div>

      {!creator?.stripe_connect_account_id && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-2">Set Up Payouts</h2>
          <p className="text-sm text-muted-foreground mb-4">Connect your Stripe account to receive payments from brands.</p>
          {connectError && (
            <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
              {connectError}
            </div>
          )}
          <button onClick={setupConnect} disabled={settingUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {settingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
            Set Up Stripe Connect
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Euro className="h-4 w-4" /> Total Earned</div>
          <p className="text-2xl font-bold mt-1">{formatEur(totals.completed)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Clock className="h-4 w-4" /> Pending</div>
          <p className="text-2xl font-bold mt-1">{formatEur(totals.pending)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><TrendingUp className="h-4 w-4" /> This Month</div>
          <p className="text-2xl font-bold mt-1">{formatEur(thisMonth)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><CreditCard className="h-4 w-4" /> Payouts</div>
          <p className="text-2xl font-bold mt-1">{creator?.stripe_connect_account_id ? "Active" : "Not set up"}</p>
        </div>
      </div>

      {payments.length > 0 ? (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Campaign</th>
              <th className="text-right p-3 font-medium">Amount</th>
              <th className="text-right p-3 font-medium">Fee</th>
              <th className="text-right p-3 font-medium">You Receive</th>
              <th className="text-center p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3">{(p.campaigns as any)?.title || "—"}</td>
                  <td className="p-3 text-right">{formatEur(p.amount_cents)}</td>
                  <td className="p-3 text-right text-muted-foreground">-{formatEur(p.platform_fee_cents)}</td>
                  <td className="p-3 text-right font-medium">{formatEur(p.amount_cents - p.platform_fee_cents)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "completed" ? "bg-green-100 text-green-800" :
                      p.status === "escrow" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-right text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
          No earnings yet. Complete campaigns to start earning.
        </div>
      )}
    </div>
  )
}

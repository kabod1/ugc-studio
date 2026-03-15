"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { CreditCard, DollarSign, Clock, Check, Loader2, Send } from "lucide-react"

interface Payment {
  id: string
  status: string
  amount_cents: number
  platform_fee_cents: number
  created_at: string
  campaigns: { title: string } | null
  creator_profiles: { display_name: string } | null
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [releasingId, setReleasingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/payments")
        if (res.ok) {
          const data = await res.json()
          setPayments(data.payments || [])
        }
      } catch (err) {
        console.error("Payments load error:", err)
      }
      setLoading(false)
    }
    fetchPayments()
  }, [])

  async function handleRelease(paymentId: string) {
    if (!confirm("Release this payment to the creator? This cannot be undone.")) return
    setReleasingId(paymentId)
    try {
      const res = await fetch("/api/payments/release-escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to release payment")
      }
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: "completed" } : p))
      )
      toast.success("Payment released to creator")
    } catch (err: any) {
      toast.error(err.message)
    }
    setReleasingId(null)
  }

  const totals = payments.reduce(
    (acc, p) => {
      acc.total += p.amount_cents || 0
      if (p.status === "pending") acc.pending += p.amount_cents || 0
      if (p.status === "escrow") acc.escrow += p.amount_cents || 0
      if (p.status === "completed") acc.completed += p.amount_cents || 0
      return acc
    },
    { total: 0, pending: 0, escrow: 0, completed: 0 }
  )

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    escrow: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Manage creator payments and escrow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><DollarSign className="h-4 w-4" /> Total Spent</div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totals.total)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Clock className="h-4 w-4" /> Pending</div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totals.pending)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><CreditCard className="h-4 w-4" /> In Escrow</div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totals.escrow)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Check className="h-4 w-4" /> Completed</div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totals.completed)}</p>
        </div>
      </div>

      {payments.length > 0 ? (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Campaign</th>
              <th className="text-left p-3 font-medium">Creator</th>
              <th className="text-right p-3 font-medium">Amount</th>
              <th className="text-center p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Date</th>
              <th className="text-right p-3 font-medium">Action</th>
            </tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3">{(p.campaigns as any)?.title || "—"}</td>
                  <td className="p-3">{(p.creator_profiles as any)?.display_name || "—"}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(p.amount_cents)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || ""}`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-right text-muted-foreground">{formatDate(p.created_at)}</td>
                  <td className="p-3 text-right">
                    {p.status === "escrow" && (
                      <button
                        onClick={() => handleRelease(p.id)}
                        disabled={releasingId === p.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {releasingId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                        Release
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
          No payments yet
        </div>
      )}
    </div>
  )
}

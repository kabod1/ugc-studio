"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { ScrollText, Loader2, FileCheck, CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface Contract {
  id: string
  status: string
  terms: string
  total_value_cents: number
  creator_signed_at: string | null
  brand_signed_at: string | null
  created_at: string
  campaigns: { title: string } | null
  creator_profiles: { display_name: string } | null
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [signingId, setSigningId] = useState<string | null>(null)
  const [backfilling, setBackfilling] = useState(false)

  useEffect(() => {
    fetchContracts()
  }, [])

  async function fetchContracts() {
    try {
      const res = await fetch("/api/contracts")
      if (res.ok) {
        const data = await res.json()
        setContracts(data || [])
      }
    } catch {
      console.error("Failed to fetch contracts")
    }
    setLoading(false)
  }

  async function handleBackfill() {
    setBackfilling(true)
    try {
      const res = await fetch("/api/contracts/backfill", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.created > 0 ? `${data.created} contract(s) generated` : "Contracts synced")
        // Always re-fetch regardless of count — fixes any null brand_id rows
        setContracts([])
        setLoading(true)
        await fetchContracts()
      } else {
        toast.error(data.error || "Sync failed")
      }
    } catch {
      toast.error("Failed to sync contracts")
    }
    setBackfilling(false)
  }

  async function handleSign(contractId: string) {
    setSigningId(contractId)
    try {
      const res = await fetch(`/api/contracts/${contractId}/sign`, { method: "POST" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to sign contract")
      }
      const updated = await res.json()
      setContracts((prev) =>
        prev.map((c) => (c.id === contractId ? { ...c, ...updated } : c))
      )
      toast.success("Contract signed!")
    } catch (err: any) {
      toast.error(err.message)
    }
    setSigningId(null)
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    draft:  { label: "Draft",         color: "bg-gray-100 text-gray-700",   icon: Clock },
    sent:   { label: "Awaiting Sign", color: "bg-blue-100 text-blue-700",   icon: AlertCircle },
    signed: { label: "Fully Signed",  color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    expired:{ label: "Expired",       color: "bg-red-100 text-red-700",     icon: AlertCircle },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">Manage creator contracts and agreements</p>
        </div>
        <button
          onClick={handleBackfill}
          disabled={backfilling}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
        >
          {backfilling ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
          Sync Contracts
        </button>
      </div>

      {contracts.length > 0 ? (
        <div className="grid gap-4">
          {contracts.map((c) => {
            const cfg = statusConfig[c.status] || statusConfig.draft
            const StatusIcon = cfg.icon
            const bothSigned = c.brand_signed_at && c.creator_signed_at
            return (
              <div key={c.id} className="bg-card border rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">
                        {c.campaigns?.title || "Untitled Campaign"}
                      </h3>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">
                        {c.creator_profiles?.display_name || "Creator"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Value: <span className="font-medium text-foreground">{formatCurrency(c.total_value_cents)}</span>
                      &nbsp;·&nbsp;Created: {formatDate(c.created_at)}
                    </p>

                    {/* Signature status */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        {c.brand_signed_at
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          : <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className={c.brand_signed_at ? "text-green-700 font-medium" : "text-muted-foreground"}>
                          Brand {c.brand_signed_at ? `signed ${formatDate(c.brand_signed_at)}` : "not signed"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        {c.creator_signed_at
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          : <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className={c.creator_signed_at ? "text-green-700 font-medium" : "text-muted-foreground"}>
                          Creator {c.creator_signed_at ? `signed ${formatDate(c.creator_signed_at)}` : "not signed"}
                        </span>
                      </div>
                    </div>

                    {/* Terms preview */}
                    {c.terms && (
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2 bg-muted/50 rounded-md px-3 py-2">
                        {c.terms}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                    {!c.brand_signed_at && (
                      <button
                        onClick={() => handleSign(c.id)}
                        disabled={signingId === c.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                      >
                        {signingId === c.id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <FileCheck className="h-3.5 w-3.5" />}
                        Sign Contract
                      </button>
                    )}
                    {bothSigned && (
                      <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Fully executed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-card border rounded-xl p-12 text-center">
          <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No contracts yet</h3>
          <p className="text-muted-foreground mt-1 mb-6">
            Contracts are created automatically when you accept a creator application.
            If you&apos;ve already accepted applications, click below to sync.
          </p>
          <button
            onClick={handleBackfill}
            disabled={backfilling}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {backfilling ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
            Generate Missing Contracts
          </button>
        </div>
      )}
    </div>
  )
}

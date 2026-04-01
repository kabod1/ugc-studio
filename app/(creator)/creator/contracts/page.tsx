"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { ScrollText, Loader2, FileCheck } from "lucide-react"

interface Contract {
  id: string
  status: string
  terms: Record<string, any>
  total_amount_cents: number
  signed_by_creator_at: string | null
  signed_by_brand_at: string | null
  created_at: string
  campaigns: { title: string } | null
  brands: { company_name: string } | null
}

export default function CreatorContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [signingId, setSigningId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
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
    fetchContracts()
  }, [])

  async function handleSign(contractId: string) {
    if (!confirm("Are you sure you want to sign this contract? This is binding.")) return
    setSigningId(contractId)
    try {
      const res = await fetch(`/api/contracts/${contractId}/sign`, { method: "POST" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to sign contract")
      }
      const updated = await res.json()
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractId
            ? { ...c, signed_by_creator_at: updated.signed_by_creator_at, signed_by_brand_at: updated.signed_by_brand_at, status: updated.status }
            : c
        )
      )
      toast.success("Contract signed successfully!")
    } catch (err: any) {
      toast.error(err.message)
    }
    setSigningId(null)
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    signed: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
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
        <h1 className="text-2xl font-bold">Contracts</h1>
        <p className="text-muted-foreground">Review and sign your contracts</p>
      </div>

      {contracts.length > 0 ? (
        <div className="grid gap-4">
          {contracts.map((c) => (
            <div key={c.id} className="bg-card border rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{(c.brands as any)?.company_name || "Brand"}</h3>
                  <p className="text-sm text-muted-foreground">{(c.campaigns as any)?.title || "Campaign"} &middot; {formatCurrency(c.total_amount_cents)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || ""}`}>
                    {c.status}
                  </span>
                  {(c.status === "sent" || c.status === "draft") && !c.signed_by_creator_at && (
                    <button
                      onClick={() => handleSign(c.id)}
                      disabled={signingId === c.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      {signingId === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileCheck className="h-3.5 w-3.5" />}
                      Sign Contract
                    </button>
                  )}
                  {c.signed_by_creator_at && (
                    <span className="text-xs text-green-600 font-medium">Signed</span>
                  )}
                </div>
              </div>

              {/* Expandable terms */}
              <button
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                className="text-xs text-primary mt-2 hover:underline"
              >
                {expandedId === c.id ? "Hide terms" : "View terms"}
              </button>
              {expandedId === c.id && c.terms && (
                <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted/50 rounded-md whitespace-pre-wrap">
                  {c.terms.summary || JSON.stringify(c.terms)}
                </p>
              )}

              <p className="text-xs text-muted-foreground mt-2">Created: {formatDate(c.created_at)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No contracts yet</h3>
          <p className="text-muted-foreground mt-1">Contracts will appear here once you&apos;re accepted to campaigns</p>
        </div>
      )}
    </div>
  )
}

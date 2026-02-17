"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { ScrollText, Loader2, FileCheck } from "lucide-react"

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
        <p className="text-muted-foreground">Manage creator contracts and agreements</p>
      </div>

      {contracts.length > 0 ? (
        <div className="grid gap-4">
          {contracts.map((c) => (
            <div key={c.id} className="bg-card border rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{(c.campaigns as any)?.title} — {(c.creator_profiles as any)?.display_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Value: {formatCurrency(c.total_value_cents)} &middot; Created: {formatDate(c.created_at)}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Brand: {c.brand_signed_at ? "Signed" : "Not signed"}</span>
                    <span>Creator: {c.creator_signed_at ? "Signed" : "Not signed"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || ""}`}>
                    {c.status}
                  </span>
                  {!c.brand_signed_at && (
                    <button
                      onClick={() => handleSign(c.id)}
                      disabled={signingId === c.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      {signingId === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileCheck className="h-3.5 w-3.5" />}
                      Sign
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No contracts yet</h3>
          <p className="text-muted-foreground mt-1">Contracts are created when you accept a creator application</p>
        </div>
      )}
    </div>
  )
}

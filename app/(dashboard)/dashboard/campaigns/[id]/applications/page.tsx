"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"

import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Star, Loader2, CreditCard } from "lucide-react"

interface Application {
  id: string
  status: string
  pitch: string | null
  proposed_rate_cents: number
  ai_match_score: number | null
  created_at: string
  creator_profiles: {
    display_name: string | null
    avatar_url: string | null
    avg_rating: number | null
    follower_count: number | null
    categories: string[] | null
  } | null
}

export default function ApplicationsPage() {
  const params = useParams()
  const campaignId = params.id as string

  const [applications, setApplications] = useState<Application[]>([])
  const [campaignTitle, setCampaignTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("title")
        .eq("id", campaignId)
        .single()
      if (campaign) setCampaignTitle(campaign.title)

      const res = await fetch(`/api/campaigns/${campaignId}/applications`)
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [campaignId])

  async function handlePay(app: Application) {
    setPayingId(app.id)
    try {
      const res = await fetch("/api/payments/creator-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: app.id,
          campaign_id: campaignId,
          amount_cents: app.proposed_rate_cents,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Payment failed")
      window.location.href = data.url
    } catch (err: any) {
      toast.error(err.message)
      setPayingId(null)
    }
  }

  async function handleUpdateStatus(applicationId: string, newStatus: "accepted" | "rejected") {
    setUpdatingId(applicationId)
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const err = await res.json()
        if (res.status === 403 && err.upgradeUrl) {
          toast.error(err.error, {
            action: { label: "Upgrade", onClick: () => window.location.href = err.upgradeUrl },
            duration: 8000,
          })
        } else {
          throw new Error(err.error || "Failed to update application")
        }
        return
      }

      const updated = await res.json()
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: updated.status } : a))
      )
      toast.success(`Application ${newStatus}`)
    } catch (err: any) {
      toast.error(err.message)
    }
    setUpdatingId(null)
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
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
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/campaigns/${campaignId}`} className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted-foreground">{campaignTitle}</p>
        </div>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const creator = app.creator_profiles as any
            return (
              <div key={app.id} className="bg-card border rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {creator?.display_name?.[0] || "?"}
                    </div>
                    <div>
                      <h3 className="font-semibold">{creator?.display_name || "Creator"}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {creator?.platform_rating > 0 && (
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" />{creator.platform_rating}</span>
                        )}
                        <span>{((creator?.tiktok_followers || 0) + (creator?.instagram_followers || 0)).toLocaleString()} followers</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.ai_match_score && (
                      <span className="text-sm font-medium text-primary">{app.ai_match_score}% match</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] || ""}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
                {app.pitch && <p className="text-sm text-muted-foreground mt-3">{app.pitch}</p>}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Rate: {formatCurrency(app.proposed_rate_cents)} &middot; Applied: {formatDate(app.created_at)}
                  </div>
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(app.id, "accepted")}
                        disabled={updatingId === app.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {updatingId === app.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, "rejected")}
                        disabled={updatingId === app.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-muted disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {app.status === "accepted" && (
                    <button
                      onClick={() => handlePay(app)}
                      disabled={payingId === app.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      {payingId === app.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                      Pay {formatCurrency(app.proposed_rate_cents)}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No applications yet</p>
        </div>
      )}
    </div>
  )
}

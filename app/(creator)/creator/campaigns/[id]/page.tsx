"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Check, Clock } from "lucide-react"

export default function CreatorCampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<any>(null)
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [pitch, setPitch] = useState("")
  const [rate, setRate] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data: c } = await supabase
        .from("campaigns")
        .select("*, brands(company_name)")
        .eq("id", params.id)
        .single()
      setCampaign(c)

      if (user) {
        const { data: creator } = await supabase
          .from("creator_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single()

        if (creator) {
          const { data: app } = await supabase
            .from("campaign_applications")
            .select("*")
            .eq("campaign_id", params.id)
            .eq("creator_id", creator.id)
            .single()
          setApplication(app)
        }
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: params.id,
          pitch,
          proposed_rate_cents: Math.round(parseFloat(rate) * 100),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setApplication(data)
      }
    } catch {}
    setSubmitting(false)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!campaign) return <div className="p-12 text-center text-muted-foreground">Campaign not found</div>

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/creator/campaigns" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{campaign.title}</h1>
          <p className="text-muted-foreground">{campaign.brands?.company_name}</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div>
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-sm text-muted-foreground">{campaign.description}</p>
        </div>
        {campaign.brief && (
          <div>
            <h2 className="font-semibold mb-2">Brief</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.brief}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Budget:</span> {formatCurrency(campaign.budget_cents)}</div>
          <div><span className="text-muted-foreground">Max Creators:</span> {campaign.max_creators}</div>
          <div><span className="text-muted-foreground">Content Types:</span> {campaign.content_types?.join(", ") || "Any"}</div>
          <div><span className="text-muted-foreground">Platforms:</span> {campaign.platforms?.join(", ") || "Any"}</div>
        </div>
        {campaign.style_guidelines && (
          <div>
            <h2 className="font-semibold mb-2">Style Guidelines</h2>
            <p className="text-sm text-muted-foreground">{campaign.style_guidelines}</p>
          </div>
        )}
      </div>

      {application ? (
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            {application.status === "accepted" ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-600" />
            )}
            <h2 className="font-semibold">Application {application.status}</h2>
          </div>
          <p className="text-sm text-muted-foreground">Pitch: {application.pitch}</p>
          <p className="text-sm text-muted-foreground">Proposed Rate: {formatCurrency(application.proposed_rate_cents)}</p>
        </div>
      ) : (
        <form onSubmit={handleApply} className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Apply to this Campaign</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Pitch</label>
            <textarea value={pitch} onChange={(e) => setPitch(e.target.value)} required rows={4} placeholder="Why are you a great fit for this campaign?"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Proposed Rate ($)</label>
            <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} required placeholder="150.00"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Submit Application
          </button>
        </form>
      )}
    </div>
  )
}

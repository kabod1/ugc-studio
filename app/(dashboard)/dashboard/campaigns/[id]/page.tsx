"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft, Users, FileVideo, BarChart3, Clock, DollarSign,
  Play, Pause, CheckCircle, Trash2, Loader2
} from "lucide-react"

interface Campaign {
  id: string
  title: string
  description: string | null
  brief_objective: string | null
  brief_dos: string | null
  brief_donts: string | null
  status: string
  budget_cents: number
  content_types: string[] | null
  required_platforms: string[] | null
  max_creators: number | null
  start_date: string | null
  end_date: string | null
  content_deadline: string | null
  created_at: string
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)
  const [contentCount, setContentCount] = useState(0)

  useEffect(() => {
    async function fetchCampaign() {
      const supabase = createClient()
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single()

      if (data) setCampaign(data)

      const { count: appCount } = await supabase
        .from("campaign_applications")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", id)

      const { count: cCount } = await supabase
        .from("content_submissions")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", id)

      setApplicationCount(appCount ?? 0)
      setContentCount(cCount ?? 0)
      setLoading(false)
    }
    fetchCampaign()
  }, [id])

  async function updateStatus(newStatus: string) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to update campaign")
      }
      const updated = await res.json()
      setCampaign(updated)
      toast.success(`Campaign ${newStatus === "active" ? "activated" : newStatus}`)
    } catch (err: any) {
      toast.error(err.message)
    }
    setUpdating(false)
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete campaign")
      toast.success("Campaign deleted")
      router.push("/dashboard/campaigns")
    } catch (err: any) {
      toast.error(err.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!campaign) {
    return <div className="p-12 text-center text-muted-foreground">Campaign not found</div>
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/campaigns" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{campaign.title}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status] || ""}`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-muted-foreground">{campaign.description || "No description"}</p>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          {campaign.status === "draft" && (
            <button
              onClick={() => updateStatus("active")}
              disabled={updating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Activate Campaign
            </button>
          )}
          {campaign.status === "active" && (
            <>
              <button
                onClick={() => updateStatus("paused")}
                disabled={updating}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pause className="h-4 w-4" />}
                Pause
              </button>
              <button
                onClick={() => updateStatus("completed")}
                disabled={updating}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Complete
              </button>
            </>
          )}
          {campaign.status === "paused" && (
            <button
              onClick={() => updateStatus("active")}
              disabled={updating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Resume
            </button>
          )}
          {(campaign.status === "draft" || campaign.status === "paused") && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href={`/dashboard/campaigns/${id}/applications`} className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Users className="h-4 w-4" /> Applications</div>
          <p className="text-2xl font-bold">{applicationCount}</p>
        </Link>
        <Link href="/dashboard/content" className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><FileVideo className="h-4 w-4" /> Content</div>
          <p className="text-2xl font-bold">{contentCount}</p>
        </Link>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><DollarSign className="h-4 w-4" /> Budget</div>
          <p className="text-2xl font-bold">{formatCurrency(campaign.budget_cents)}</p>
        </div>
        <Link href={`/dashboard/campaigns/${id}/analytics`} className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><BarChart3 className="h-4 w-4" /> Analytics</div>
          <p className="text-sm text-muted-foreground mt-1">View performance</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Brief</h2>
          {campaign.brief_objective ? (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Objective: </span><span className="text-muted-foreground">{campaign.brief_objective}</span></div>
              {campaign.brief_dos && <div><span className="font-medium">Do&apos;s: </span><span className="text-muted-foreground">{campaign.brief_dos}</span></div>}
              {campaign.brief_donts && <div><span className="font-medium">Don&apos;ts: </span><span className="text-muted-foreground">{campaign.brief_donts}</span></div>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No brief provided</p>
          )}
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Requirements</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Content Types: </span>
              <span>{campaign.content_types?.join(", ") || "Any"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Platforms: </span>
              <span>{campaign.required_platforms?.join(", ") || "Any"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Max Creators: </span>
              <span>{campaign.max_creators}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Timeline</h2>
          <div className="space-y-3 text-sm">
            {campaign.start_date && <div><Clock className="h-3.5 w-3.5 inline mr-2 text-muted-foreground" />Start: {formatDate(campaign.start_date)}</div>}
            {campaign.content_deadline && <div><Clock className="h-3.5 w-3.5 inline mr-2 text-muted-foreground" />Content Deadline: {formatDate(campaign.content_deadline)}</div>}
            {campaign.end_date && <div><Clock className="h-3.5 w-3.5 inline mr-2 text-muted-foreground" />End: {formatDate(campaign.end_date)}</div>}
          </div>
        </div>

        {campaign.style_guidelines && (
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Style Guidelines</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.style_guidelines}</p>
          </div>
        )}
      </div>
    </div>
  )
}

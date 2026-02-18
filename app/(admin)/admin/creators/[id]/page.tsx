"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Star, Loader2 } from "lucide-react"

export default function AdminCreatorDetailPage() {
  const { id } = useParams()
  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  async function fetchCreator() {
    try {
      const res = await fetch(`/api/admin/data?table=creator_profiles&id=${id}&select=*,profiles(*)`)
      if (res.ok) setCreator(await res.json())
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchCreator() }, [id])

  async function handleVerify() {
    if (!creator) return
    setActing(true)
    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "creator", id, action: "approve" }),
      })
      if (!res.ok) throw new Error()
      toast.success("Creator verified!")
      await fetchCreator()
    } catch { toast.error("Failed to verify") }
    setActing(false)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!creator) return <div className="p-12 text-center"><p>Creator not found</p></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/creators" className="p-2 rounded-md hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{creator.display_name}</h1>
          <p className="text-muted-foreground">{creator.profiles?.email}</p>
        </div>
        {!creator.is_verified && (
          <button onClick={handleVerify} disabled={acting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50">
            <ShieldCheck className="h-4 w-4" /> Verify Creator
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{formatNumber((creator.tiktok_followers || 0) + (creator.instagram_followers || 0) + (creator.youtube_subscribers || 0))}</p>
          <p className="text-sm text-muted-foreground">Total Followers</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{creator.total_campaigns_completed || 0}</p>
          <p className="text-sm text-muted-foreground">Campaigns Completed</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold flex items-center justify-center gap-1">
            {creator.platform_rating > 0 ? <><Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />{creator.platform_rating.toFixed(1)}</> : "—"}
          </p>
          <p className="text-sm text-muted-foreground">Rating</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Profile Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Bio</p><p>{creator.bio || "—"}</p></div>
          <div><p className="text-muted-foreground">Country</p><p>{creator.country || "—"}</p></div>
          <div><p className="text-muted-foreground">Categories</p><p>{creator.categories?.join(", ") || "—"}</p></div>
          <div><p className="text-muted-foreground">Content Types</p><p>{creator.content_types?.join(", ") || "—"}</p></div>
          <div><p className="text-muted-foreground">Base Rate</p><p>{formatCurrency(creator.base_rate_cents)}</p></div>
          <div><p className="text-muted-foreground">Languages</p><p>{creator.languages?.join(", ") || "—"}</p></div>
          <div><p className="text-muted-foreground">TikTok</p><p>{creator.tiktok_handle ? `@${creator.tiktok_handle} (${formatNumber(creator.tiktok_followers || 0)})` : "—"}</p></div>
          <div><p className="text-muted-foreground">Instagram</p><p>{creator.instagram_handle ? `@${creator.instagram_handle} (${formatNumber(creator.instagram_followers || 0)})` : "—"}</p></div>
          <div><p className="text-muted-foreground">YouTube</p><p>{creator.youtube_handle ? `@${creator.youtube_handle} (${formatNumber(creator.youtube_subscribers || 0)})` : "—"}</p></div>
          <div><p className="text-muted-foreground">Tax Form</p><p>{creator.tax_form_type ? `${creator.tax_form_type} (${creator.tax_form_submitted ? "Submitted" : "Pending"})` : "—"}</p></div>
          <div><p className="text-muted-foreground">Age Verified</p><p>{creator.age_verified ? "Yes" : "No"}</p></div>
          <div><p className="text-muted-foreground">Joined</p><p>{formatDate(creator.created_at)}</p></div>
        </div>
      </div>
    </div>
  )
}

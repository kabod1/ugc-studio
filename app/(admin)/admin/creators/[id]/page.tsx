import { createServiceClient } from "@/lib/supabase/server"
import { formatDate, formatNumber, formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, Star } from "lucide-react"

export default async function AdminCreatorDetailPage({ params }: { params: { id: string } }) {
  const svc = createServiceClient()

  const { data: creator } = await svc.from("creator_profiles").select("*").eq("id", params.id).single()
  if (!creator) return <div className="p-12 text-center"><p>Creator not found</p></div>

  const { data: authUser } = await svc.auth.admin.getUserById(creator.user_id)
  const owner = authUser?.user
  const ownerEmail = owner?.email || "—"
  const emailVerified = !!owner?.email_confirmed_at

  const { count: submissionsCount } = await svc
    .from("content_submissions")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", creator.id)

  const totalFollowers =
    (creator.tiktok_followers || 0) +
    (creator.instagram_followers || 0) +
    (creator.youtube_subscribers || 0)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/creators" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{creator.display_name || "Unnamed Creator"}</h1>
          <p className="text-muted-foreground">{ownerEmail}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{formatNumber(totalFollowers)}</p>
          <p className="text-sm text-muted-foreground">Total Followers</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{creator.total_campaigns_completed || 0}</p>
          <p className="text-sm text-muted-foreground">Campaigns Completed</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold flex items-center justify-center gap-1">
            {creator.platform_rating > 0
              ? <><Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />{creator.platform_rating.toFixed(1)}</>
              : "—"}
          </p>
          <p className="text-sm text-muted-foreground">Platform Rating</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Email</p><p className="font-medium">{ownerEmail}</p></div>
          <div>
            <p className="text-muted-foreground">Email Verified</p>
            <p className="font-medium flex items-center gap-1">
              {emailVerified
                ? <><CheckCircle2 className="h-4 w-4 text-green-600" /> Yes</>
                : <><XCircle className="h-4 w-4 text-muted-foreground" /> No</>}
            </p>
          </div>
          <div><p className="text-muted-foreground">Categories</p><p className="font-medium">{creator.categories?.join(", ") || "—"}</p></div>
          <div><p className="text-muted-foreground">Content Types</p><p className="font-medium">{creator.content_types?.join(", ") || "—"}</p></div>
          <div><p className="text-muted-foreground">Base Rate</p><p className="font-medium">{creator.base_rate_cents ? formatCurrency(creator.base_rate_cents) : "—"}</p></div>
          <div><p className="text-muted-foreground">Languages</p><p className="font-medium">{creator.languages?.join(", ") || "—"}</p></div>
          <div><p className="text-muted-foreground">Content Submissions</p><p className="font-medium">{submissionsCount || 0}</p></div>
          <div><p className="text-muted-foreground">Age Verified</p><p className="font-medium">{creator.age_verified ? "Yes" : "No"}</p></div>
          <div><p className="text-muted-foreground">Tax Form</p><p className="font-medium">{creator.tax_form_submitted ? (creator.tax_form_type || "Submitted") : "Not submitted"}</p></div>
          <div><p className="text-muted-foreground">Joined</p><p className="font-medium">{formatDate(creator.created_at)}</p></div>
        </div>

        {(creator.tiktok_handle || creator.instagram_handle || creator.youtube_handle) && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Social Platforms</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {creator.tiktok_handle && (
                <div><p className="text-muted-foreground">TikTok</p><p className="font-medium">@{creator.tiktok_handle} ({formatNumber(creator.tiktok_followers || 0)})</p></div>
              )}
              {creator.instagram_handle && (
                <div><p className="text-muted-foreground">Instagram</p><p className="font-medium">@{creator.instagram_handle} ({formatNumber(creator.instagram_followers || 0)})</p></div>
              )}
              {creator.youtube_handle && (
                <div><p className="text-muted-foreground">YouTube</p><p className="font-medium">@{creator.youtube_handle} ({formatNumber(creator.youtube_subscribers || 0)})</p></div>
              )}
            </div>
          </div>
        )}

        {creator.bio && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Bio</p>
            <p className="mt-1">{creator.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}

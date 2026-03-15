import { createServiceClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Star, Users, Globe, MapPin, BadgeCheck, Crown, Sparkles } from "lucide-react"

export default async function CreatorDetailPage({ params }: { params: { id: string } }) {
  const svc = createServiceClient()

  const { data: creator } = await svc
    .from("creator_profiles")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!creator) return <div className="p-12 text-center text-muted-foreground">Creator not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/creators" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Creator Profile</h1>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
            {creator.display_name?.[0] || "?"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">{creator.display_name}</h2>
              {creator.is_verified && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
              {creator.subscription_tier === "elite" && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                  <Crown className="h-3.5 w-3.5" /> Elite
                </span>
              )}
              {creator.subscription_tier === "pro" && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" /> Pro
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              {creator.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{creator.location}</span>}
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500" />{creator.platform_rating || "N/A"}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{((creator.tiktok_followers || 0) + (creator.instagram_followers || 0) + (creator.youtube_subscribers || 0)).toLocaleString()} followers</span>
            </div>
            {creator.bio && <p className="text-muted-foreground mt-3">{creator.bio}</p>}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatCurrency(creator.base_rate_cents || 0)}</p>
            <p className="text-sm text-muted-foreground">base rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {creator.categories?.map((c: string) => (
              <span key={c} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{c}</span>
            )) || <span className="text-muted-foreground text-sm">No categories</span>}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-3">Platforms</h3>
          <div className="space-y-2">
            {creator.tiktok_handle && <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4" /> TikTok: @{creator.tiktok_handle}</div>}
            {creator.instagram_handle && <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4" /> Instagram: @{creator.instagram_handle}</div>}
            {creator.youtube_handle && <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4" /> YouTube: @{creator.youtube_handle}</div>}
            {!creator.tiktok_handle && !creator.instagram_handle && !creator.youtube_handle && (
              <span className="text-muted-foreground text-sm">No platforms listed</span>
            )}
          </div>
        </div>

        {creator.languages && creator.languages.length > 0 && (
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {creator.languages.map((l: string) => (
                <span key={l} className="px-3 py-1 rounded-full bg-muted text-sm">{l}</span>
              ))}
            </div>
          </div>
        )}

        {creator.portfolio_urls && creator.portfolio_urls.length > 0 && (
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Portfolio</h3>
            <ul className="space-y-1">
              {creator.portfolio_urls.map((url: string, i: number) => (
                <li key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{url}</a></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

import { createServiceClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { formatCurrency, getInitials, formatNumber } from "@/lib/utils"
import Link from "next/link"
import { Star, Users, MapPin, ExternalLink, Sparkles, Instagram, Youtube } from "lucide-react"
import type { Metadata } from "next"

interface CreatorProfilePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: CreatorProfilePageProps): Promise<Metadata> {
  const supabase = createServiceClient()
  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("display_name")
    .eq("id", params.id)
    .single()

  if (!creator) {
    return { title: "Creator Not Found - UGC Studio" }
  }

  return {
    title: `${creator.display_name} - UGC Studio Creator`,
  }
}

export default async function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  const supabase = createServiceClient()

  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("*, profiles(full_name, avatar_url)")
    .eq("id", params.id)
    .single()

  if (!creator) {
    notFound()
  }

  const profile = creator.profiles as any
  const displayName = creator.display_name || profile?.full_name || "Creator"
  const initials = getInitials(displayName)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            UGC Studio
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{displayName}</h1>
                  {creator.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      <Sparkles className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                {creator.location && (
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {creator.location}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            {creator.bio && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-semibold mb-2">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{creator.bio}</p>
              </div>
            )}

            {/* Categories */}
            {creator.categories && (creator.categories as string[]).length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-semibold mb-3">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {(creator.categories as string[]).map((category: string) => (
                    <span
                      key={category}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(creator.tiktok_handle || creator.instagram_handle || creator.youtube_handle) && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-semibold mb-3">Social Media</h2>
                <div className="space-y-3">
                  {creator.tiktok_handle && (
                    <a
                      href={`https://tiktok.com/@${creator.tiktok_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.83 4.83 0 01-1-.15z" />
                      </svg>
                      @{creator.tiktok_handle}
                    </a>
                  )}
                  {creator.instagram_handle && (
                    <a
                      href={`https://instagram.com/${creator.instagram_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      @{creator.instagram_handle}
                    </a>
                  )}
                  {creator.youtube_handle && (
                    <a
                      href={`https://youtube.com/@${creator.youtube_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                      @{creator.youtube_handle}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* CTA */}
            <div className="bg-card border rounded-lg p-6 text-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Work with {displayName}
              </Link>
            </div>

            {/* Stats */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Stats</h2>
              <div className="space-y-4">
                {creator.avg_rating != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Avg Rating
                    </span>
                    <span className="font-semibold">{Number(creator.avg_rating).toFixed(1)}</span>
                  </div>
                )}
                {creator.follower_count != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Followers
                    </span>
                    <span className="font-semibold">{formatNumber(creator.follower_count)}</span>
                  </div>
                )}
                {creator.total_campaigns_completed != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Campaigns
                    </span>
                    <span className="font-semibold">{creator.total_campaigns_completed}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rate */}
            {creator.hourly_rate != null && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-semibold mb-2">Hourly Rate</h2>
                <p className="text-2xl font-bold text-primary">{formatCurrency(creator.hourly_rate)}</p>
              </div>
            )}

            {/* Portfolio */}
            {creator.portfolio_url && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-semibold mb-2">Portfolio</h2>
                <a
                  href={creator.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Portfolio
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

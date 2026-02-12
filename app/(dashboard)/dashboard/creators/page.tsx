"use client"

import { useState, useEffect, useCallback } from "react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import {
  Search, Star, Users, BadgeCheck, Crown, Sparkles,
  Filter, SlidersHorizontal, Loader2, Brain, X,
} from "lucide-react"
import { CATEGORIES, CONTENT_TYPES, PLATFORMS } from "@/lib/constants"

function CreatorBadge({ tier, isVerified }: { tier?: string; isVerified?: boolean }) {
  return (
    <span className="flex items-center gap-1">
      {isVerified && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">
          <BadgeCheck className="h-3 w-3" /> Verified
        </span>
      )}
      {tier === "elite" && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold">
          <Crown className="h-3 w-3" /> Elite
        </span>
      )}
      {tier === "pro" && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold">
          <Sparkles className="h-3 w-3" /> Pro
        </span>
      )}
    </span>
  )
}

interface Filters {
  search: string
  category: string
  platform: string
  contentType: string
  location: string
  minRating: string
  verifiedOnly: boolean
  sortBy: string
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    platform: "",
    contentType: "",
    location: "",
    minRating: "",
    verifiedOnly: false,
    sortBy: "rating",
  })

  // AI Match state
  const [aiMode, setAiMode] = useState(false)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  // Fetch campaigns for AI match
  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/campaigns?status=active")
        if (res.ok) {
          const data = await res.json()
          setCampaigns(data.campaigns || [])
        }
      } catch {}
    }
    fetchCampaigns()
  }, [])

  const fetchCreators = useCallback(async (aiCampaignId?: string) => {
    if (aiCampaignId) setAiLoading(true)
    else setLoading(true)

    try {
      const params = new URLSearchParams()
      if (filters.search) params.set("search", filters.search)
      if (filters.category) params.set("category", filters.category)
      if (filters.platform) params.set("platform", filters.platform)
      if (filters.contentType) params.set("content_type", filters.contentType)
      if (filters.location) params.set("location", filters.location)
      if (filters.minRating) params.set("min_rating", filters.minRating)
      if (filters.verifiedOnly) params.set("verified_only", "true")
      params.set("sort_by", filters.sortBy)

      if (aiCampaignId) {
        params.set("ai_match", "true")
        params.set("campaign_id", aiCampaignId)
      }

      const res = await fetch(`/api/creators?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setCreators(data)
      }
    } catch {
      console.error("Failed to fetch creators")
    } finally {
      setLoading(false)
      setAiLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const timeout = setTimeout(() => fetchCreators(), 300)
    return () => clearTimeout(timeout)
  }, [fetchCreators])

  function handleAiMatch() {
    if (selectedCampaign) {
      fetchCreators(selectedCampaign)
    }
  }

  const activeFilterCount = [
    filters.category, filters.platform, filters.contentType,
    filters.location, filters.minRating, filters.verifiedOnly,
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Discover Creators</h1>
        <p className="text-muted-foreground">Find the perfect creators for your campaigns</p>
      </div>

      {/* Search + Filter Toggle + AI Match */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search creators..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 h-10 rounded-md border text-sm font-medium hover:bg-muted ${
            showFilters ? "bg-muted border-primary" : ""
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setAiMode(!aiMode)}
          className={`inline-flex items-center gap-2 px-4 h-10 rounded-md border text-sm font-medium hover:bg-muted ${
            aiMode ? "bg-purple-50 border-purple-300 text-purple-700" : ""
          }`}
        >
          <Brain className="h-4 w-4" />
          AI Match
        </button>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="rating">Sort by Rating</option>
          <option value="followers">Sort by Followers</option>
          <option value="rate">Sort by Rate (Low)</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* AI Match Panel */}
      {aiMode && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">AI Creator Matching</h3>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Select a campaign and our AI will score creators based on compatibility.
          </p>
          <div className="flex gap-3">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="flex-1 h-10 rounded-md border border-purple-300 bg-white px-3 text-sm"
            >
              <option value="">Select a campaign...</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <button
              onClick={handleAiMatch}
              disabled={!selectedCampaign || aiLoading}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              Find Matches
            </button>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Filter className="h-4 w-4" /> Advanced Filters
            </h3>
            <button
              onClick={() => setFilters((f) => ({
                ...f, category: "", platform: "", contentType: "",
                location: "", minRating: "", verifiedOnly: false,
              }))}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">All</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => setFilters((f) => ({ ...f, platform: e.target.value }))}
                className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">All</option>
                {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Content Type</label>
              <select
                value={filters.contentType}
                onChange={(e) => setFilters((f) => ({ ...f, contentType: e.target.value }))}
                className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">All</option>
                {CONTENT_TYPES.map((ct) => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
              <input
                type="text"
                placeholder="e.g. Germany"
                value={filters.location}
                onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))}
                className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">Any</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 h-9 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters((f) => ({ ...f, verifiedOnly: e.target.checked }))}
                  className="rounded border-input"
                />
                Verified only
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : creators && creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((creator) => (
            <Link
              key={creator.id}
              href={`/dashboard/creators/${creator.id}`}
              className="bg-card border rounded-lg p-5 hover:border-primary/50 transition-colors relative"
            >
              {/* AI Match Score Badge */}
              {creator.match_score != null && (
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                  creator.match_score >= 80 ? "bg-green-100 text-green-700" :
                  creator.match_score >= 60 ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {creator.match_score}% match
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                  {creator.display_name?.[0] || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold">{creator.display_name}</h3>
                    <CreatorBadge tier={creator.subscription_tier} isVerified={creator.is_verified} />
                  </div>
                  <p className="text-sm text-muted-foreground">{creator.country || "Remote"}</p>
                </div>
              </div>
              {creator.categories && creator.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {creator.categories.slice(0, 3).map((c: string) => (
                    <span key={c} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{c}</span>
                  ))}
                </div>
              )}
              {/* AI Match Reasons */}
              {creator.match_reasons && creator.match_reasons.length > 0 && (
                <p className="text-xs text-green-700 mb-2 line-clamp-2">
                  {creator.match_reasons[0]}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-500" /> {creator.avg_rating || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {(creator.follower_count || 0).toLocaleString()}
                </span>
                <span>{formatCurrency(creator.hourly_rate_cents || 0)}/hr</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
          No creators found. Try adjusting your filters.
        </div>
      )}
    </div>
  )
}

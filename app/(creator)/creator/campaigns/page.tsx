"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Megaphone, ArrowRight, Filter, X, DollarSign, Calendar, Building2 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Campaign {
  id: string
  title: string
  description: string | null
  budget_cents: number
  content_types: string[] | null
  required_platforms: string[] | null
  content_deadline: string | null
  max_creators: number | null
  created_at: string
  brands: { id: string; company_name: string; logo_url: string | null } | null
}

const CONTENT_TYPES = ["UGC Video", "Photo", "Reel", "TikTok", "Story", "Review", "Unboxing", "Tutorial"]
const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Facebook", "Twitter", "LinkedIn"]
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "budget_high", label: "Highest Budget" },
  { value: "budget_low", label: "Lowest Budget" },
  { value: "deadline", label: "Deadline Soon" },
]

export default function BrowseCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [contentType, setContentType] = useState("")
  const [platform, setPlatform] = useState("")
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [sort, setSort] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ status: "active" })
    if (search) params.set("search", search)
    if (contentType) params.set("content_type", contentType)
    if (platform) params.set("platform", platform)
    if (minBudget) params.set("min_budget", String(parseInt(minBudget) * 100))
    if (maxBudget) params.set("max_budget", String(parseInt(maxBudget) * 100))
    params.set("sort", sort)

    const res = await fetch(`/api/campaigns/browse?${params}`)
    const data = await res.json()
    setCampaigns(data.campaigns || [])
    setLoading(false)
  }, [search, contentType, platform, minBudget, maxBudget, sort])

  useEffect(() => {
    const t = setTimeout(fetchCampaigns, 300)
    return () => clearTimeout(t)
  }, [fetchCampaigns])

  const activeFilters = [contentType, platform, minBudget, maxBudget].filter(Boolean).length

  function clearFilters() {
    setContentType("")
    setPlatform("")
    setMinBudget("")
    setMaxBudget("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Browse Campaigns</h1>
        <p className="text-muted-foreground">Find campaigns that match your skills</p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="hidden sm:flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 h-10 px-4 rounded-md border text-sm font-medium hover:bg-muted transition-colors ${showFilters ? "bg-muted" : ""}`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilters > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Filters</h3>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Content Type</label>
              <select value={contentType} onChange={e => setContentType(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="">Any</option>
                {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="">Any</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Min Budget (€)</label>
              <input type="number" value={minBudget} onChange={e => setMinBudget(e.target.value)}
                placeholder="0" min="0"
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Max Budget (€)</label>
              <input type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)}
                placeholder="No limit" min="0"
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
          </div>
          {/* Mobile sort */}
          <div className="sm:hidden space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sort By</label>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {contentType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {contentType}
              <button onClick={() => setContentType("")}><X className="h-3 w-3" /></button>
            </span>
          )}
          {platform && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {platform}
              <button onClick={() => setPlatform("")}><X className="h-3 w-3" /></button>
            </span>
          )}
          {minBudget && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Min €{minBudget}
              <button onClick={() => setMinBudget("")}><X className="h-3 w-3" /></button>
            </span>
          )}
          {maxBudget && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Max €{maxBudget}
              <button onClick={() => setMaxBudget("")}><X className="h-3 w-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid gap-4">
          {campaigns.map(c => (
            <Link key={c.id} href={`/creator/campaigns/${c.id}`}
              className="bg-card border rounded-xl p-5 hover:border-primary/50 hover:shadow-sm transition-all block group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Brand logo */}
                  {c.brands?.logo_url ? (
                    <img src={c.brands.logo_url} alt={c.brands.company_name}
                      className="h-10 w-10 rounded-lg border object-contain bg-white p-1 shrink-0 mt-0.5" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg border bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                    {c.brands && (
                      <Link href={`/creator/brands/${c.brands.id}`}
                        onClick={e => e.stopPropagation()}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline">
                        {c.brands.company_name}
                      </Link>
                    )}
                    {c.description && (
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{c.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" /> {formatCurrency(c.budget_cents)}
                      </span>
                      {c.content_deadline && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Due {formatDate(c.content_deadline)}
                        </span>
                      )}
                    </div>
                    {c.content_types && c.content_types.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.content_types.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-xl p-12 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No campaigns found</h3>
          <p className="text-muted-foreground mt-1">
            {activeFilters > 0 ? "Try adjusting your filters" : "Check back later for new opportunities"}
          </p>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline">Clear filters</button>
          )}
        </div>
      )}
    </div>
  )
}

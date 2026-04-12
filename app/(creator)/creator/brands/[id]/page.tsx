"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Globe, Building2, Users, Megaphone, CheckCircle,
  Loader2, Calendar, DollarSign, Tag, ExternalLink
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Brand {
  id: string
  company_name: string
  industry: string | null
  description: string | null
  logo_url: string | null
  website: string | null
  brand_colors: string[]
  tone_of_voice: string | null
  created_at: string
}

interface Campaign {
  id: string
  title: string
  description: string | null
  budget_cents: number
  content_types: string[] | null
  required_platforms: string[] | null
  content_deadline: string | null
  max_creators: number | null
}

interface Stats {
  completed_campaigns: number
  total_creators: number
  active_campaigns: number
}

export default function BrandProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [brand, setBrand] = useState<Brand | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/brands/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { router.push("/creator/brands"); return }
        setBrand(d.brand)
        setCampaigns(d.active_campaigns || [])
        setStats(d.stats)
      })
      .catch(() => router.push("/creator/brands"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!brand) return null

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link href="/creator/brands" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Brands
      </Link>

      {/* Header */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-start gap-5">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.company_name}
              className="h-20 w-20 rounded-xl border object-contain bg-white p-2 shrink-0" />
          ) : (
            <div className="h-20 w-20 rounded-xl border bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{brand.company_name}</h1>
                {brand.industry && (
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Tag className="h-3.5 w-3.5" /> {brand.industry}
                  </span>
                )}
              </div>
              {brand.website && (
                <a href={brand.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm hover:bg-muted shrink-0">
                  <Globe className="h-3.5 w-3.5" /> Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {brand.description && (
              <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{brand.description}</p>
            )}

            {/* Brand colors */}
            {brand.brand_colors?.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3">
                {brand.brand_colors.map(c => (
                  <div key={c} title={c} className="h-5 w-5 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.active_campaigns}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Active Campaigns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.completed_campaigns}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total_creators}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Creators Hired</p>
            </div>
          </div>
        )}
      </div>

      {/* Tone of Voice */}
      {brand.tone_of_voice && (
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-2">Brand Voice</h2>
          <p className="text-sm text-muted-foreground">{brand.tone_of_voice}</p>
        </div>
      )}

      {/* Active Campaigns */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Active Campaigns
          {campaigns.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">({campaigns.length})</span>
          )}
        </h2>

        {campaigns.length > 0 ? (
          <div className="space-y-3">
            {campaigns.map(c => (
              <Link key={c.id} href={`/creator/campaigns/${c.id}`}
                className="bg-card border rounded-xl p-5 hover:border-primary/50 transition-colors block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{c.title}</h3>
                    {c.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3.5 w-3.5" /> {formatCurrency(c.budget_cents)} per creator
                      </span>
                      {c.max_creators && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" /> Up to {c.max_creators} creators
                        </span>
                      )}
                      {c.content_deadline && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    Apply →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-card border rounded-xl p-10 text-center">
            <Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No active campaigns right now</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for new opportunities</p>
          </div>
        )}
      </div>

      {/* On the platform since */}
      <p className="text-xs text-muted-foreground text-center pb-4">
        <CheckCircle className="h-3.5 w-3.5 inline mr-1 text-green-500" />
        On UGC Studio since {new Date(brand.created_at).toLocaleDateString("en-IE", { month: "long", year: "numeric" })}
      </p>
    </div>
  )
}

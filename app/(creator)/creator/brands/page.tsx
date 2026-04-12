"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Building2, Megaphone, Loader2, Tag, Globe } from "lucide-react"

interface Brand {
  id: string
  company_name: string
  industry: string | null
  description: string | null
  logo_url: string | null
  website: string | null
  brand_colors: string[]
  active_campaigns: number
}

const INDUSTRIES = [
  "Beauty", "Fashion", "Tech", "Food & Beverage", "Fitness", "Travel",
  "Lifestyle", "Gaming", "Education", "Finance", "Health", "Home & Garden",
  "Pets", "Entertainment", "Automotive", "Sports",
]

export default function BrandDiscoveryPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [industry, setIndustry] = useState("")

  const fetchBrands = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (industry) params.set("industry", industry)
    const res = await fetch(`/api/brands?${params}`)
    const data = await res.json()
    setBrands(data.brands || [])
    setLoading(false)
  }, [search, industry])

  useEffect(() => {
    const t = setTimeout(fetchBrands, 300)
    return () => clearTimeout(t)
  }, [fetchBrands])

  const activeBrands = brands.filter(b => b.active_campaigns > 0)
  const allBrands = brands.filter(b => b.active_campaigns === 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Discover Brands</h1>
        <p className="text-muted-foreground">Browse brands looking for UGC creators</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          value={industry}
          onChange={e => setIndustry(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-48"
        >
          <option value="">All Industries</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">No brands found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Brands with active campaigns */}
          {activeBrands.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Megaphone className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Actively Hiring</h2>
                <span className="text-sm text-muted-foreground">({activeBrands.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeBrands.map(brand => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            </div>
          )}

          {/* All other brands */}
          {allBrands.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-muted-foreground">Other Brands</h2>
                <span className="text-sm text-muted-foreground">({allBrands.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allBrands.map(brand => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/creator/brands/${brand.id}`}
      className="bg-card border rounded-xl p-5 hover:border-primary/50 hover:shadow-sm transition-all block group">
      <div className="flex items-start gap-3">
        {brand.logo_url ? (
          <img src={brand.logo_url} alt={brand.company_name}
            className="h-12 w-12 rounded-lg border object-contain bg-white p-1 shrink-0" />
        ) : (
          <div className="h-12 w-12 rounded-lg border bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {brand.company_name}
          </h3>
          {brand.industry && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Tag className="h-3 w-3" /> {brand.industry}
            </p>
          )}
        </div>
      </div>

      {brand.description && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
          {brand.description}
        </p>
      )}

      {/* Brand colors preview */}
      {brand.brand_colors?.length > 0 && (
        <div className="flex gap-1 mt-3">
          {brand.brand_colors.slice(0, 5).map(c => (
            <div key={c} className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: c }} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        {brand.active_campaigns > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <Megaphone className="h-3 w-3" />
            {brand.active_campaigns} active {brand.active_campaigns === 1 ? "campaign" : "campaigns"}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">No active campaigns</span>
        )}
        <span className="text-xs text-primary font-medium group-hover:underline">View →</span>
      </div>
    </Link>
  )
}

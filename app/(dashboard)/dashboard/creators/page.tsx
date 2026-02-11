import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Search, Star, Users } from "lucide-react"

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from("creator_profiles")
    .select("*, profiles(full_name, avatar_url)")
    .eq("is_verified", true)
    .order("avg_rating", { ascending: false })

  if (searchParams.search) {
    query = query.ilike("display_name", `%${searchParams.search}%`)
  }
  if (searchParams.category) {
    query = query.contains("categories", [searchParams.category])
  }

  const { data: creators } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Discover Creators</h1>
        <p className="text-muted-foreground">Find the perfect creators for your campaigns</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <form>
          <input
            type="text"
            name="search"
            placeholder="Search creators..."
            defaultValue={searchParams.search}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form>
      </div>

      {creators && creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((creator) => (
            <Link
              key={creator.id}
              href={`/dashboard/creators/${creator.id}`}
              className="bg-card border rounded-lg p-5 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                  {creator.display_name?.[0] || "?"}
                </div>
                <div>
                  <h3 className="font-semibold">{creator.display_name}</h3>
                  <p className="text-sm text-muted-foreground">{creator.location || "Remote"}</p>
                </div>
              </div>
              {creator.categories && creator.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {creator.categories.slice(0, 3).map((c: string) => (
                    <span key={c} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{c}</span>
                  ))}
                </div>
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
          No creators found. Try adjusting your search.
        </div>
      )}
    </div>
  )
}

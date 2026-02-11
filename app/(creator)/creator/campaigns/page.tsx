import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Search, Megaphone, ArrowRight } from "lucide-react"

export default async function BrowseCampaignsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from("campaigns")
    .select("*, brands(company_name)")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (searchParams.search) {
    query = query.ilike("title", `%${searchParams.search}%`)
  }

  const { data: campaigns } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Browse Campaigns</h1>
        <p className="text-muted-foreground">Find campaigns that match your skills</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <form>
          <input type="text" name="search" placeholder="Search campaigns..." defaultValue={searchParams.search}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </form>
      </div>

      {campaigns && campaigns.length > 0 ? (
        <div className="grid gap-4">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/creator/campaigns/${c.id}`}
              className="bg-card border rounded-lg p-5 hover:border-primary/50 transition-colors block">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{(c.brands as any)?.company_name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span>Budget: {formatCurrency(c.budget_cents)}</span>
                {c.content_types?.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{t}</span>
                ))}
                {c.content_deadline && <span>Deadline: {formatDate(c.content_deadline)}</span>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No active campaigns</h3>
          <p className="text-muted-foreground mt-1">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Eye, MousePointerClick, ShoppingCart, DollarSign } from "lucide-react"

export default async function CampaignAnalyticsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("title")
    .eq("id", params.id)
    .single()

  const { data: analytics } = await supabase
    .from("campaign_analytics")
    .select("*")
    .eq("campaign_id", params.id)
    .order("date", { ascending: false })
    .limit(30)

  const totals = analytics?.reduce(
    (acc, a) => ({
      views: acc.views + (a.views || 0),
      clicks: acc.clicks + (a.clicks || 0),
      conversions: acc.conversions + (a.conversions || 0),
      spend: acc.spend + (a.spend_cents || 0),
    }),
    { views: 0, clicks: 0, conversions: 0, spend: 0 }
  ) || { views: 0, clicks: 0, conversions: 0, spend: 0 }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/campaigns/${params.id}`} className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Campaign Analytics</h1>
          <p className="text-muted-foreground">{campaign?.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Eye className="h-4 w-4" /> Views</div>
          <p className="text-2xl font-bold mt-1">{totals.views.toLocaleString()}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><MousePointerClick className="h-4 w-4" /> Clicks</div>
          <p className="text-2xl font-bold mt-1">{totals.clicks.toLocaleString()}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><ShoppingCart className="h-4 w-4" /> Conversions</div>
          <p className="text-2xl font-bold mt-1">{totals.conversions.toLocaleString()}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><DollarSign className="h-4 w-4" /> Spend</div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totals.spend)}</p>
        </div>
      </div>

      {analytics && analytics.length > 0 ? (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-right p-3 font-medium">Views</th>
              <th className="text-right p-3 font-medium">Clicks</th>
              <th className="text-right p-3 font-medium">Conversions</th>
              <th className="text-right p-3 font-medium">Spend</th>
            </tr></thead>
            <tbody>
              {analytics.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="p-3">{formatDate(a.date)}</td>
                  <td className="p-3 text-right">{a.views?.toLocaleString() || 0}</td>
                  <td className="p-3 text-right">{a.clicks?.toLocaleString() || 0}</td>
                  <td className="p-3 text-right">{a.conversions?.toLocaleString() || 0}</td>
                  <td className="p-3 text-right">{formatCurrency(a.spend_cents || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
          No analytics data yet. Data will appear once the campaign is active and generating traffic.
        </div>
      )}
    </div>
  )
}

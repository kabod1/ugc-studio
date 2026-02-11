import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { BarChart3, Megaphone, FileVideo, DollarSign, Star } from "lucide-react"

export default async function AnalyticsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", user!.id)
    .single()

  const { count: campaignCount } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand!.id)

  const { count: contentCount } = await supabase
    .from("content_submissions")
    .select("id", { count: "exact", head: true })

  const { data: payments } = await supabase
    .from("payments")
    .select("amount_cents")
    .eq("brand_id", brand!.id)
    .eq("status", "completed")

  const totalSpend = payments?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your campaign performance and ROI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Megaphone className="h-4 w-4" /> Total Campaigns</div>
          <p className="text-2xl font-bold mt-1">{campaignCount || 0}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><FileVideo className="h-4 w-4" /> Content Pieces</div>
          <p className="text-2xl font-bold mt-1">{contentCount || 0}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><DollarSign className="h-4 w-4" /> Total Spend</div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalSpend)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Star className="h-4 w-4" /> Avg Quality</div>
          <p className="text-2xl font-bold mt-1">N/A</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-12 text-center">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg">Charts Coming Soon</h3>
        <p className="text-muted-foreground mt-1">Performance charts and trends will be displayed here once you have active campaigns with data</p>
      </div>
    </div>
  )
}

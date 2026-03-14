import { createServiceClient as createClient } from "@/lib/supabase/server"
import { formatDate, formatCurrency } from "@/lib/utils"
import { SUBSCRIPTION_TIERS } from "@/lib/constants"
import { Sliders } from "lucide-react"

export default async function AdminSubscriptionsPage() {
  const supabase = createClient()
  const { data: brands } = await supabase
    .from("brands")
    .select("id, company_name, subscription_tier, subscription_expires_at, profiles(email)")
    .order("created_at", { ascending: false })

  const tierCounts = { free: 0, brand: 0, agency: 0, enterprise: 0 }
  brands?.forEach((b: any) => { if (b.subscription_tier in tierCounts) tierCounts[b.subscription_tier as keyof typeof tierCounts]++ })

  const mrr = Object.entries(tierCounts).reduce((sum, [tier, count]) => {
    return sum + (SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS]?.price || 0) * count
  }, 0)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Subscriptions</h1><p className="text-muted-foreground">Subscription management and MRR tracking</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-card border rounded-lg p-4"><p className="text-sm text-muted-foreground">MRR</p><p className="text-xl font-bold text-green-600">{formatCurrency(mrr)}</p></div>
        {Object.entries(tierCounts).map(([tier, count]) => (
          <div key={tier} className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground capitalize">{tier}</p>
            <p className="text-xl font-bold">{count}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Brand</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tier</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Expires</th>
          </tr></thead>
          <tbody className="divide-y">
            {brands?.map((b: any) => (
              <tr key={b.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium text-sm">{b.company_name}</td>
                <td className="p-4 text-sm text-muted-foreground">{b.profiles?.email}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{b.subscription_tier}</span></td>
                <td className="p-4 text-sm">{formatCurrency(SUBSCRIPTION_TIERS[b.subscription_tier as keyof typeof SUBSCRIPTION_TIERS]?.price || 0)}/mo</td>
                <td className="p-4 text-sm text-muted-foreground">{b.subscription_expires_at ? formatDate(b.subscription_expires_at) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

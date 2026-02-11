import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Megaphone } from "lucide-react"

export default async function AdminCampaignsPage() {
  const supabase = createClient()
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*, brands(company_name)")
    .order("created_at", { ascending: false })
    .limit(100)

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800", active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800", completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Campaigns</h1><p className="text-muted-foreground">All campaigns across the platform</p></div>
      <div className="bg-card border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Brand</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Budget</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
            <th className="p-4"></th>
          </tr></thead>
          <tbody className="divide-y">
            {campaigns?.map((c: any) => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium text-sm">{c.title}</td>
                <td className="p-4 text-sm text-muted-foreground">{c.brands?.company_name}</td>
                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || ""}`}>{c.status}</span></td>
                <td className="p-4 text-sm">{formatCurrency(c.budget_cents)}</td>
                <td className="p-4 text-sm text-muted-foreground">{formatDate(c.created_at)}</td>
                <td className="p-4"><Link href={`/admin/campaigns/${c.id}`} className="text-primary hover:underline text-sm">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!campaigns || campaigns.length === 0) && <div className="p-12 text-center"><Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p>No campaigns</p></div>}
      </div>
    </div>
  )
}

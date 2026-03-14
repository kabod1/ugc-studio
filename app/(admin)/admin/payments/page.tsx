import { createServiceClient as createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CreditCard, DollarSign, Clock, CheckCircle2 } from "lucide-react"

export default async function AdminPaymentsPage() {
  const supabase = createClient()
  const { data: payments } = await supabase
    .from("payments")
    .select("*, creator_profiles(display_name), campaigns(title), brands(company_name)")
    .order("created_at", { ascending: false })
    .limit(100)

  const totalVolume = payments?.reduce((s, p) => s + p.amount_cents, 0) || 0
  const totalFees = payments?.filter((p: any) => p.status === "released").reduce((s, p) => s + (p.platform_fee_cents || 0), 0) || 0
  const inEscrow = payments?.filter((p: any) => p.status === "in_escrow").reduce((s, p) => s + p.amount_cents, 0) || 0
  const pending = payments?.filter((p: any) => p.status === "pending").reduce((s, p) => s + p.amount_cents, 0) || 0

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800", in_escrow: "bg-blue-100 text-blue-800",
    released: "bg-green-100 text-green-800", refunded: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Payments</h1><p className="text-muted-foreground">Platform-wide payment oversight</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4"><p className="text-sm text-muted-foreground">Total Volume</p><p className="text-xl font-bold">{formatCurrency(totalVolume)}</p></div>
        <div className="bg-card border rounded-lg p-4"><p className="text-sm text-muted-foreground">Platform Fees</p><p className="text-xl font-bold text-green-600">{formatCurrency(totalFees)}</p></div>
        <div className="bg-card border rounded-lg p-4"><p className="text-sm text-muted-foreground">In Escrow</p><p className="text-xl font-bold text-blue-600">{formatCurrency(inEscrow)}</p></div>
        <div className="bg-card border rounded-lg p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-xl font-bold text-yellow-600">{formatCurrency(pending)}</p></div>
      </div>
      <div className="bg-card border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Creator</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Brand</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fee</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
          </tr></thead>
          <tbody className="divide-y">
            {payments?.map((p: any) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="p-4 text-sm">{p.creator_profiles?.display_name || "—"}</td>
                <td className="p-4 text-sm">{p.brands?.company_name || "—"}</td>
                <td className="p-4 text-sm text-muted-foreground">{p.campaigns?.title || "—"}</td>
                <td className="p-4 text-sm font-medium">{formatCurrency(p.amount_cents)}</td>
                <td className="p-4 text-sm text-green-600">{formatCurrency(p.platform_fee_cents || 0)}</td>
                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || ""}`}>{p.status?.replace("_", " ")}</span></td>
                <td className="p-4 text-sm text-muted-foreground">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!payments || payments.length === 0) && <div className="p-12 text-center"><CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p>No payments yet</p></div>}
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ScrollText } from "lucide-react"

export default async function CreatorContractsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single()

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*, campaigns(title), brands(company_name)")
    .eq("creator_id", creator!.id)
    .order("created_at", { ascending: false })

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    signed: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contracts</h1>
        <p className="text-muted-foreground">Review and sign your contracts</p>
      </div>

      {contracts && contracts.length > 0 ? (
        <div className="grid gap-4">
          {contracts.map((c) => (
            <div key={c.id} className="bg-card border rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{(c.campaigns as any)?.title}</h3>
                  <p className="text-sm text-muted-foreground">{(c.brands as any)?.company_name} &middot; {formatCurrency(c.total_value_cents)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || ""}`}>
                    {c.status}
                  </span>
                  {c.status === "sent" && !c.creator_signed_at && (
                    <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                      Sign Contract
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Created: {formatDate(c.created_at)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No contracts yet</h3>
          <p className="text-muted-foreground mt-1">Contracts will appear here once you&apos;re accepted to campaigns</p>
        </div>
      )}
    </div>
  )
}

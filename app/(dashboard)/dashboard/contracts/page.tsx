import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ScrollText } from "lucide-react"

export default async function ContractsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", user!.id)
    .single()

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*, campaigns(title), creator_profiles(display_name)")
    .eq("brand_id", brand!.id)
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
        <p className="text-muted-foreground">Manage creator contracts and agreements</p>
      </div>

      {contracts && contracts.length > 0 ? (
        <div className="grid gap-4">
          {contracts.map((c) => (
            <div key={c.id} className="bg-card border rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{(c.campaigns as any)?.title} — {(c.creator_profiles as any)?.display_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Value: {formatCurrency(c.total_value_cents)} &middot; Created: {formatDate(c.created_at)}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || ""}`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No contracts yet</h3>
          <p className="text-muted-foreground mt-1">Contracts are created when you accept a creator application</p>
        </div>
      )}
    </div>
  )
}

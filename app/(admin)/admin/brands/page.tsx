import { createServiceClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Building2 } from "lucide-react"

export default async function AdminBrandsPage() {
  const svc = createServiceClient()

  const { data: brands } = await svc
    .from("brands")
    .select("id, company_name, industry, subscription_tier, created_at, user_id")
    .order("created_at", { ascending: false })

  // Get owner emails from auth
  const { data: authData } = await svc.auth.admin.listUsers({ perPage: 200 })
  const userMap = new Map((authData?.users || []).map((u: any) => [u.id, u.email || u.user_metadata?.full_name || u.id]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brands</h1>
        <p className="text-muted-foreground">All registered brands on the platform</p>
      </div>
      <div className="bg-card border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Owner</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Industry</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Subscription</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {brands?.map((b: any) => (
              <tr key={b.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium text-sm">{b.company_name}</td>
                <td className="p-4 text-sm text-muted-foreground">{userMap.get(b.user_id) || "—"}</td>
                <td className="p-4 text-sm">{b.industry || "—"}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{b.subscription_tier}</span></td>
                <td className="p-4 text-sm text-muted-foreground">{formatDate(b.created_at)}</td>
                <td className="p-4"><Link href={`/admin/brands/${b.id}`} className="text-primary hover:underline text-sm">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!brands || brands.length === 0) && (
          <div className="p-12 text-center"><Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p>No brands yet</p></div>
        )}
      </div>
    </div>
  )
}

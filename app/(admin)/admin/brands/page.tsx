import { createServiceClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Building2 } from "lucide-react"

export default async function AdminBrandsPage() {
  const svc = createServiceClient()

  // Pull from auth (source of truth) + join brands table for extra details
  const [{ data: authData }, { data: brandsData }] = await Promise.all([
    svc.auth.admin.listUsers({ perPage: 1000 }),
    svc.from("brands").select("id, company_name, industry, subscription_tier, created_at, user_id"),
  ])

  const brandsMap = new Map((brandsData || []).map((b: any) => [b.user_id, b]))

  // Show all auth users whose role is "brand"
  const brands = (authData?.users || [])
    .filter((u: any) => (u.user_metadata?.role || "brand") === "brand" && u.user_metadata?.role !== "creator" && u.user_metadata?.role !== "admin")
    .map((u: any) => {
      const row = brandsMap.get(u.id)
      return {
        id: row?.id || u.id,
        brand_id: row?.id,
        user_id: u.id,
        company_name: row?.company_name || u.user_metadata?.company_name || u.user_metadata?.full_name || u.email || "—",
        industry: row?.industry || "—",
        subscription_tier: row?.subscription_tier || "free",
        email: u.email || "—",
        created_at: u.created_at,
      }
    })
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

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
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Owner Email</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Industry</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Subscription</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {brands.map((b: any) => (
              <tr key={b.user_id} className="hover:bg-muted/30">
                <td className="p-4 font-medium text-sm">{b.company_name}</td>
                <td className="p-4 text-sm text-muted-foreground">{b.email}</td>
                <td className="p-4 text-sm">{b.industry}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{b.subscription_tier}</span></td>
                <td className="p-4 text-sm text-muted-foreground">{formatDate(b.created_at)}</td>
                <td className="p-4">
                  {b.brand_id
                    ? <Link href={`/admin/brands/${b.brand_id}`} className="text-primary hover:underline text-sm">View</Link>
                    : <Link href={`/admin/users/${b.user_id}`} className="text-primary hover:underline text-sm">View</Link>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {brands.length === 0 && (
          <div className="p-12 text-center"><Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p>No brands yet</p></div>
        )}
      </div>
    </div>
  )
}

import { createServiceClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Building2 } from "lucide-react"

export default async function AdminBrandsPage() {
  const svc = createServiceClient()

  // Query both sources in parallel
  const brandsTablePromise = svc
    .from("brands")
    .select("id, company_name, industry, subscription_tier, created_at, user_id")

  const authUsersPromise = svc.auth.admin.listUsers({ perPage: 1000 })

  const [{ data: brandsData }, { data: authData }] = await Promise.all([
    brandsTablePromise,
    authUsersPromise,
  ])

  // Build lookup maps
  const authUserMap = new Map(
    (authData?.users || []).map((u: any) => [u.id, u])
  )
  const seenUserIds = new Set<string>()
  const rows: any[] = []

  // 1. Add everyone from the brands table first (always reliable)
  for (const b of brandsData || []) {
    seenUserIds.add(b.user_id)
    const authUser = authUserMap.get(b.user_id)
    rows.push({
      brand_id: b.id,
      user_id: b.user_id,
      company_name: b.company_name || authUser?.user_metadata?.full_name || authUser?.email || "—",
      industry: b.industry || "—",
      subscription_tier: b.subscription_tier || "free",
      email: authUser?.email || "—",
      created_at: b.created_at || authUser?.created_at,
    })
  }

  // 2. Add brand users from auth who don't have a brands table row
  for (const u of authData?.users || []) {
    if (seenUserIds.has(u.id)) continue
    const role = u.user_metadata?.role
    // include if role is "brand" or not set (default role)
    if (role && role !== "brand") continue
    rows.push({
      brand_id: null,
      user_id: u.id,
      company_name: u.user_metadata?.company_name || u.user_metadata?.full_name || u.email || "—",
      industry: "—",
      subscription_tier: "free",
      email: u.email || "—",
      created_at: u.created_at,
    })
  }

  // Sort newest first
  rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brands</h1>
        <p className="text-muted-foreground">All registered brands on the platform ({rows.length})</p>
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
            {rows.map((b) => (
              <tr key={b.user_id} className="hover:bg-muted/30">
                <td className="p-4 font-medium text-sm">{b.company_name}</td>
                <td className="p-4 text-sm text-muted-foreground">{b.email}</td>
                <td className="p-4 text-sm">{b.industry}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                    {b.subscription_tier}
                  </span>
                </td>
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
        {rows.length === 0 && (
          <div className="p-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p>No brands registered yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

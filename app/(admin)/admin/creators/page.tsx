import { createServiceClient } from "@/lib/supabase/server"
import { formatNumber } from "@/lib/utils"
import Link from "next/link"
import { CheckCircle2, XCircle, Star } from "lucide-react"

export default async function AdminCreatorsPage() {
  const svc = createServiceClient()

  const { data: creators } = await svc
    .from("creator_profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Get emails from auth
  const { data: authData } = await svc.auth.admin.listUsers({ perPage: 200 })
  const userMap = new Map((authData?.users || []).map((u: any) => [
    u.id,
    { email: u.email, is_verified: !!u.email_confirmed_at }
  ]))

  const enriched = (creators || []).map((c: any) => ({
    ...c,
    ownerEmail: userMap.get(c.user_id)?.email || "",
    is_verified: userMap.get(c.user_id)?.is_verified || false,
  }))

  const pending = enriched.filter((c) => !c.is_verified)
  const verified = enriched.filter((c) => c.is_verified)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Creators</h1>
        <p className="text-muted-foreground">Manage and verify creator profiles</p>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-yellow-600" />
            Pending Verification ({pending.length})
          </h2>
          <div className="grid gap-3">
            {pending.map((c: any) => (
              <Link key={c.id} href={`/admin/creators/${c.id}`}
                className="bg-yellow-50 dark:bg-yellow-950/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between hover:bg-yellow-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-bold text-sm">
                    {(c.display_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{c.display_name}</p>
                    <p className="text-sm text-muted-foreground">{c.ownerEmail} &middot; {c.categories?.join(", ") || "No categories"}</p>
                  </div>
                </div>
                <span className="text-sm text-primary">Review &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-lg mb-3">All Creators ({enriched.length})</h2>
        <div className="bg-card border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Creator</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Followers</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Categories</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rating</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Verified</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaigns</th>
              <th className="p-4"></th>
            </tr></thead>
            <tbody className="divide-y">
              {enriched.map((c: any) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="p-4"><div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{(c.display_name || "?").charAt(0)}</div>
                    <div><p className="font-medium text-sm">{c.display_name}</p><p className="text-xs text-muted-foreground">{c.ownerEmail}</p></div>
                  </div></td>
                  <td className="p-4 text-sm">{formatNumber((c.tiktok_followers || 0) + (c.instagram_followers || 0) + (c.youtube_subscribers || 0))}</td>
                  <td className="p-4 text-sm">{c.categories?.slice(0, 2).join(", ") || "—"}</td>
                  <td className="p-4 text-sm">
                    {c.platform_rating > 0
                      ? <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{c.platform_rating.toFixed(1)}</span>
                      : "—"}
                  </td>
                  <td className="p-4">{c.is_verified ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}</td>
                  <td className="p-4 text-sm">{c.total_campaigns_completed}</td>
                  <td className="p-4"><Link href={`/admin/creators/${c.id}`} className="text-primary hover:underline text-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

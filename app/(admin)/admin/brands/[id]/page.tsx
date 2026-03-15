import { createServiceClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function AdminBrandDetailPage({ params }: { params: { id: string } }) {
  const svc = createServiceClient()

  const { data: brand } = await svc.from("brands").select("*").eq("id", params.id).single()
  if (!brand) return <div className="p-12 text-center"><p>Brand not found</p></div>

  const { count: campaignCount } = await svc.from("campaigns").select("*", { count: "exact", head: true }).eq("brand_id", params.id)

  // Get owner info from auth
  const { data: authUser } = await svc.auth.admin.getUserById(brand.user_id)
  const owner = authUser?.user
  const ownerName = owner?.user_metadata?.full_name || owner?.user_metadata?.company_name || "—"
  const ownerEmail = owner?.email || "—"

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/brands" className="p-2 rounded-md hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">{brand.company_name}</h1>
          <p className="text-muted-foreground">{ownerEmail}</p>
        </div>
      </div>
      <div className="bg-card border rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-muted-foreground">Owner</p><p className="font-medium">{ownerName}</p></div>
          <div><p className="text-sm text-muted-foreground">Industry</p><p className="font-medium">{brand.industry || "—"}</p></div>
          <div><p className="text-sm text-muted-foreground">Website</p><p className="font-medium">{brand.website || "—"}</p></div>
          <div><p className="text-sm text-muted-foreground">Subscription</p><p className="font-medium capitalize">{brand.subscription_tier}</p></div>
          <div><p className="text-sm text-muted-foreground">Campaigns</p><p className="font-medium">{campaignCount || 0}</p></div>
          <div><p className="text-sm text-muted-foreground">Joined</p><p className="font-medium">{formatDate(brand.created_at)}</p></div>
          <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{ownerEmail}</p></div>
          <div><p className="text-sm text-muted-foreground">Email Verified</p><p className="font-medium">{owner?.email_confirmed_at ? "Yes" : "No"}</p></div>
        </div>
        {brand.description && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="mt-1">{brand.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

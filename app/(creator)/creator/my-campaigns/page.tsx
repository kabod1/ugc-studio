import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, Megaphone } from "lucide-react"

export default async function MyCampaignsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single()

  const { data: applications } = await supabase
    .from("campaign_applications")
    .select("*, campaigns(id, title, content_deadline, status, brands(company_name))")
    .eq("creator_id", creator!.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <p className="text-muted-foreground">Campaigns you&apos;ve been accepted to</p>
      </div>

      {applications && applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Link key={app.id} href={`/creator/my-campaigns/${app.campaigns?.id}`}
              className="bg-card border rounded-lg p-5 hover:border-primary/50 transition-colors block">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{(app.campaigns as any)?.title}</h3>
                  <p className="text-sm text-muted-foreground">{(app.campaigns as any)?.brands?.company_name}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">Accepted</span>
                {(app.campaigns as any)?.content_deadline && (
                  <span>Deadline: {formatDate((app.campaigns as any).content_deadline)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No active campaigns</h3>
          <p className="text-muted-foreground mt-1 mb-4">Apply to campaigns to get started</p>
          <Link href="/creator/campaigns" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            Browse Campaigns
          </Link>
        </div>
      )}
    </div>
  )
}

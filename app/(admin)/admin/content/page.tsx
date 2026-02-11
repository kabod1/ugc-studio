import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { FileVideo, Eye } from "lucide-react"

export default async function AdminContentPage() {
  const supabase = createClient()
  const { data: submissions } = await supabase
    .from("content_submissions")
    .select("*, creator_profiles(display_name), campaigns(title)")
    .order("created_at", { ascending: false })
    .limit(100)

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800", in_progress: "bg-blue-100 text-blue-800",
    submitted: "bg-yellow-100 text-yellow-800", revision_requested: "bg-orange-100 text-orange-800",
    approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Content Moderation</h1><p className="text-muted-foreground">Review and moderate content submissions</p></div>
      <div className="bg-card border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Content</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Creator</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">AI Score</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
            <th className="p-4"></th>
          </tr></thead>
          <tbody className="divide-y">
            {submissions?.map((s: any) => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="p-4"><div className="flex items-center gap-2"><FileVideo className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{s.title || s.content_type}</span></div></td>
                <td className="p-4 text-sm">{s.creator_profiles?.display_name || "—"}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.campaigns?.title || "—"}</td>
                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || ""}`}>{s.status?.replace("_", " ")}</span></td>
                <td className="p-4 text-sm">{s.ai_quality_score ? `${s.ai_quality_score}/100` : "—"}</td>
                <td className="p-4 text-sm text-muted-foreground">{formatDate(s.created_at)}</td>
                <td className="p-4"><Link href={`/admin/content/${s.id}`} className="text-primary hover:underline text-sm inline-flex items-center gap-1"><Eye className="h-3 w-3" /> Review</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!submissions || submissions.length === 0) && <div className="p-12 text-center"><FileVideo className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p>No content submissions</p></div>}
      </div>
    </div>
  )
}

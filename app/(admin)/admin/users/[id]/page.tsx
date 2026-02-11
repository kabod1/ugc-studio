"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { ArrowLeft, ShieldCheck, Ban, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminUserDetailPage() {
  const { id } = useParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()
      const { data } = await supabase.from("profiles").select("*").eq("id", id).single()
      setUser(data)
      setLoading(false)
    }
    fetchUser()
  }, [id])

  async function handleAction(action: "verify" | "ban") {
    setActing(true)
    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, entity_type: "user", entity_id: id }),
      })
      if (!res.ok) throw new Error("Action failed")
      toast.success(action === "verify" ? "User verified" : "User banned")
      const supabase = createClient()
      const { data } = await supabase.from("profiles").select("*").eq("id", id).single()
      setUser(data)
    } catch {
      toast.error("Action failed")
    }
    setActing(false)
  }

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!user) return <div className="p-12 text-center"><p>User not found</p></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="p-2 rounded-md hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">{user.full_name || "No name"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-muted-foreground">Role</p><p className="font-medium capitalize">{user.role}</p></div>
          <div><p className="text-sm text-muted-foreground">Joined</p><p className="font-medium">{formatDate(user.created_at)}</p></div>
          <div><p className="text-sm text-muted-foreground">Verified</p><p className="font-medium">{user.is_verified ? "Yes" : "No"}</p></div>
          <div><p className="text-sm text-muted-foreground">Active</p><p className="font-medium">{user.is_active ? "Yes" : "Banned"}</p></div>
          <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{user.phone || "Not set"}</p></div>
          <div><p className="text-sm text-muted-foreground">Timezone</p><p className="font-medium">{user.timezone}</p></div>
        </div>
      </div>

      <div className="flex gap-3">
        {!user.is_verified && (
          <button onClick={() => handleAction("verify")} disabled={acting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50">
            <ShieldCheck className="h-4 w-4" /> Verify User
          </button>
        )}
        <button onClick={() => handleAction("ban")} disabled={acting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-50">
          <Ban className="h-4 w-4" /> {user.is_active ? "Ban User" : "Unban User"}
        </button>
      </div>
    </div>
  )
}

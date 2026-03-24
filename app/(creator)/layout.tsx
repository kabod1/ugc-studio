import { createClient, createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect("/login")
  const user = session.user

  // Role is stored in user_metadata (set at signup) — profiles table is admin-only
  const role = user.user_metadata?.role || "brand"
  if (role !== "creator") {
    redirect(role === "brand" ? "/dashboard" : role === "admin" ? "/admin" : "/login")
  }

  const service = createServiceClient()
  const { data: creatorProfile } = await service
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  const userDisplay = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || "",
    role: "creator",
    creatorProfile,
  }

  return (
    <DashboardShell user={userDisplay} role="creator">
      {children}
    </DashboardShell>
  )
}

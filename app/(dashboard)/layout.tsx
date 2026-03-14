import { createClient, createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const service = createServiceClient()

  const { data: profile } = await service
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "brand") {
    redirect(profile?.role === "creator" ? "/creator" : profile?.role === "admin" ? "/admin" : "/login")
  }

  const { data: brand } = await service
    .from("brands")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <DashboardShell
      user={{ ...profile, brand }}
      role="brand"
    >
      {children}
    </DashboardShell>
  )
}

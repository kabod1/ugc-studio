import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Use service client to bypass RLS infinite recursion on profiles
  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    redirect(profile?.role === "creator" ? "/creator" : "/dashboard")
  }

  return (
    <DashboardShell user={profile} role="admin">
      {children}
    </DashboardShell>
  )
}

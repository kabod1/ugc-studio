import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isAdminEmail } from "@/lib/constants"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) redirect("/login")

  // Use service client to bypass RLS infinite recursion on profiles
  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Admin emails (lib/constants ADMIN_EMAILS) are admins even if the profile row says otherwise
  if (!profile || (profile.role !== "admin" && !isAdminEmail(user.email))) {
    redirect(profile?.role === "creator" ? "/creator" : "/dashboard")
  }

  return (
    <DashboardShell user={profile} role="admin">
      {children}
    </DashboardShell>
  )
}

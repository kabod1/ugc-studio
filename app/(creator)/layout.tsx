import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "creator") {
    redirect(profile?.role === "brand" ? "/dashboard" : "/login")
  }

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <DashboardShell
      user={{ ...profile, creatorProfile }}
      role="creator"
    >
      {children}
    </DashboardShell>
  )
}

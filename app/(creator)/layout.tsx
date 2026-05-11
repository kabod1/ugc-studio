import { createClient, createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { isAdminEmail } from "@/lib/constants"

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect("/login")
  const user = session.user

  // Cookie is updated immediately on role switch; user_metadata lags until session refresh
  const cookieStore = cookies()
  const role = cookieStore.get("user-role")?.value || user.user_metadata?.role || "brand"
  // Allow admin to access the creator dashboard without switching their role
  if (role !== "creator" && role !== "admin") {
    redirect(role === "brand" ? "/dashboard" : "/login")
  }

  const service = createServiceClient()
  let { data: creatorProfile } = await service
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Auto-create creator_profiles row for first-time switchers / admin users
  if (!creatorProfile) {
    const { data: newProfile } = await service
      .from("creator_profiles")
      .insert({
        user_id: user.id,
        display_name: user.user_metadata?.full_name || "",
        tiktok_followers: 0,
        instagram_followers: 0,
        youtube_subscribers: 0,
        platform_rating: 0,
        total_campaigns_completed: 0,
        age_verified: false,
        tax_form_submitted: false,
      })
      .select()
      .single()
    creatorProfile = newProfile
  }

  const userDisplay = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || "",
    role: "creator",
    creatorProfile,
  }

  return (
    <DashboardShell user={userDisplay} role="creator" isAdmin={isAdminEmail(user.email)}>
      {children}
    </DashboardShell>
  )
}

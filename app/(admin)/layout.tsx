import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Debug: check raw cookie value
  const cookieStore = cookies()
  const rawCookie = cookieStore.get("sb-shqkvzzwademhglwlgiy-auth-token")?.value
  console.log("[admin-layout] cookie present:", !!rawCookie, "starts with %7B:", rawCookie?.startsWith("%7B"), "starts with {:", rawCookie?.startsWith("{"))

  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log("[admin-layout] user:", user?.id, "error:", userError?.message)

  if (!user) redirect("/login")

  // Use service client to bypass RLS infinite recursion on profiles
  const serviceClient = createServiceClient()
  const { data: profile, error: profileError } = await serviceClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  console.log("[admin-layout] user.id:", user.id, "profile:", profile?.role, "error:", profileError?.message)

  if (!profile || profile.role !== "admin") {
    redirect(profile?.role === "creator" ? "/creator" : "/dashboard")
  }

  return (
    <DashboardShell user={profile} role="admin">
      {children}
    </DashboardShell>
  )
}

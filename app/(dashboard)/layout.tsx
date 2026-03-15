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

  // Role is stored in user_metadata (set at signup) — profiles table is admin-only
  const role = user.user_metadata?.role || "brand"
  if (role !== "brand") {
    redirect(role === "creator" ? "/creator" : role === "admin" ? "/admin" : "/login")
  }

  const service = createServiceClient()
  const { data: brand } = await service
    .from("brands")
    .select("*")
    .eq("user_id", user.id)
    .single()

  const userDisplay = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || "",
    company_name: user.user_metadata?.company_name || brand?.company_name || "",
    role: "brand",
    brand,
  }

  return (
    <DashboardShell user={userDisplay} role="brand">
      {children}
    </DashboardShell>
  )
}

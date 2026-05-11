import { createClient, createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { isAdminEmail } from "@/lib/constants"

export default async function DashboardLayout({
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
  // Allow admin to access the brand dashboard without switching their role
  if (role !== "brand" && role !== "admin") {
    redirect(role === "creator" ? "/creator" : "/login")
  }

  const service = createServiceClient()
  let { data: brand } = await service
    .from("brands")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Auto-create brands row if missing (signup DB insert may have failed)
  if (!brand) {
    const { data: newBrand } = await service
      .from("brands")
      .insert({
        user_id: user.id,
        company_name: user.user_metadata?.company_name || user.user_metadata?.full_name || user.email || "My Brand",
        subscription_tier: "free",
      })
      .select()
      .single()
    brand = newBrand
  }

  // Admin email gets full Scale-tier access across the entire dashboard
  if (brand && isAdminEmail(user.email)) {
    brand = { ...brand, subscription_tier: "scale" }
  }

  const userDisplay = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || "",
    company_name: user.user_metadata?.company_name || brand?.company_name || "",
    role: "brand",
    brand,
  }

  return (
    <DashboardShell user={userDisplay} role="brand" isAdmin={isAdminEmail(user.email)}>
      {children}
    </DashboardShell>
  )
}

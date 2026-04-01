import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const svc = createServiceClient()

  const { data: brand } = await svc.from("brands").select("id, company_name").eq("user_id", user.id).single()
  const { data: allContracts } = await svc.from("contracts").select("id, brand_id, creator_id, campaign_id, status, total_value_cents").order("created_at", { ascending: false }).limit(20)
  const { data: brandContracts } = brand
    ? await svc.from("contracts").select("id, brand_id, status").eq("brand_id", brand.id)
    : { data: [] }

  return NextResponse.json({ user_id: user.id, brand, allContracts, brandContracts })
}

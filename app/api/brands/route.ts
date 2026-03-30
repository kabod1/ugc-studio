import { NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()
    const { data: brands, error } = await svc
      .from("brands")
      .select("id, company_name, industry")
      .order("company_name", { ascending: true })

    if (error) return NextResponse.json({ brands: [] })
    return NextResponse.json({ brands: brands || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

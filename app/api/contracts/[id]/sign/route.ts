import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()

    const [{ data: brand }, { data: creator }] = await Promise.all([
      svc.from("brands").select("id").eq("user_id", user.id).single(),
      svc.from("creator_profiles").select("id").eq("user_id", user.id).single(),
    ])

    const now = new Date().toISOString()
    const updateData: Record<string, any> = { updated_at: now }

    if (brand) {
      updateData.signed_by_brand_at = now
    } else if (creator) {
      updateData.signed_by_creator_at = now
    }

    const { data: contract } = await svc
      .from("contracts")
      .select("signed_by_brand_at, signed_by_creator_at")
      .eq("id", params.id)
      .single()

    if (contract) {
      const brandSigned  = brand    ? true : !!contract.signed_by_brand_at
      const creatorSigned = creator ? true : !!contract.signed_by_creator_at
      updateData.status = brandSigned && creatorSigned ? "signed" : "sent"
    }

    const { data, error } = await svc
      .from("contracts")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

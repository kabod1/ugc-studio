import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const now = new Date().toISOString()
    const updateData: Record<string, any> = { updated_at: now }

    if (profile?.role === "brand") {
      updateData.brand_signed_at = now
    } else if (profile?.role === "creator") {
      updateData.creator_signed_at = now
    }

    const { data: contract } = await supabase
      .from("contracts")
      .select("brand_signed_at, creator_signed_at")
      .eq("id", params.id)
      .single()

    if (contract) {
      const brandSigned = profile?.role === "brand" ? true : !!contract.brand_signed_at
      const creatorSigned = profile?.role === "creator" ? true : !!contract.creator_signed_at
      if (brandSigned && creatorSigned) {
        updateData.status = "signed"
      } else {
        updateData.status = "sent"
      }
    }

    const { data, error } = await supabase
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

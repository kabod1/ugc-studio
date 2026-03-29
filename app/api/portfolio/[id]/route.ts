import { NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()

    // Verify ownership before deleting
    const { data: profile } = await svc
      .from("creator_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single()

    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { error } = await svc
      .from("portfolio_items")
      .delete()
      .eq("id", params.id)
      .eq("creator_id", profile.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

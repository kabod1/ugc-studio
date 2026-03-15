import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()
    const { data: profile } = await svc.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const { type, id, action, reason } = body

    if (!type || !id || !action) {
      return NextResponse.json({ error: "type, id, and action required" }, { status: 400 })
    }
    const now = new Date().toISOString()

    switch (type) {
      case "content": {
        const status = action === "approve" ? "approved" : "rejected"
        await svc.from("content_submissions").update({ status, brand_feedback: reason, updated_at: now }).eq("id", id)
        break
      }
      case "user": {
        if (action === "verify") {
          await svc.from("profiles").update({ is_verified: true, updated_at: now }).eq("id", id)
        } else if (action === "ban") {
          // Toggle ban status
          const { data: current } = await svc.from("profiles").select("is_active").eq("id", id).single()
          const newStatus = current?.is_active !== false ? false : true
          await svc.from("profiles").update({ is_active: newStatus, updated_at: now }).eq("id", id)
        }
        break
      }
      case "creator": {
        if (action === "approve") {
          await svc.from("creator_profiles").update({ is_verified: true, verified_at: now, updated_at: now }).eq("id", id)
        } else if (action === "ban") {
          await svc.from("profiles").update({ is_active: false, updated_at: now }).eq("id", id)
        }
        break
      }
      case "campaign": {
        const status = action === "approve" ? "active" : "cancelled"
        await svc.from("campaigns").update({ status, updated_at: now }).eq("id", id)
        break
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

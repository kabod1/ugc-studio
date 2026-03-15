import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()
    const { data: profile } = await svc.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    const url = new URL(request.url)
    const table = url.searchParams.get("table")
    const id = url.searchParams.get("id")
    const select = url.searchParams.get("select") || "*"

    if (!table || !id) {
      return NextResponse.json({ error: "table and id required" }, { status: 400 })
    }

    const allowedTables = ["profiles", "brands", "creator_profiles", "campaigns", "content_submissions", "payments", "campaign_applications", "contracts"]
    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 })
    }

    const { data, error } = await svc.from(table).select(select).eq("id", id).single()
    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

async function requireAdmin() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const role = session.user.user_metadata?.role
  if (role !== "admin") return null
  return session
}

// GET /api/admin/outreach — list all prospects
export async function GET(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const svc = createServiceClient()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || ""
  const status = searchParams.get("status") || ""
  const search = searchParams.get("search") || ""

  let query = svc
    .from("outreach_prospects")
    .select("*")
    .order("created_at", { ascending: false })

  if (type) query = query.eq("type", type)
  if (status) query = query.eq("status", status)
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ prospects: [] })

  return NextResponse.json({ prospects: data || [] })
}

// POST /api/admin/outreach — create prospect
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { name, email, company, type, notes, source, website, instagram, tiktok } = body

  if (!name || !email || !type) {
    return NextResponse.json({ error: "name, email, and type are required" }, { status: 400 })
  }

  const svc = createServiceClient()
  const { data, error } = await svc
    .from("outreach_prospects")
    .insert({
      name,
      email: email.toLowerCase().trim(),
      company: company || null,
      type, // "brand" | "creator"
      notes: notes || null,
      source: source || null,
      website: website || null,
      instagram: instagram || null,
      tiktok: tiktok || null,
      status: "new",
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "This email is already in your prospect list" }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ prospect: data })
}

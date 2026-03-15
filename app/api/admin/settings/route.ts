import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

async function verifyAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const svc = createServiceClient()
  const { data: profile } = await svc.from("profiles").select("role").eq("id", user.id).single()
  return profile?.role === "admin" ? user : null
}

export async function GET() {
  try {
    if (!(await verifyAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const svc = createServiceClient()
    const { data } = await svc.from("platform_settings").select("*")
    const map: Record<string, any> = {}
    data?.forEach((s: any) => { map[s.key] = s.value })
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const svc = createServiceClient()
    const settings = await request.json()

    for (const [key, value] of Object.entries(settings)) {
      await svc.from("platform_settings").upsert({ key, value, updated_at: new Date().toISOString() })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

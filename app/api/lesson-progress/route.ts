import { NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()
    const { data, error } = await svc
      .from("lesson_progress")
      .select("module_id, lesson_id, completed_at")
      .eq("user_id", session.user.id)

    if (error && error.code === "42P01") {
      return NextResponse.json({ progress: [] }) // Table not yet created
    }

    return NextResponse.json({ progress: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { module_id, lesson_id } = await request.json()
    if (!module_id || !lesson_id) {
      return NextResponse.json({ error: "module_id and lesson_id required" }, { status: 400 })
    }

    const svc = createServiceClient()
    const { error } = await svc
      .from("lesson_progress")
      .upsert(
        { user_id: session.user.id, module_id, lesson_id, completed_at: new Date().toISOString() },
        { onConflict: "user_id,module_id,lesson_id" }
      )

    if (error && error.code !== "42P01") {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

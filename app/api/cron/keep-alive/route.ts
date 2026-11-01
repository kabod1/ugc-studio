import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/cron/keep-alive
// Daily Vercel cron (vercel.json). Runs one tiny query so the free-tier
// Supabase project never goes 7 days without activity and gets paused.
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await createServiceClient()
    .from("platform_settings")
    .select("key")
    .limit(1)

  if (error) {
    console.error("Keep-alive query failed:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}

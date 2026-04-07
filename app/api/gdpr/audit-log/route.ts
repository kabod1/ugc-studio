/**
 * GDPR Audit Log — read access for admins / internal use
 *
 * GET  /api/gdpr/audit-log          — list audit entries for the current user
 * POST /api/gdpr/audit-log          — write a client-side consent event
 *
 * Required DB table (run once in Supabase SQL editor):
 *
 * create table if not exists gdpr_audit_logs (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid not null,
 *   action text not null,
 *   metadata jsonb,
 *   created_at timestamptz default now()
 * );
 *
 * create index if not exists gdpr_audit_logs_user_id_idx on gdpr_audit_logs(user_id);
 */

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const service = createServiceClient()
    const { data, error } = await service
      .from("gdpr_audit_logs")
      .select("id, action, metadata, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      // Table may not exist yet
      if (error.code === "42P01") {
        return NextResponse.json({ logs: [] })
      }
      throw error
    }

    return NextResponse.json({ logs: data ?? [] })
  } catch (err) {
    console.error("[GDPR audit-log GET]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { action, metadata } = body

    if (!action || typeof action !== "string") {
      return NextResponse.json({ error: "action is required" }, { status: 400 })
    }

    // Only allow known consent-related actions from client
    const allowedActions = [
      "consent_accepted_all",
      "consent_rejected_all",
      "consent_withdrawn_all",
      "consent_updated",
    ]
    if (!allowedActions.includes(action)) {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }

    const service = createServiceClient()
    const { error } = await service.from("gdpr_audit_logs").insert({
      user_id: user.id,
      action,
      metadata: metadata ?? {},
    })

    if (error) {
      if (error.code === "42P01") {
        // Table not created yet — return success silently
        return NextResponse.json({ success: true })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[GDPR audit-log POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

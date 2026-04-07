/**
 * GDPR Account Deletion
 *
 * Performs a staged deletion:
 *   1. Anonymise profile data (nullify PII fields)
 *   2. Delete creator / brand profile rows
 *   3. Delete the auth user (cascades FK-linked rows)
 *   4. Write an audit log entry before deletion
 *
 * Required DB table (run once in Supabase SQL editor):
 *
 * create table if not exists gdpr_audit_logs (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid not null,   -- intentionally no FK so the log survives user deletion
 *   action text not null,
 *   metadata jsonb,
 *   created_at timestamptz default now()
 * );
 */

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const service = createServiceClient()

    // 1. Audit log BEFORE deletion (best-effort)
    try {
      await service.from("gdpr_audit_logs").insert({
        user_id: user.id,
        action: "account_deletion",
        metadata: {
          email: user.email,
          requested_at: new Date().toISOString(),
        },
      })
    } catch {
      console.warn("[GDPR] gdpr_audit_logs table not found — skipping audit log")
    }

    // 2. Anonymise profile PII
    await service
      .from("profiles")
      .update({ avatar_url: null, photo_url: null, bio: null, latitude: null, longitude: null })
      .eq("id", user.id)

    // 3. Delete brand and creator profile rows
    await Promise.all([
      service.from("brands").delete().eq("user_id", user.id),
      service.from("creator_profiles").delete().eq("user_id", user.id),
    ])

    // 4. Delete the auth user (Supabase admin)
    const { error: deleteError } = await service.auth.admin.deleteUser(user.id)
    if (deleteError) {
      console.error("[GDPR account-deletion] deleteUser error:", deleteError)
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully." })
  } catch (err) {
    console.error("[GDPR account-deletion]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

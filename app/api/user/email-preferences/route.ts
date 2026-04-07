/**
 * Email Preferences API
 *
 * Stores email opt-in/out settings per user.
 *
 * Required DB column (run once in Supabase SQL editor):
 *
 * alter table profiles
 *   add column if not exists email_preferences jsonb default '{"marketing":true,"product":true,"security":true}'::jsonb;
 */

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export type EmailPreferences = {
  marketing: boolean  // newsletters, promotions, tips
  product: boolean    // new features, platform updates
  security: boolean   // login alerts, password resets (recommended on)
}

const DEFAULT_PREFS: EmailPreferences = {
  marketing: true,
  product: true,
  security: true,
}

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const service = createServiceClient()
    const { data, error } = await service
      .from("profiles")
      .select("email_preferences")
      .eq("id", user.id)
      .single()

    if (error) throw error

    return NextResponse.json({
      preferences: (data?.email_preferences as EmailPreferences) ?? DEFAULT_PREFS,
    })
  } catch (err) {
    console.error("[email-preferences GET]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { marketing, product, security } = body

    const prefs: EmailPreferences = {
      marketing: typeof marketing === "boolean" ? marketing : DEFAULT_PREFS.marketing,
      product: typeof product === "boolean" ? product : DEFAULT_PREFS.product,
      security: typeof security === "boolean" ? security : true, // security emails default always on
    }

    const service = createServiceClient()
    const { error } = await service
      .from("profiles")
      .update({ email_preferences: prefs })
      .eq("id", user.id)

    if (error) throw error

    // Audit the opt-out (best-effort)
    try {
      await service.from("gdpr_audit_logs").insert({
        user_id: user.id,
        action: "email_preferences_updated",
        metadata: prefs,
      })
    } catch {
      // Table may not exist yet
    }

    return NextResponse.json({ preferences: prefs })
  } catch (err) {
    console.error("[email-preferences PATCH]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

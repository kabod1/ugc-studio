import { NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()

    let { data: profile } = await svc
      .from("creator_profiles")
      .select("id, referral_code")
      .eq("user_id", session.user.id)
      .single()

    if (!profile) return NextResponse.json({ error: "Creator profile not found" }, { status: 404 })

    // Generate and save referral code if missing
    if (!profile.referral_code) {
      let code = generateCode()
      // Ensure uniqueness
      let attempts = 0
      while (attempts < 5) {
        const { data: existing } = await svc
          .from("creator_profiles")
          .select("id")
          .eq("referral_code", code)
          .maybeSingle()
        if (!existing) break
        code = generateCode()
        attempts++
      }

      const { data: updated } = await svc
        .from("creator_profiles")
        .update({ referral_code: code })
        .eq("id", profile.id)
        .select("id, referral_code")
        .single()

      profile = updated || profile
    }

    // Fetch referral stats
    const { data: referrals, error: refError } = await svc
      .from("referrals")
      .select("id, status, commission_cents, plan, created_at")
      .eq("referrer_id", profile.id)
      .order("created_at", { ascending: false })

    const items = refError ? [] : (referrals || [])
    const totalCommissionCents = items
      .filter((r) => r.status === "paid")
      .reduce((sum: number, r: any) => sum + (r.commission_cents || 0), 0)

    return NextResponse.json({
      referral_code: profile.referral_code,
      referrals: items,
      stats: {
        total: items.length,
        active: items.filter((r: any) => r.status === "active").length,
        paid: items.filter((r: any) => r.status === "paid").length,
        total_commission_cents: totalCommissionCents,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

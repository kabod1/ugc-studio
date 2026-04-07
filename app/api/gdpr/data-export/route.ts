import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const service = createServiceClient()

    // Resolve brand and creator profile IDs first (brand_id/creator_id are profile IDs, not user IDs)
    const [{ data: brand }, { data: creatorProfile }] = await Promise.all([
      service.from("brands").select("*").eq("user_id", user.id).single(),
      service.from("creator_profiles").select("*").eq("user_id", user.id).single(),
    ])

    // Fetch profile
    const { data: profile } = await service
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Fetch applications (table is campaign_applications; creator_id is creator_profiles.id)
    const { data: applications } = creatorProfile
      ? await service
          .from("campaign_applications")
          .select("*, campaigns(title, budget)")
          .eq("creator_id", creatorProfile.id)
          .limit(200)
      : { data: [] }

    // Fetch payments (brand_id = brands.id; creator_id = creator_profiles.id)
    let payments: unknown[] = []
    if (brand) {
      const { data } = await service
        .from("payments")
        .select("*, campaigns(title), creator_profiles(display_name)")
        .eq("brand_id", brand.id)
        .limit(200)
      payments = data ?? []
    } else if (creatorProfile) {
      const { data } = await service
        .from("payments")
        .select("*, campaigns(title), brands(company_name)")
        .eq("creator_id", creatorProfile.id)
        .limit(200)
      payments = data ?? []
    }

    // Fetch contracts (brand_id = brands.id; creator_id = creator_profiles.id)
    let contracts: unknown[] = []
    if (brand) {
      const { data } = await service
        .from("contracts")
        .select("*, campaigns(title), creator_profiles(display_name)")
        .eq("brand_id", brand.id)
        .limit(100)
      contracts = data ?? []
    } else if (creatorProfile) {
      const { data } = await service
        .from("contracts")
        .select("*, campaigns(title), brands(company_name)")
        .eq("creator_id", creatorProfile.id)
        .limit(100)
      contracts = data ?? []
    }

    // Fetch notifications
    const { data: notifications } = await service
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .limit(200)

    const exportData = {
      exportedAt: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        userMetadata: user.user_metadata,
      },
      profile: profile ?? null,
      brand: brand ?? null,
      creatorProfile: creatorProfile ?? null,
      applications: applications ?? [],
      payments,
      contracts,
      notifications: notifications ?? [],
    }

    // Audit log
    try {
      await service.from("gdpr_audit_logs").insert({
        user_id: user.id,
        action: "data_export",
        metadata: { exported_at: exportData.exportedAt },
      })
    } catch {
      console.warn("[GDPR] gdpr_audit_logs table not found — skipping audit log")
    }

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="townshub-data-export-${Date.now()}.json"`,
        "Content-Type": "application/json",
      },
    })
  } catch (err) {
    console.error("[GDPR data-export]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

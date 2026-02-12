import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    // --- Summary data ---
    const { count: totalCampaigns } = await supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("brand_id", brand.id)

    const { count: activeCampaigns } = await supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("brand_id", brand.id)
      .eq("status", "active")

    const { count: totalContent } = await supabase
      .from("content_submissions")
      .select("id, campaigns!inner(brand_id)", { count: "exact", head: true })
      .eq("campaigns.brand_id", brand.id)

    const { data: payments } = await supabase
      .from("payments")
      .select("amount_cents")
      .eq("brand_id", brand.id)
      .eq("status", "completed")

    const totalSpendCents = payments?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0

    const summary = {
      totalCampaigns: totalCampaigns || 0,
      activeCampaigns: activeCampaigns || 0,
      totalContent: totalContent || 0,
      totalSpendCents,
    }

    // --- Monthly data (last 6 months) ---
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const { data: campaignsByMonth } = await supabase
      .from("campaigns")
      .select("created_at")
      .eq("brand_id", brand.id)
      .gte("created_at", sixMonthsAgo.toISOString())

    const { data: paymentsByMonth } = await supabase
      .from("payments")
      .select("created_at, amount_cents")
      .eq("brand_id", brand.id)
      .eq("status", "completed")
      .gte("created_at", sixMonthsAgo.toISOString())

    const monthlyData: { month: string; campaigns: number; spendCents: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = d.getFullYear()
      const month = d.getMonth()
      const label = monthNames[month]

      const campaignsInMonth = (campaignsByMonth || []).filter((c) => {
        const cd = new Date(c.created_at)
        return cd.getFullYear() === year && cd.getMonth() === month
      }).length

      const spendInMonth = (paymentsByMonth || [])
        .filter((p) => {
          const pd = new Date(p.created_at)
          return pd.getFullYear() === year && pd.getMonth() === month
        })
        .reduce((sum, p) => sum + (p.amount_cents || 0), 0)

      monthlyData.push({ month: label, campaigns: campaignsInMonth, spendCents: spendInMonth })
    }

    // --- Content breakdown ---
    const statusValues = ["approved", "pending", "rejected"] as const
    const contentBreakdown: { status: string; count: number }[] = []

    for (const status of statusValues) {
      const { count } = await supabase
        .from("content_submissions")
        .select("id, campaigns!inner(brand_id)", { count: "exact", head: true })
        .eq("campaigns.brand_id", brand.id)
        .eq("status", status)

      contentBreakdown.push({ status, count: count || 0 })
    }

    return NextResponse.json({
      summary,
      monthlyData,
      contentBreakdown,
    })
  } catch (err) {
    console.error("GET /api/analytics error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { payment_id } = body

    if (!payment_id) return NextResponse.json({ error: "payment_id required" }, { status: 400 })

    const svc = createServiceClient()

    const { data: payment } = await svc
      .from("payments")
      .select("*, creator_profiles(user_id, display_name, stripe_connect_account_id, stripe_connect_onboarded), campaigns(title, brand_id)")
      .eq("id", payment_id)
      .single()

    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    if (payment.status !== "escrow") return NextResponse.json({ error: "Payment not in escrow" }, { status: 400 })

    const creator = (payment as any).creator_profiles
    const campaign = (payment as any).campaigns
    const connectId = creator?.stripe_connect_onboarded ? creator?.stripe_connect_account_id : null

    if (!connectId) return NextResponse.json({ error: "Creator has no Stripe Connect account" }, { status: 400 })

    const transferAmount = payment.amount_cents - (payment.platform_fee_cents || 0)
    if (transferAmount <= 0) return NextResponse.json({ error: "Invalid transfer amount" }, { status: 400 })

    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: "eur",
      destination: connectId,
      metadata: { payment_id: payment.id },
    })

    await svc
      .from("payments")
      .update({
        status: "completed",
        stripe_transfer_id: transfer.id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment_id)

    // Notify creator they've been paid
    if (creator?.user_id) {
      await svc.from("notifications").insert({
        user_id: creator.user_id,
        title: "You've been paid! 🎉",
        message: `€${(transferAmount / 100).toFixed(2)} has been transferred to your account for "${campaign?.title || "your campaign"}".`,
        type: "payment",
        link: "/creator/earnings",
      })
    }

    const { data: updated } = await svc
      .from("payments")
      .select("*, campaigns(title), creator_profiles(display_name)")
      .eq("id", payment_id)
      .single()

    return NextResponse.json(updated || { success: true, transfer_id: transfer.id })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transfer failed" },
      { status: 500 }
    )
  }
}

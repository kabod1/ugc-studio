import { createClient } from "@/lib/supabase/server"
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

    const { data: payment } = await supabase
      .from("payments")
      .select("*, creator_profiles(stripe_connect_account_id)")
      .eq("id", payment_id)
      .single()

    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    if (payment.status !== "escrow") return NextResponse.json({ error: "Payment not in escrow" }, { status: 400 })

    const connectId = (payment.creator_profiles as any)?.stripe_connect_account_id
    if (!connectId) return NextResponse.json({ error: "Creator has no Stripe Connect account" }, { status: 400 })

    const transferAmount = payment.amount_cents - (payment.platform_fee_cents || 0)
    if (transferAmount <= 0) return NextResponse.json({ error: "Invalid transfer amount" }, { status: 400 })

    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: "eur",
      destination: connectId,
      metadata: { payment_id: payment.id },
    })

    await supabase
      .from("payments")
      .update({
        status: "completed",
        stripe_transfer_id: transfer.id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment_id)

    // Return updated payment for frontend state sync
    const { data: updated } = await supabase
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

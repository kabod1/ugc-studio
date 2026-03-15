import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { campaign_id, creator_id, amount_cents, reason } = body

    if (!campaign_id || !creator_id || !amount_cents || !reason) {
      return NextResponse.json({ error: "campaign_id, creator_id, amount_cents, and reason are required" }, { status: 400 })
    }

    if (amount_cents <= 0) {
      return NextResponse.json({ error: "Bonus amount must be positive" }, { status: 400 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id, stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 403 })

    // Verify the creator is part of this campaign
    const { data: application } = await supabase
      .from("campaign_applications")
      .select("id, creator_id, creator_profiles(stripe_connect_account_id)")
      .eq("campaign_id", campaign_id)
      .eq("creator_id", creator_id)
      .eq("status", "accepted")
      .single()

    if (!application) {
      return NextResponse.json({ error: "Creator is not accepted for this campaign" }, { status: 400 })
    }

    const platformFee = Math.round(amount_cents * 0.15)

    const intentParams: Record<string, unknown> = {
      amount: amount_cents,
      currency: "eur",
      metadata: {
        campaign_id,
        brand_id: brand.id,
        creator_id,
        is_bonus: "true",
        bonus_reason: reason,
      },
    }

    if (brand.stripe_customer_id) {
      intentParams.customer = brand.stripe_customer_id
    }

    const connectId = (application.creator_profiles as any)?.stripe_connect_account_id
    if (connectId) {
      intentParams.transfer_data = { destination: connectId }
      intentParams.application_fee_amount = platformFee
    }

    const paymentIntent = await stripe.paymentIntents.create(intentParams as any)

    await supabase.from("payments").insert({
      campaign_id,
      brand_id: brand.id,
      creator_id,
      amount_cents,
      platform_fee_cents: platformFee,
      creator_payout_cents: amount_cents - platformFee,
      stripe_payment_intent_id: paymentIntent.id,
      status: "pending",
      is_bonus: true,
      bonus_reason: reason,
      currency: "EUR",
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bonus payment failed" },
      { status: 500 }
    )
  }
}

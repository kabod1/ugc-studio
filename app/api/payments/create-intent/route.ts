import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { campaign_id, application_id, amount_cents } = body

    if (!amount_cents) return NextResponse.json({ error: "amount_cents required" }, { status: 400 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id, stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 403 })

    const { data: application } = await supabase
      .from("campaign_applications")
      .select("creator_id, creator_profiles(stripe_connect_id)")
      .eq("id", application_id)
      .single()

    const platformFee = Math.round(amount_cents * 0.15)

    const intentParams: any = {
      amount: amount_cents,
      currency: "usd",
      metadata: {
        campaign_id,
        application_id,
        brand_id: brand.id,
        creator_id: application?.creator_id,
      },
    }

    if (brand.stripe_customer_id) {
      intentParams.customer = brand.stripe_customer_id
    }

    const connectId = (application?.creator_profiles as any)?.stripe_connect_id
    if (connectId) {
      intentParams.transfer_data = {
        destination: connectId,
      }
      intentParams.application_fee_amount = platformFee
    }

    const paymentIntent = await stripe.paymentIntents.create(intentParams)

    await supabase.from("payments").insert({
      campaign_id,
      application_id,
      brand_id: brand.id,
      creator_id: application?.creator_id,
      amount_cents,
      platform_fee_cents: platformFee,
      stripe_payment_intent_id: paymentIntent.id,
      status: "pending",
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment failed" },
      { status: 500 }
    )
  }
}

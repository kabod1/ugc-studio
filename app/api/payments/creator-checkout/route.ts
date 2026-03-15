import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { application_id, campaign_id, amount_cents } = await request.json()
    if (!application_id || !amount_cents) {
      return NextResponse.json({ error: "application_id and amount_cents required" }, { status: 400 })
    }

    const svc = createServiceClient()

    const { data: brand } = await svc
      .from("brands")
      .select("id, stripe_customer_id, company_name")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 403 })

    const { data: application } = await svc
      .from("campaign_applications")
      .select("id, creator_id, status, creator_profiles(id, display_name, stripe_connect_account_id)")
      .eq("id", application_id)
      .single()

    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 })
    if (application.status !== "accepted") return NextResponse.json({ error: "Application must be accepted first" }, { status: 400 })

    const { data: campaign } = await svc
      .from("campaigns")
      .select("title")
      .eq("id", campaign_id)
      .single()

    const platformFee = Math.round(amount_cents * 0.15)
    const creatorProfile = application.creator_profiles as any
    const connectId = creatorProfile?.stripe_connect_account_id
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || ""

    const sessionParams: any = {
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "eur",
          unit_amount: amount_cents,
          product_data: {
            name: `Creator Payment: ${creatorProfile?.display_name || "Creator"}`,
            description: campaign?.title || "UGC Campaign",
          },
        },
        quantity: 1,
      }],
      success_url: `${origin}/dashboard/payments?paid=true`,
      cancel_url: `${origin}/dashboard/campaigns/${campaign_id}/applications?cancelled=true`,
      metadata: {
        application_id,
        campaign_id,
        brand_id: brand.id,
        creator_id: application.creator_id,
      },
    }

    if (connectId) {
      sessionParams.payment_intent_data = {
        application_fee_amount: platformFee,
        transfer_data: { destination: connectId },
      }
    }

    if (brand.stripe_customer_id) {
      try {
        await stripe.customers.retrieve(brand.stripe_customer_id)
        sessionParams.customer = brand.stripe_customer_id
      } catch {
        sessionParams.customer_email = user.email
      }
    } else {
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Record the pending payment
    await svc.from("payments").insert({
      campaign_id,
      application_id,
      brand_id: brand.id,
      creator_id: application.creator_id,
      amount_cents,
      platform_fee_cents: platformFee,
      stripe_payment_intent_id: session.payment_intent as string,
      status: "pending",
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Creator checkout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    )
  }
}

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const priceId = process.env.STRIPE_PRICE_CREATOR_PRO
    if (!priceId) return NextResponse.json({ error: "Creator Pro price not configured" }, { status: 500 })

    const { data: creatorProfile } = await supabase
      .from("creator_profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!creatorProfile) {
      return NextResponse.json({ error: "Creator profile not found" }, { status: 404 })
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || ""

    const sessionParams: any = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/creator/settings?success=true`,
      cancel_url: `${origin}/creator/settings?cancelled=true`,
      metadata: { user_id: user.id },
    }

    if (creatorProfile.stripe_customer_id) {
      sessionParams.customer = creatorProfile.stripe_customer_id
    } else {
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    )
  }
}

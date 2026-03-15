import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || "",
  growth: process.env.STRIPE_PRICE_GROWTH || "",
  scale: process.env.STRIPE_PRICE_SCALE || "",
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { tier } = body

    const priceId = PRICE_IDS[tier]
    if (!priceId) return NextResponse.json({ error: "Invalid tier" }, { status: 400 })

    const { data: brand } = await supabase
      .from("brands")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || ""

    const sessionParams: any = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/settings/billing?success=true`,
      cancel_url: `${origin}/dashboard/settings/billing?cancelled=true`,
      metadata: { user_id: user.id },
    }

    if (brand?.stripe_customer_id) {
      try {
        await stripe.customers.retrieve(brand.stripe_customer_id)
        sessionParams.customer = brand.stripe_customer_id
      } catch {
        // Customer doesn't exist in Stripe, fall back to email
        sessionParams.customer_email = user.email
      }
    } else {
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    )
  }
}

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!brand?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 400 })
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || ""
    const session = await stripe.billingPortal.sessions.create({
      customer: brand.stripe_customer_id,
      return_url: `${origin}/dashboard/settings/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Portal session failed" },
      { status: 500 }
    )
  }
}

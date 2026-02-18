import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createServiceClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 })

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object as any
        await supabase
          .from("payments")
          .update({ status: "escrow", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", intent.id)
        break
      }

      case "transfer.created": {
        const transfer = event.data.object as any
        if (transfer.metadata?.payment_id) {
          await supabase
            .from("payments")
            .update({
              status: "completed",
              stripe_transfer_id: transfer.id,
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", transfer.metadata.payment_id)
        }
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const priceId = subscription.items?.data?.[0]?.price?.id

        // Map Stripe price ID to tier name
        const PRICE_TO_TIER: Record<string, string> = {
          [process.env.STRIPE_PRICE_STARTER || ""]: "starter",
          [process.env.STRIPE_PRICE_GROWTH || ""]: "growth",
          [process.env.STRIPE_PRICE_SCALE || ""]: "scale",
          [process.env.STRIPE_PRICE_CREATOR_PRO || ""]: "pro",
        }
        const tier = PRICE_TO_TIER[priceId] || null

        await supabase
          .from("subscriptions")
          .upsert({
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "stripe_subscription_id" })

        // Update brand or creator tier based on subscription
        if (tier && subscription.status === "active") {
          const customerId = subscription.customer
          if (tier === "pro") {
            // Creator subscription
            await supabase
              .from("creator_profiles")
              .update({
                subscription_tier: "pro",
                subscription_stripe_id: subscription.id,
                subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .eq("stripe_customer_id", customerId)
          } else {
            // Brand subscription
            await supabase
              .from("brands")
              .update({
                subscription_tier: tier,
                subscription_stripe_id: subscription.id,
                subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .eq("stripe_customer_id", customerId)
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as any
        await supabase
          .from("payments")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", intent.id)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", subscription.id)

        // Revert brand to free tier
        await supabase
          .from("brands")
          .update({ subscription_tier: "free", subscription_stripe_id: null })
          .eq("stripe_customer_id", customerId)

        // Revert creator to free tier
        await supabase
          .from("creator_profiles")
          .update({ subscription_tier: "free", subscription_stripe_id: null })
          .eq("stripe_customer_id", customerId)
        break
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error)
  }

  return NextResponse.json({ received: true })
}

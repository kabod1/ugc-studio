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

        // Move payment to escrow
        const { data: payment } = await supabase
          .from("payments")
          .update({ status: "escrow", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", intent.id)
          .select("id, amount_cents, creator_id, campaign_id, campaigns(title), brands(company_name)")
          .single()

        if (payment) {
          const campaign = (payment as any).campaigns
          const brand = (payment as any).brands
          const amountEur = ((payment.amount_cents || 0) / 100).toFixed(2)

          // Notify the creator that payment is in escrow
          await supabase.from("notifications").insert({
            user_id: payment.creator_id,
            title: "Payment received! 💰",
            message: `€${amountEur} from ${brand?.company_name || "a brand"} for "${campaign?.title || "your campaign"}" is held in escrow. Submit your content to release it.`,
            type: "payment",
            link: "/creator/earnings",
          })
        }
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

        if (tier && subscription.status === "active") {
          const customerId = subscription.customer
          if (tier === "pro") {
            await supabase
              .from("creator_profiles")
              .update({
                subscription_tier: "pro",
                subscription_stripe_id: subscription.id,
                subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .eq("stripe_customer_id", customerId)
          } else {
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

        await supabase
          .from("brands")
          .update({ subscription_tier: "free", subscription_stripe_id: null })
          .eq("stripe_customer_id", customerId)

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

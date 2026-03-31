import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data, error } = await supabase
      .from("content_submissions")
      .select("*, campaigns(title, brand_id), creator_profiles(display_name, user_id)")
      .eq("id", params.id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { status, feedback } = body

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (feedback) updateData.brand_feedback = feedback
    if (status === "approved") updateData.approved_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("content_submissions")
      .update(updateData)
      .eq("id", params.id)
      .select("*, campaigns(id, title, brand_id), creator_profiles(id, display_name, user_id, stripe_connect_account_id, stripe_connect_onboarded)")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // When content is approved, auto-release escrow payment to creator
    if (status === "approved" && data) {
      const svc = createServiceClient()
      const campaign = (data as any).campaigns
      const creator = (data as any).creator_profiles

      // Find escrow payment for this campaign + creator
      const { data: payment } = await svc
        .from("payments")
        .select("id, amount_cents, platform_fee_cents, creator_id")
        .eq("campaign_id", campaign?.id)
        .eq("creator_id", creator?.id)
        .eq("status", "escrow")
        .limit(1)
        .single()

      if (payment) {
        const connectId = creator?.stripe_connect_onboarded ? creator?.stripe_connect_account_id : null
        const transferAmount = (payment.amount_cents || 0) - (payment.platform_fee_cents || 0)

        if (connectId && transferAmount > 0) {
          try {
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
              .eq("id", payment.id)

            // Notify creator: paid out
            await svc.from("notifications").insert({
              user_id: creator.user_id,
              title: "You've been paid! 🎉",
              message: `€${(transferAmount / 100).toFixed(2)} has been transferred to your account for approved content on "${campaign?.title}".`,
              type: "payment",
              link: "/creator/earnings",
            })

            // Notify brand: payment released
            const { data: brandUser } = await svc
              .from("brands")
              .select("user_id")
              .eq("id", campaign?.brand_id)
              .single()

            if (brandUser) {
              await svc.from("notifications").insert({
                user_id: brandUser.user_id,
                title: "Escrow released",
                message: `Payment for approved content on "${campaign?.title}" has been released to ${creator?.display_name}.`,
                type: "payment",
                link: "/dashboard/payments",
              })
            }
          } catch (transferError) {
            console.error("Auto-release transfer failed:", transferError)
            // Still mark payment as released-pending so brand knows
            await svc
              .from("payments")
              .update({ status: "released", updated_at: new Date().toISOString() })
              .eq("id", payment.id)
          }
        } else {
          // No Stripe Connect — mark as released, manual payout needed
          await svc
            .from("payments")
            .update({ status: "released", updated_at: new Date().toISOString() })
            .eq("id", payment.id)

          // Notify creator that content was approved, payout pending setup
          if (creator?.user_id) {
            await svc.from("notifications").insert({
              user_id: creator.user_id,
              title: "Content approved! Set up payouts 💸",
              message: `Your content for "${campaign?.title}" was approved. Set up your payout method to receive €${(transferAmount / 100).toFixed(2)}.`,
              type: "payment",
              link: "/creator/earnings",
            })
          }
        }
      } else {
        // No escrow payment — just notify creator of approval
        if (creator?.user_id) {
          await svc.from("notifications").insert({
            user_id: creator.user_id,
            title: "Content approved! ✅",
            message: `Your content submission for "${campaign?.title}" has been approved by the brand.`,
            type: "content",
            link: "/creator",
          })
        }
      }
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

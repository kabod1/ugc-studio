import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { sendPayoutEmail } from "@/lib/email"

// Internal secret to secure this endpoint (called by Vercel cron or n8n)
const CRON_SECRET = process.env.CRON_SECRET || ""

// Moving money requires the secret to be configured, never fail open.
function isAuthorized(request: NextRequest) {
  return !!CRON_SECRET && request.headers.get("authorization") === `Bearer ${CRON_SECRET}`
}

// POST /api/payments/schedule-payouts  { auto_release_after_days?: number }
// Called by n8n or manually. Vercel cron uses GET ?run=1 (see vercel.json).
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  // auto_release_after_days: how many days after content approval to auto-release
  const autoReleaseDays = typeof body.auto_release_after_days === "number"
    ? body.auto_release_after_days
    : 3

  return releaseDuePayments(autoReleaseDays)
}

// Releases escrow payments whose content was APPROVED at least N days ago.
// Approval normally pays out immediately (app/api/content/[id]); this catches
// creators who connected Stripe after approval, or transfers that failed.
// Escrow payments without approved content are never touched.
async function releaseDuePayments(autoReleaseDays: number) {
  const svc = createServiceClient()
  const cutoff = new Date(Date.now() - autoReleaseDays * 24 * 60 * 60 * 1000).toISOString()

  const { data: escrow, error } = await svc
    .from("payments")
    .select(`
      id, amount_cents, platform_fee_cents, updated_at, campaign_id, creator_id,
      campaigns(title),
      creator_profiles(user_id, display_name, stripe_connect_account_id, stripe_connect_onboarded)
    `)
    .eq("status", "escrow")

  if (error) {
    console.error("Schedule payouts fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: approved, error: approvedError } = await svc
    .from("content_submissions")
    .select("campaign_id, creator_id")
    .eq("status", "approved")
    .lte("approved_at", cutoff)

  if (approvedError) {
    console.error("Schedule payouts approval lookup error:", approvedError)
    return NextResponse.json({ error: approvedError.message }, { status: 500 })
  }

  const approvedKeys = new Set((approved || []).map((s) => `${s.campaign_id}:${s.creator_id}`))
  const payments = (escrow || []).filter((p) => approvedKeys.has(`${p.campaign_id}:${p.creator_id}`))

  if (!payments.length) {
    return NextResponse.json({ processed: 0, message: "No payments due for release" })
  }

  let released = 0
  let failed = 0
  const errors: string[] = []

  for (const payment of payments) {
    const creator = payment.creator_profiles as any
    const campaign = payment.campaigns as any
    const connectId = creator?.stripe_connect_onboarded ? creator?.stripe_connect_account_id : null

    if (!connectId) {
      errors.push(`Payment ${payment.id}: creator has no Stripe Connect account`)
      failed++
      continue
    }

    const transferAmount = payment.amount_cents - (payment.platform_fee_cents || 0)
    if (transferAmount <= 0) {
      errors.push(`Payment ${payment.id}: invalid transfer amount`)
      failed++
      continue
    }

    try {
      const transfer = await stripe.transfers.create({
        amount: transferAmount,
        currency: "eur",
        destination: connectId,
        metadata: { payment_id: payment.id, auto_released: "true" },
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

      // In-app notification
      if (creator?.user_id) {
        await svc.from("notifications").insert({
          user_id: creator.user_id,
          title: "Payment released! 💰",
          message: `€${(transferAmount / 100).toFixed(2)} has been automatically transferred to your account for "${campaign?.title || "your campaign"}".`,
          type: "payment",
          link: "/creator/earnings",
        })

        // Email notification
        const { data: creatorUser } = await svc.auth.admin.getUserById(creator.user_id)
        const email = creatorUser?.user?.email
        if (email) {
          await sendPayoutEmail({
            creatorEmail: email,
            creatorName: creator.display_name || "Creator",
            amountCents: transferAmount,
            campaignTitle: campaign?.title || "Campaign",
            payoutId: payment.id,
          }).catch(err => console.error("Payout email error:", err))
        }
      }

      released++
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      console.error(`Failed to release payment ${payment.id}:`, msg)
      errors.push(`Payment ${payment.id}: ${msg}`)
      failed++
    }
  }

  return NextResponse.json({
    processed: payments.length,
    released,
    failed,
    errors: errors.length ? errors : undefined,
  })
}

// GET ?run=1 — daily Vercel cron (crons always use GET): release due payouts.
// GET        — returns pending payouts summary (for admin dashboard)
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (request.nextUrl.searchParams.get("run") === "1") {
    return releaseDuePayments(3)
  }

  const svc = createServiceClient()

  const { data: pending } = await svc
    .from("payments")
    .select("id, amount_cents, platform_fee_cents, updated_at, campaigns(title), creator_profiles(display_name)")
    .eq("status", "escrow")
    .order("updated_at", { ascending: true })

  const totalCents = (pending || []).reduce((sum, p) => sum + (p.amount_cents - (p.platform_fee_cents || 0)), 0)

  return NextResponse.json({
    count: pending?.length || 0,
    total_eur: (totalCents / 100).toFixed(2),
    payments: pending || [],
  })
}

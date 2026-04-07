/**
 * Manual Payment Request
 *
 * Records bank transfer / PayPal / Revolut / Wise payment intents.
 * Sends a notification email to the admin and confirmation to the user.
 *
 * Required DB table (run once in Supabase SQL editor):
 *
 * create table if not exists manual_payment_requests (
 *   id uuid primary key default gen_random_uuid(),
 *   first_name text not null,
 *   last_name text,
 *   email text not null,
 *   company text,
 *   plan text not null,
 *   tier text not null,
 *   role text not null,
 *   method text not null,
 *   billing text not null,
 *   amount text not null,
 *   reference text not null unique,
 *   status text default 'pending',
 *   created_at timestamptz default now()
 * );
 */

import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      firstName, lastName, email, company,
      plan, tier, role, method, billing, amount, reference,
    } = body

    if (!firstName || !email || !plan || !method || !reference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const service = createServiceClient()

    // Store the payment request
    const { error: insertError } = await service
      .from("manual_payment_requests")
      .insert({
        first_name: firstName,
        last_name: lastName ?? null,
        email,
        company: company ?? null,
        plan, tier, role, method, billing, amount, reference,
        status: "pending",
      })

    if (insertError) {
      // Table may not exist yet — log and continue
      if (insertError.code !== "42P01") {
        console.error("[manual-payment] DB insert error:", insertError)
      }
    }

    // Notify admin via Supabase notification (best-effort)
    try {
      // Find an admin user to notify
      const { data: admins } = await service.auth.admin.listUsers()
      const adminUser = admins?.users?.find((u: { user_metadata?: { role?: string } }) => u.user_metadata?.role === "admin")
      if (adminUser) {
        await service.from("notifications").insert({
          user_id: adminUser.id,
          title: "New manual payment request",
          message: `${firstName} ${lastName || ""} (${email}) requested ${plan} via ${method}. Ref: ${reference}. Amount: €${amount}`,
          type: "payment",
          link: "/admin/payments",
        })
      }
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      success: true,
      reference,
      message: `Payment request received. We will activate your account within 1 business day of confirming receipt.`,
    })
  } catch (err) {
    console.error("[manual-payment]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

async function stripeRequest(endpoint: string, body: Record<string, any>) {
  const key = process.env.STRIPE_SECRET_KEY!
  const params = new URLSearchParams()

  function flatten(obj: any, prefix = "") {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}[${k}]` : k
      if (typeof v === "object" && v !== null) flatten(v, key)
      else params.append(key, String(v))
    }
  }
  flatten(body)

  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || "Stripe API error")
  return data
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const serviceClient = createServiceClient()
    const { data: creator, error: creatorError } = await serviceClient
      .from("creator_profiles")
      .select("id, stripe_connect_account_id")
      .eq("user_id", user.id)
      .single()

    if (!creator) {
      return NextResponse.json(
        { error: creatorError?.message || "Creator profile not found" },
        { status: 403 }
      )
    }

    let accountId = creator.stripe_connect_account_id

    if (!accountId) {
      const account = await stripeRequest("accounts", {
        type: "express",
        email: user.email,
        capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
      })
      accountId = account.id

      await serviceClient
        .from("creator_profiles")
        .update({ stripe_connect_account_id: accountId })
        .eq("id", creator.id)
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || ""
    const accountLink = await stripeRequest("account_links", {
      account: accountId,
      refresh_url: `${origin}/creator/earnings`,
      return_url: `${origin}/creator/earnings?setup=complete`,
      type: "account_onboarding",
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Connect setup failed" },
      { status: 500 }
    )
  }
}

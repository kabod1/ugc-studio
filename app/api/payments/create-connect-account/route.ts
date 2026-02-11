import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

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
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: {
          transfers: { requested: true },
        },
      })
      accountId = account.id

      await serviceClient
        .from("creator_profiles")
        .update({ stripe_connect_account_id: accountId })
        .eq("id", creator.id)
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || ""
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/creator/earnings`,
      return_url: `${origin}/creator/earnings?setup=complete`,
      type: "account_onboarding",
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error: any) {
    const message = error?.raw?.message || error?.message || "Connect setup failed"
    const code = error?.raw?.code || error?.code || "unknown"
    return NextResponse.json(
      { error: `${message} (code: ${code})` },
      { status: 500 }
    )
  }
}

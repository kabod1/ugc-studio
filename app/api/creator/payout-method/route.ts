import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payout = user.user_metadata?.payout || null
    return NextResponse.json({ payout })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { method, wise_email, paypal_email, bank_name, account_name, account_number, swift_code, iban } = body

    if (!method) return NextResponse.json({ error: "method required" }, { status: 400 })

    const payout = {
      method,
      ...(method === "wise" && { wise_email }),
      ...(method === "paypal" && { paypal_email }),
      ...(method === "bank" && { bank_name, account_name, account_number, swift_code, iban }),
    }

    const svc = createServiceClient()
    const { error } = await svc.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, payout },
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true, payout })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

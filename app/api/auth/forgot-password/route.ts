import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })

    const supabase = createServiceClient()

    // Generate a real recovery link without sending email through Supabase
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
    })

    if (error || !data?.properties?.action_link) {
      console.error("generateLink error:", error)
      // Don't reveal whether the email exists or not
      return NextResponse.json({ success: true })
    }

    const resetLink = data.properties.action_link

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.error("RESEND_API_KEY not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
    const appName = "Townshub"

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${appName} <${fromEmail}>`,
        to: email,
        subject: `Reset your ${appName} password`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #111; margin-bottom: 8px;">Reset your password</h2>
            <p style="color: #444; margin-bottom: 24px;">
              You requested a password reset for your ${appName} account (<strong>${email}</strong>).
            </p>
            <a href="${resetLink}"
               style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #fff;
                      text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
              Reset Password
            </a>
            <p style="color: #888; font-size: 13px; margin-top: 32px;">
              This link expires in 1 hour. If you didn&apos;t request a password reset, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #aaa; font-size: 12px;">
              ${appName} &mdash; If the button above doesn&apos;t work, copy and paste this URL:<br />
              <a href="${resetLink}" style="color: #7c3aed; word-break: break-all;">${resetLink}</a>
            </p>
          </div>
        `,
      }),
    })

    if (!emailRes.ok) {
      const emailError = await emailRes.json().catch(() => ({}))
      console.error("Resend error:", emailError)
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("POST /api/auth/forgot-password error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

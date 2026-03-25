import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })

    const supabase = createServiceClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ugc-studio-zeta.vercel.app"

    // Generate recovery OTP — we'll build our own redirect URL to avoid
    // Supabase's redirect URL whitelist requirement
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
    })

    if (error || !data?.properties?.email_otp) {
      console.error("generateLink error:", error)
      // Don't reveal whether the email exists — always return success
      return NextResponse.json({ success: true })
    }

    // Build our own reset URL pointing directly to /reset-password
    const otp = data.properties.email_otp
    const resetLink = `${appUrl}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(otp)}`

    const gmailUser = process.env.GMAIL_USER
    const gmailPass = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailPass) {
      console.error("GMAIL_USER or GMAIL_APP_PASSWORD not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    })

    await transporter.sendMail({
      from: `Townshub <${gmailUser}>`,
      to: email,
      subject: "Reset your Townshub password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #111; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #444; margin-bottom: 24px;">
            You requested a password reset for your Townshub account (<strong>${email}</strong>).
          </p>
          <a href="${resetLink}"
             style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #fff;
                    text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
            Reset Password
          </a>
          <p style="color: #888; font-size: 13px; margin-top: 32px;">
            This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #aaa; font-size: 12px;">
            Townshub &mdash; If the button above doesn't work, copy and paste this URL:<br />
            <a href="${resetLink}" style="color: #7c3aed; word-break: break-all;">${resetLink}</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("POST /api/auth/forgot-password error:", err)
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 })
  }
}

import nodemailer from "nodemailer"

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

const FROM = `UGC Studio <${process.env.GMAIL_USER}>`
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ugc-studio-zeta.vercel.app"

export async function sendCampaignAcceptanceEmail({
  creatorEmail,
  creatorName,
  campaignTitle,
  brandName,
  budgetCents,
  contractId,
  brief,
}: {
  creatorEmail: string
  creatorName: string
  campaignTitle: string
  brandName: string
  budgetCents: number
  contractId: string
  brief?: string
}) {
  const budgetFormatted = budgetCents > 0
    ? `€${(budgetCents / 100).toFixed(2)}`
    : "To be confirmed"

  const transporter = createTransporter()
  await transporter.sendMail({
    from: FROM,
    to: creatorEmail,
    subject: `🎉 You've been accepted for "${campaignTitle}"`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
        <div style="background:#7c3aed;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Application Accepted! 🎉</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
          <p style="font-size:16px;margin-bottom:16px">Hi <strong>${creatorName}</strong>,</p>
          <p style="color:#444;margin-bottom:24px">
            Great news! <strong>${brandName}</strong> has accepted your application for the campaign:
          </p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:24px">
            <p style="margin:0 0 8px;font-size:18px;font-weight:600">${campaignTitle}</p>
            <p style="margin:0;color:#7c3aed;font-weight:600;font-size:16px">Payment: ${budgetFormatted}</p>
          </div>
          ${brief ? `
          <div style="margin-bottom:24px">
            <h3 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280">Campaign Brief</h3>
            <p style="color:#444;margin:0;white-space:pre-wrap">${brief}</p>
          </div>
          ` : ""}
          <p style="color:#444;margin-bottom:24px">
            A contract has been prepared for your review. Please log in to your dashboard to review and sign it before you begin creating content.
          </p>
          <a href="${APP_URL}/creator"
             style="display:inline-block;padding:14px 32px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px">
            View Contract &amp; Get Started →
          </a>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
          <p style="color:#9ca3af;font-size:12px;margin:0">
            UGC Studio · <a href="${APP_URL}" style="color:#7c3aed">ugc-studio-zeta.vercel.app</a>
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendCampaignBriefEmail({
  creatorEmail,
  creatorName,
  campaignTitle,
  brandName,
  brief,
  deliverables,
  deadline,
  budgetCents,
}: {
  creatorEmail: string
  creatorName: string
  campaignTitle: string
  brandName: string
  brief: string
  deliverables: string[]
  deadline?: string
  budgetCents: number
}) {
  const budgetFormatted = budgetCents > 0 ? `€${(budgetCents / 100).toFixed(2)}` : "TBC"
  const deadlineFormatted = deadline ? new Date(deadline).toLocaleDateString("en-IE", { dateStyle: "long" }) : "Flexible"

  const transporter = createTransporter()
  await transporter.sendMail({
    from: FROM,
    to: creatorEmail,
    subject: `📋 Campaign Brief: "${campaignTitle}" by ${brandName}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
        <div style="background:#7c3aed;padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">Campaign Brief</h1>
          <p style="color:#e9d5ff;margin:8px 0 0;font-size:14px">${brandName} · ${campaignTitle}</p>
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
          <p>Hi <strong>${creatorName}</strong>,</p>
          <p style="color:#444">Here's everything you need to get started with your campaign content.</p>

          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:24px 0">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div><p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase">Payment</p><p style="margin:4px 0 0;font-weight:600;color:#7c3aed">${budgetFormatted}</p></div>
              <div><p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase">Deadline</p><p style="margin:4px 0 0;font-weight:600">${deadlineFormatted}</p></div>
            </div>
          </div>

          <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin-bottom:8px">Brief</h3>
          <p style="color:#444;margin-bottom:24px;white-space:pre-wrap">${brief}</p>

          ${deliverables.length > 0 ? `
          <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin-bottom:8px">Deliverables</h3>
          <ul style="margin:0 0 24px;padding-left:20px;color:#444">
            ${deliverables.map(d => `<li style="margin-bottom:6px">${d}</li>`).join("")}
          </ul>
          ` : ""}

          <a href="${APP_URL}/creator"
             style="display:inline-block;padding:14px 32px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
            Go to Dashboard →
          </a>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
          <p style="color:#9ca3af;font-size:12px;margin:0">UGC Studio · Questions? Reply to this email.</p>
        </div>
      </div>
    `,
  })
}

export async function sendContractEmail({
  creatorEmail,
  creatorName,
  campaignTitle,
  brandName,
  contractId,
  totalAmountCents,
  terms,
}: {
  creatorEmail: string
  creatorName: string
  campaignTitle: string
  brandName: string
  contractId: string
  totalAmountCents: number
  terms: string
}) {
  const amount = totalAmountCents > 0 ? `€${(totalAmountCents / 100).toFixed(2)}` : "TBC"
  const transporter = createTransporter()
  await transporter.sendMail({
    from: FROM,
    to: creatorEmail,
    subject: `📄 Contract ready to sign: "${campaignTitle}"`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
        <div style="background:#7c3aed;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Contract Ready to Sign</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
          <p>Hi <strong>${creatorName}</strong>,</p>
          <p style="color:#444">
            <strong>${brandName}</strong> has prepared a contract for the <strong>${campaignTitle}</strong> campaign.
            Please review and sign it to confirm your participation.
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:24px 0">
            <p style="margin:0;font-size:14px;color:#166534"><strong>Total payment: ${amount}</strong> (held in escrow, released on content approval)</p>
          </div>
          <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin-bottom:8px">Contract Terms</h3>
          <p style="color:#444;margin-bottom:24px;white-space:pre-wrap;font-size:14px">${terms}</p>
          <a href="${APP_URL}/creator"
             style="display:inline-block;padding:14px 32px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
            Review &amp; Sign Contract →
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">
            Contract ID: ${contractId} · UGC Studio
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendPayoutEmail({
  creatorEmail,
  creatorName,
  amountCents,
  campaignTitle,
  payoutId,
}: {
  creatorEmail: string
  creatorName: string
  amountCents: number
  campaignTitle: string
  payoutId: string
}) {
  const amount = `€${(amountCents / 100).toFixed(2)}`
  const transporter = createTransporter()
  await transporter.sendMail({
    from: FROM,
    to: creatorEmail,
    subject: `💰 Payment sent: ${amount} for "${campaignTitle}"`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
        <div style="background:#16a34a;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Payment Sent! 💰</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
          <p>Hi <strong>${creatorName}</strong>,</p>
          <p style="color:#444">Your payment for <strong>${campaignTitle}</strong> has been released.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
            <p style="margin:0;font-size:32px;font-weight:700;color:#16a34a">${amount}</p>
            <p style="margin:8px 0 0;color:#166534;font-size:14px">Transferred to your connected Stripe account</p>
          </div>
          <p style="color:#444">Funds typically arrive within 1–2 business days. Check your Stripe dashboard for transfer status.</p>
          <a href="${APP_URL}/creator"
             style="display:inline-block;padding:14px 32px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
            View Earnings →
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">Payout ID: ${payoutId} · UGC Studio</p>
        </div>
      </div>
    `,
  })
}

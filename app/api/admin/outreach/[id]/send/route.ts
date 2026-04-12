import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"
import { sendOutreachEmail } from "@/lib/email"

async function requireAdmin() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  if (session.user.user_metadata?.role !== "admin") return null
  return session
}

// POST /api/admin/outreach/[id]/send — send outreach email to a prospect
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { subject, message, template } = body

  if (!subject || !message) {
    return NextResponse.json({ error: "subject and message are required" }, { status: 400 })
  }

  const svc = createServiceClient()

  // Fetch prospect
  const { data: prospect, error: fetchErr } = await svc
    .from("outreach_prospects")
    .select("*")
    .eq("id", params.id)
    .single()

  if (fetchErr || !prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 })
  }

  // Send email
  try {
    await sendOutreachEmail({
      to: prospect.email,
      name: prospect.name,
      subject,
      message,
      type: prospect.type,
    })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to send email: " + err.message }, { status: 500 })
  }

  // Record the outreach in history + update status
  const newEmailCount = (prospect.emails_sent || 0) + 1
  const { data: updated, error: updateErr } = await svc
    .from("outreach_prospects")
    .update({
      status: "contacted",
      emails_sent: newEmailCount,
      last_contacted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select()
    .single()

  // Insert into outreach_emails history
  await svc.from("outreach_emails").insert({
    prospect_id: params.id,
    subject,
    message,
    sent_by: session.user.id,
    sent_at: new Date().toISOString(),
  })

  return NextResponse.json({ success: true, prospect: updated })
}

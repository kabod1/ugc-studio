import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

async function requireAdmin() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  if (session.user.user_metadata?.role !== "admin") return null
  return session
}

function extractDomain(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, "")
  } catch {
    const cleaned = url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0]
    return cleaned || null
  }
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/)
  return { first: parts[0] || "", last: parts.slice(1).join(" ") || "" }
}

async function findEmail(name: string, domain: string): Promise<{ email: string | null; score: number | null }> {
  const key = process.env.HUNTER_API_KEY
  if (!key || !domain || !name) return { email: null, score: null }
  const { first, last } = splitName(name)
  try {
    const url = new URL("https://api.hunter.io/v2/email-finder")
    url.searchParams.set("domain", domain)
    url.searchParams.set("first_name", first)
    url.searchParams.set("last_name", last)
    url.searchParams.set("api_key", key)
    const res = await fetch(url.toString())
    if (!res.ok) return { email: null, score: null }
    const data = await res.json()
    return { email: data?.data?.email || null, score: data?.data?.score || null }
  } catch {
    return { email: null, score: null }
  }
}

// POST /api/admin/outreach/relookup-emails
// Re-runs Hunter.io lookup for all prospects that have no email or a flagged fake email
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const { all = false } = body // if true, re-lookup even prospects that already have an email

  const svc = createServiceClient()

  // Fetch prospects to process
  let query = svc.from("outreach_prospects").select("id, name, email, website")
  if (!all) {
    // Only ones with no email
    query = query.or("email.is.null,email.eq.")
  }

  const { data: prospects, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!prospects?.length) return NextResponse.json({ updated: 0, not_found: 0, message: "No prospects to process" })

  let updated = 0
  let not_found = 0

  // Process in small batches to avoid hammering Hunter.io rate limits
  for (const p of prospects) {
    const domain = extractDomain(p.website || "")
    if (!domain) { not_found++; continue }

    const { email, score } = await findEmail(p.name, domain)

    if (email) {
      await svc
        .from("outreach_prospects")
        .update({ email, updated_at: new Date().toISOString() })
        .eq("id", p.id)
      updated++
    } else {
      not_found++
    }

    // Small delay to respect Hunter.io rate limits
    await new Promise(r => setTimeout(r, 200))
  }

  return NextResponse.json({
    updated,
    not_found,
    total: prospects.length,
    message: `Updated ${updated} emails, ${not_found} not found`,
  })
}

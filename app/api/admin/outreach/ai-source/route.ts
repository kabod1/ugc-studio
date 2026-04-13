import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

async function requireAdmin() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  if (session.user.user_metadata?.role !== "admin") return null
  return session
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function extractDomain(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, "")
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] || null
  }
}

// Hunter.io Domain Search — finds the best contact email for a company domain
async function findBestEmailForDomain(domain: string): Promise<{
  email: string | null
  name: string | null
  score: number | null
}> {
  const key = process.env.HUNTER_API_KEY
  if (!key || !domain) return { email: null, name: null, score: null }

  try {
    const url = new URL("https://api.hunter.io/v2/domain-search")
    url.searchParams.set("domain", domain)
    url.searchParams.set("limit", "5")
    url.searchParams.set("type", "personal") // prefer personal contacts over generic@
    url.searchParams.set("api_key", key)

    const res = await fetch(url.toString())
    if (!res.ok) return { email: null, name: null, score: null }
    const data = await res.json()

    const emails: any[] = data?.data?.emails || []
    if (!emails.length) return { email: null, name: null, score: null }

    // Pick highest-confidence result, prefer marketing/founder roles
    const priority = ["marketing", "founder", "ceo", "cmo", "owner", "director", "manager"]
    const sorted = [...emails].sort((a, b) => {
      const aPos = priority.findIndex(p => (a.position || "").toLowerCase().includes(p))
      const bPos = priority.findIndex(p => (b.position || "").toLowerCase().includes(p))
      if (aPos !== bPos) return (aPos === -1 ? 999 : aPos) - (bPos === -1 ? 999 : bPos)
      return (b.confidence || 0) - (a.confidence || 0)
    })

    const best = sorted[0]
    const name = [best.first_name, best.last_name].filter(Boolean).join(" ") || null
    return { email: best.value || null, name, score: best.confidence || null }
  } catch {
    return { email: null, name: null, score: null }
  }
}

// Hunter.io Email Finder — for a specific person by name + domain
async function findEmailByName(firstName: string, lastName: string, domain: string): Promise<{
  email: string | null; score: number | null
}> {
  const key = process.env.HUNTER_API_KEY
  if (!key || !domain) return { email: null, score: null }
  try {
    const url = new URL("https://api.hunter.io/v2/email-finder")
    url.searchParams.set("domain", domain)
    url.searchParams.set("first_name", firstName)
    url.searchParams.set("last_name", lastName)
    url.searchParams.set("api_key", key)
    const res = await fetch(url.toString())
    if (!res.ok) return { email: null, score: null }
    const data = await res.json()
    return { email: data?.data?.email || null, score: data?.data?.score || null }
  } catch {
    return { email: null, score: null }
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { type, industry, location, count = 10, extra_criteria } = body

  if (!type || !["brand", "creator"].includes(type)) {
    return NextResponse.json({ error: "type must be 'brand' or 'creator'" }, { status: 400 })
  }

  const isBrand = type === "brand"

  // For brands: ask AI for real, well-known DTC brands with verified domains
  // For creators: ask AI for real creators with verified social handles
  const systemPrompt = isBrand
    ? `You are a B2B sales researcher. Generate a list of REAL, well-known direct-to-consumer (DTC) brands.
       These must be brands that genuinely exist and actively sell products online.
       Only include brands where you are highly confident the company and website are real and active.
       Stick to well-established brands you know are real — do NOT invent or guess.
       Do NOT include email — it will be looked up via their domain.
       Return JSON: { "prospects": [ ...${count} items ] }
       Each item: {
         "company": "Brand Name",
         "website": "https://www.realbrand.com",
         "instagram": "@realbrandhandle",
         "industry": "Beauty|Fashion|Tech|...",
         "why_good_fit": "1-2 sentences why UGC would work for them",
         "estimated_budget": "€500–€2,000/mo"
       }`
    : `You are a talent researcher. Generate a list of REAL content creators active on Instagram or TikTok.
       Only include creators you are highly confident are real and currently active.
       Stick to creators you genuinely know exist — do NOT invent handles or people.
       Do NOT include email — it will be found separately.
       Return JSON: { "prospects": [ ...${count} items ] }
       Each item: {
         "name": "Creator Full Name",
         "company": "Their niche e.g. Beauty & Skincare Creator",
         "instagram": "@realhandle",
         "tiktok": "@realhandle",
         "industry": "their niche",
         "why_good_fit": "1-2 sentences",
         "content_types": "Product Reviews, Unboxing, Tutorials"
       }`

  const userPrompt = [
    isBrand ? `Find ${count} real DTC brands` : `Find ${count} real UGC creators`,
    industry ? `in the ${industry} space` : "",
    location ? `based in or selling in ${location}` : "in Europe or English-speaking markets",
    extra_criteria || "",
  ].filter(Boolean).join(", ")

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5, // lower temp = less hallucination
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0].message.content || "{}"
    let parsed: any
    try { parsed = JSON.parse(raw) } catch {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 })
    }

    const list: any[] = Array.isArray(parsed)
      ? parsed
      : (parsed.prospects || parsed.brands || parsed.creators || [])

    // For brands: use Hunter.io Domain Search to find the best real contact
    // For creators: no Hunter lookup (they use personal emails not on their domain)
    const prospects = await Promise.all(list.map(async (p: any, i: number) => {
      let email = ""
      let contactName = (p.name || "").trim()
      let emailScore: number | null = null

      if (isBrand && p.website) {
        const domain = extractDomain(p.website)
        if (domain) {
          // Add small delay between requests to respect rate limits
          await new Promise(r => setTimeout(r, i * 250))
          const result = await findBestEmailForDomain(domain)
          if (result.email) {
            email = result.email
            emailScore = result.score
            // Use the real contact name found by Hunter if we don't have one
            if (!contactName && result.name) contactName = result.name
          }
        }
      }

      return {
        name: contactName || (p.company || ""),
        email,
        company: (p.company || "").trim(),
        type,
        website: (p.website || "").trim() || null,
        instagram: (p.instagram || "").trim() || null,
        tiktok: (p.tiktok || "").trim() || null,
        industry: p.industry || industry || null,
        notes: [
          p.why_good_fit ? `Why good fit: ${p.why_good_fit}` : null,
          p.estimated_budget ? `Est. budget: ${p.estimated_budget}` : null,
          p.content_types ? `Content: ${p.content_types}` : null,
        ].filter(Boolean).join("\n") || null,
        source: "AI Sourced",
        email_score: emailScore,
      }
    }))

    return NextResponse.json({ prospects })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

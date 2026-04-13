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

// Extract domain from a URL string
function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, "")
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0]
  }
}

// Split a full name into first/last
function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/)
  return { first: parts[0] || "", last: parts.slice(1).join(" ") || "" }
}

// Call Hunter.io Email Finder for a single prospect
async function findEmail(name: string, domain: string): Promise<{ email: string | null; score: number | null }> {
  if (!domain || !name) return { email: null, score: null }
  const { first, last } = splitName(name)
  const key = process.env.HUNTER_API_KEY
  if (!key) return { email: null, score: null }

  try {
    const url = new URL("https://api.hunter.io/v2/email-finder")
    url.searchParams.set("domain", domain)
    url.searchParams.set("first_name", first)
    url.searchParams.set("last_name", last)
    url.searchParams.set("api_key", key)

    const res = await fetch(url.toString())
    if (!res.ok) return { email: null, score: null }
    const data = await res.json()
    const email = data?.data?.email || null
    const score = data?.data?.score || null
    return { email, score }
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

  const systemPrompt = isBrand
    ? `You are a B2B sales researcher helping a UGC marketing platform find brands to onboard.
       UGC Studio connects brands with content creators for user-generated content campaigns (product videos, reviews, reels, unboxings, etc).
       Generate REAL, existing brands that would benefit from UGC marketing. Only include brands with real websites.
       Focus on brands that sell physical or digital products to consumers, have a social media presence, and would benefit from authentic creator content.
       Do NOT invent fictional companies. Only suggest real brands you are confident exist.
       Do NOT include email addresses — they will be looked up separately.
       Return a JSON object with key "prospects" containing an array of exactly ${count} items. Each item must have:
       - name: real contact person's full name at the company (marketing manager, founder, etc.)
       - company: real brand/company name
       - website: real website URL (e.g. https://www.brandname.com)
       - instagram: real Instagram handle starting with @
       - industry: one of Beauty, Fashion, Tech, Food & Beverage, Fitness, Travel, Lifestyle, Gaming, Education, Finance, Health, Home & Garden, Pets, Entertainment, Automotive, Sports
       - why_good_fit: 1-2 sentence explanation of why this brand would benefit from UGC campaigns
       - estimated_budget: rough monthly UGC budget range like "€500–€2,000/mo"
       Do NOT include markdown. Return only valid JSON.`
    : `You are a talent researcher helping a UGC marketing platform find content creators to onboard.
       UGC Studio pays creators to produce user-generated content for brands. No minimum follower count required.
       Generate REAL, existing content creators who are active on Instagram or TikTok.
       Only suggest creators you are confident are real and active.
       Do NOT invent fictional people. Do NOT include email addresses — they will be looked up separately.
       Return a JSON object with key "prospects" containing an array of exactly ${count} items. Each item must have:
       - name: creator's real full name
       - company: their content niche/specialty (e.g. "Beauty & Skincare Creator", "Fitness & Lifestyle")
       - website: their website, linktree, or blog URL if they have one (or empty string)
       - instagram: real Instagram handle starting with @
       - tiktok: real TikTok handle starting with @
       - industry: their primary niche
       - why_good_fit: 1-2 sentence explanation of why this creator would be great for UGC work
       - content_types: comma-separated list like "Product Reviews, Unboxing, Tutorials"
       Do NOT include markdown. Return only valid JSON.`

  const userPrompt = [
    isBrand ? `Find ${count} real brand prospects` : `Find ${count} real UGC creator prospects`,
    industry ? `in the ${industry} industry/niche` : "",
    location ? `based in or targeting ${location}` : "across Europe and English-speaking markets",
    extra_criteria ? `Additional criteria: ${extra_criteria}` : "",
  ].filter(Boolean).join(" ")

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0].message.content || "{}"
    let parsed: any
    try {
      parsed = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 })
    }

    const list: any[] = Array.isArray(parsed)
      ? parsed
      : (parsed.prospects || parsed.brands || parsed.creators || [])

    // Build base prospects
    const base = list.map((p: any) => ({
      name: (p.name || "").trim(),
      email: "",
      company: (p.company || p.niche || "").trim(),
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
      email_score: null as number | null,
    }))

    // Look up real emails via Hunter.io in parallel
    const withEmails = await Promise.all(
      base.map(async (p) => {
        const domain = p.website ? extractDomain(p.website) : null
        if (!domain) return p
        const { email, score } = await findEmail(p.name, domain)
        return { ...p, email: email || "", email_score: score }
      })
    )

    return NextResponse.json({ prospects: withEmails })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

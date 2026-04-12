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
       Generate realistic, specific brand prospects that would genuinely benefit from UGC marketing.
       Focus on brands that sell physical or digital products to consumers, have a social media presence, and would benefit from authentic creator content.
       Return a JSON array of exactly ${count} prospects. Each prospect must have these fields:
       - name: contact person's full name (realistic)
       - email: realistic business email (firstname@companyname.com or marketing@companyname.com)
       - company: brand/company name
       - website: realistic website URL
       - instagram: Instagram handle starting with @
       - industry: one of Beauty, Fashion, Tech, Food & Beverage, Fitness, Travel, Lifestyle, Gaming, Education, Finance, Health, Home & Garden, Pets, Entertainment, Automotive, Sports
       - why_good_fit: 1-2 sentence explanation of why this brand would benefit from UGC campaigns
       - estimated_budget: rough monthly UGC budget range like "€500–€2,000/mo"
       Do NOT include markdown. Return only valid JSON array.`
    : `You are a talent researcher helping a UGC marketing platform find content creators to onboard.
       UGC Studio pays creators to produce user-generated content (product videos, reviews, reels, unboxings, tutorials) for brands.
       No minimum follower count required — quality content matters more than audience size.
       Generate realistic, specific creator prospects who produce quality content and would want to earn money creating UGC for brands.
       Return a JSON array of exactly ${count} prospects. Each prospect must have these fields:
       - name: creator's full name (realistic, diverse)
       - email: realistic personal email (firstname.lastname@gmail.com or similar)
       - company: their content niche/specialty (e.g. "Beauty & Skincare Creator", "Fitness & Lifestyle")
       - instagram: Instagram handle starting with @
       - tiktok: TikTok handle starting with @
       - industry: their primary niche
       - why_good_fit: 1-2 sentence explanation of why this creator would be great for UGC work
       - content_types: comma-separated list like "Product Reviews, Unboxing, Tutorials"
       Do NOT include markdown. Return only valid JSON array.`

  const userPrompt = [
    isBrand ? `Find ${count} brand prospects` : `Find ${count} UGC creator prospects`,
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
      temperature: 0.8,
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0].message.content || "{}"
    let parsed: any
    try {
      parsed = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 })
    }

    // Handle both { prospects: [...] } and [...] shapes
    const list: any[] = Array.isArray(parsed) ? parsed : (parsed.prospects || parsed.brands || parsed.creators || [])

    const prospects = list.map((p: any) => ({
      name: p.name || "",
      email: p.email || "",
      company: p.company || p.niche || "",
      type,
      website: p.website || null,
      instagram: p.instagram || null,
      tiktok: p.tiktok || null,
      industry: p.industry || industry || null,
      why_good_fit: p.why_good_fit || null,
      estimated_budget: p.estimated_budget || null,
      content_types: p.content_types || null,
      notes: [
        p.why_good_fit ? `Why good fit: ${p.why_good_fit}` : null,
        p.estimated_budget ? `Est. budget: ${p.estimated_budget}` : null,
        p.content_types ? `Content: ${p.content_types}` : null,
      ].filter(Boolean).join("\n") || null,
      source: "AI Sourced",
    }))

    return NextResponse.json({ prospects })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

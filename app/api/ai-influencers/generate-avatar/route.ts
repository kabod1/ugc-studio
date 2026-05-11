import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    // Free tier cannot generate virtual avatars
    if (!brand.subscription_tier || brand.subscription_tier === "free") {
      return NextResponse.json({
        error: "Virtual influencer generation requires a Starter plan or higher.",
        upgradeUrl: "/dashboard/settings/billing",
      }, { status: 403 })
    }

    const body = await request.json()
    const { mode, prompt, style_data, brand_description, count = 1 } = body

    if (!mode || !["text_prompt", "style_picker", "ai_generate_4"].includes(mode)) {
      return NextResponse.json({ error: "mode must be text_prompt, style_picker, or ai_generate_4" }, { status: 400 })
    }

    let finalPrompt = ""

    if (mode === "text_prompt") {
      if (!prompt) return NextResponse.json({ error: "prompt is required for text_prompt mode" }, { status: 400 })
      finalPrompt = `Portrait photo of a person: ${prompt}. Clear face, professional lighting, looking at camera, suitable for a brand spokesperson.`
    }

    if (mode === "style_picker") {
      if (!style_data) return NextResponse.json({ error: "style_data is required for style_picker mode" }, { status: 400 })
      const { age_range, gender, ethnicity, style } = style_data
      finalPrompt = `Portrait photo of a ${age_range ?? "young adult"} ${ethnicity ?? ""} ${gender ?? "person"}. Style: ${style ?? "professional"}. Clear face, professional lighting, looking at camera, suitable for a brand spokesperson.`
    }

    if (mode === "ai_generate_4") {
      if (!brand_description) return NextResponse.json({ error: "brand_description is required for ai_generate_4 mode" }, { status: 400 })
      // Expand brand description into a DALL-E prompt via GPT-4o
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a creative director. Given a brand description, write a concise DALL-E image generation prompt for a brand spokesperson portrait. Output ONLY the prompt, no explanation.",
          },
          {
            role: "user",
            content: `Brand: ${brand_description}`,
          },
        ],
        max_tokens: 150,
      })
      finalPrompt = completion.choices[0].message.content ?? brand_description
    }

    const numImages = mode === "ai_generate_4" ? 4 : Math.min(count, 1)

    // Generate with DALL-E 3 (max 1 at a time; loop for 4)
    const imageUrls: string[] = []

    for (let i = 0; i < numImages; i++) {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      })

      const tempUrl = imageResponse.data?.[0]?.url
      if (!tempUrl) continue

      // Download and upload to R2
      const imgRes = await fetch(tempUrl)
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
      const key = `ai-influencers/${brand.id}/avatar-${Date.now()}-${i}.png`

      await r2.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: imgBuffer,
        ContentType: "image/png",
      }))

      imageUrls.push(`${R2_PUBLIC_URL}/${key}`)
    }

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 })
    }

    return NextResponse.json({ image_urls: imageUrls })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}

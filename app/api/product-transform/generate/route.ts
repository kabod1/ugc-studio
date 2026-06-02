import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { generateProductAdVideo } from "@/lib/n8n/workflows"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const STYLE_PROMPTS: Record<string, string> = {
  viral: "vibrant high-contrast social media style, bold neon accents, trending Gen-Z aesthetic, eye-catching gradient background, dynamic composition, viral-ready",
  luxury: "premium luxury editorial style, gold and obsidian palette, elegant serif typography, generous white space, sophisticated lighting, aspirational",
  minimal: "clean minimalist design, pure white background, thin refined typography, subtle drop shadow, plenty of breathing room, modern Scandinavian aesthetic",
  bold: "maximum impact bold design, high-contrast black and vibrant color blocking, oversized typography, dramatic angles, punchy graphic style",
}

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

    const body = await request.json()
    const { job_type, source_image_url, style = "viral", cta_text } = body

    if (!job_type || !["ad_video", "infographic"].includes(job_type)) {
      return NextResponse.json({ error: "job_type must be ad_video or infographic" }, { status: 400 })
    }
    if (!source_image_url) {
      return NextResponse.json({ error: "source_image_url is required" }, { status: 400 })
    }

    // Create job record
    const { data: job, error: insertError } = await supabase
      .from("product_transform_jobs")
      .insert({
        brand_id: brand.id,
        job_type,
        status: "processing",
        source_image_url,
        style,
        cta_text: cta_text || null,
      })
      .select()
      .single()

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 })

    if (job_type === "infographic") {
      // Synchronous: analyze product → generate infographic via DALL-E 3
      try {
        // Step 1: Use GPT-4o vision to analyze the product
        const analysis = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: source_image_url, detail: "low" },
              },
              {
                type: "text",
                text: "Analyze this product image. Return JSON with: {\"product\": \"<name/category>\", \"features\": [\"<feature1>\", \"<feature2>\", \"<feature3>\"], \"colors\": \"<dominant colors>\", \"audience\": \"<target audience>\"}. Keep each feature under 6 words. Output ONLY valid JSON.",
              },
            ],
          }],
          max_tokens: 200,
        })

        let productData: any = {}
        try {
          const raw = analysis.choices[0].message.content ?? "{}"
          productData = JSON.parse(raw.replace(/```json|```/g, "").trim())
        } catch {}

        // Step 2: Build DALL-E 3 infographic prompt
        const styleDesc = STYLE_PROMPTS[style] || STYLE_PROMPTS.viral
        const features = (productData.features || []).slice(0, 3).join(", ")
        const ctaLine = cta_text ? `Call-to-action text: "${cta_text}"` : ""

        const dallePrompt = `Professional product infographic advertisement for ${productData.product || "a premium product"}.
Style: ${styleDesc}.
Key selling points displayed as bold text callouts: ${features || "Premium Quality, Fast Delivery, Best Value"}.
${ctaLine}
Layout: product prominently featured center, feature callouts around it with icons, brand-ready design.
No watermarks, no real brand logos. Photorealistic product rendering.`

        // Step 3: Generate infographic
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: dallePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        })

        const tempUrl = imageResponse.data?.[0]?.url
        if (!tempUrl) throw new Error("Image generation returned no URL")

        // Step 4: Download and upload to R2
        const imgRes = await fetch(tempUrl)
        const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
        const key = `product-studio/${brand.id}/infographic-${job.id}.png`

        await r2.send(new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: imgBuffer,
          ContentType: "image/png",
        }))

        const output_url = `${R2_PUBLIC_URL}/${key}`

        // Step 5: Mark completed
        await supabase
          .from("product_transform_jobs")
          .update({ status: "completed", output_url, completed_at: new Date().toISOString() })
          .eq("id", job.id)

        return NextResponse.json({ job_id: job.id, status: "completed", output_url })
      } catch (genErr: any) {
        await supabase
          .from("product_transform_jobs")
          .update({ status: "failed", error_message: genErr.message || "Generation failed" })
          .eq("id", job.id)
        return NextResponse.json({ error: genErr.message || "Generation failed" }, { status: 500 })
      }
    }

    // ad_video: trigger n8n directly
    const requestUrl = new URL(request.url)
    const callbackUrl = `${requestUrl.origin}/api/product-transform/callback`

    try {
      await generateProductAdVideo(source_image_url, job.id, callbackUrl, brand.id, style, cta_text, '')
    } catch (n8nErr) {
      await supabase
        .from("product_transform_jobs")
        .update({
          status: "failed",
          error_message: n8nErr instanceof Error ? n8nErr.message : "Failed to trigger workflow",
        })
        .eq("id", job.id)
    }

    return NextResponse.json({ job_id: job.id, status: "processing" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

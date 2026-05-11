# AI Influencer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an AI Influencers tab to the UGC Videos page, letting brands create AI personas (uploaded photo or DALL-E generated) and use them as the presenter face in generated UGC videos, with HeyGen premium path locked to Scale tier.

**Architecture:** New `ai_influencers` table stores persona metadata. Four new API routes handle CRUD and avatar generation. The UGC Videos page gains a tab layout (Generate Video / AI Influencers / Past Videos). The existing n8n generate-ugc-video route is extended to accept influencer params and enforce the HeyGen monthly cap.

**Tech Stack:** Next.js 14 App Router, TypeScript, Supabase (Postgres + RLS), Cloudflare R2 (via `@aws-sdk/client-s3`), OpenAI DALL-E 3 (via `openai` package), ElevenLabs (existing), n8n webhook (existing).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `lib/constants.ts` | Add `aiInfluencers` + `heygenVideosPerMonth` to `SUBSCRIPTION_TIERS`, update prices |
| Modify | `lib/n8n/types.ts` | Extend `UGCVideoParams` with influencer fields |
| Modify | `lib/n8n/workflows.ts` | Extend `generateUGCVideo()` signature |
| Create | `app/api/ai-influencers/route.ts` | GET list + POST create influencer |
| Create | `app/api/ai-influencers/[id]/route.ts` | DELETE single influencer |
| Create | `app/api/ai-influencers/generate-avatar/route.ts` | POST DALL-E 3 avatar generation |
| Create | `app/api/ai-influencers/upload-avatar/route.ts` | POST photo upload → R2 |
| Modify | `app/api/n8n/generate-ugc-video/route.ts` | Accept influencer params, enforce HeyGen cap |
| Create | `components/ugc/influencer-selector.tsx` | Dropdown to pick influencer on Generate tab |
| Create | `components/ugc/create-influencer-wizard.tsx` | 4-step wizard modal |
| Create | `components/ugc/ai-influencers-tab.tsx` | Library grid + Create button |
| Modify | `app/(dashboard)/dashboard/ugc-videos/page.tsx` | Add tabs, wire influencer selector |

---

## Task 1: Update `lib/constants.ts`

**Files:**
- Modify: `lib/constants.ts`

- [ ] **Step 1: Update SUBSCRIPTION_TIERS with new prices and new fields**

Replace the existing `SUBSCRIPTION_TIERS` block (lines 26–31) with:

```ts
export const SUBSCRIPTION_TIERS = {
  free:    { name: "Free",    price: 0,     campaigns: 2,  seatsPerCampaign: 5,  teamSeats: 1,  ugcVideosPerMonth: 2,  aiInfluencers: 0,  heygenVideosPerMonth: 0  },
  starter: { name: "Starter", price: 1900,  campaigns: 5,  seatsPerCampaign: 20, teamSeats: 1,  ugcVideosPerMonth: 10, aiInfluencers: 1,  heygenVideosPerMonth: 0  },
  growth:  { name: "Growth",  price: 8700,  campaigns: 10, seatsPerCampaign: 50, teamSeats: 3,  ugcVideosPerMonth: 50, aiInfluencers: 5,  heygenVideosPerMonth: 0  },
  scale:   { name: "Scale",   price: 24300, campaigns: -1, seatsPerCampaign: -1, teamSeats: -1, ugcVideosPerMonth: -1, aiInfluencers: -1, heygenVideosPerMonth: 20 },
} as const
```

- [ ] **Step 2: Verify TypeScript still compiles**

```bash
npx tsc --noEmit
```
Expected: no errors related to constants.ts.

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts
git commit -m "feat: add aiInfluencers + heygenVideosPerMonth to subscription tiers, update prices to 350% ROI"
```

---

## Task 2: Extend n8n types and workflow function

**Files:**
- Modify: `lib/n8n/types.ts`
- Modify: `lib/n8n/workflows.ts`

- [ ] **Step 1: Extend `UGCVideoParams` in `lib/n8n/types.ts`**

Replace the existing `UGCVideoParams` interface (lines 69–75):

```ts
export interface UGCVideoParams {
  product_image_url: string
  job_id: string
  callback_url: string
  campaign_id?: string
  brand_id?: string
  avatar_image_url?: string
  generation_quality?: "standard" | "premium"
  heygen_avatar_id?: string
  voice_id?: string
  personality?: string
}
```

- [ ] **Step 2: Extend `generateUGCVideo()` in `lib/n8n/workflows.ts`**

Replace the existing `generateUGCVideo` function (lines 65–83):

```ts
export async function generateUGCVideo(
  productImageUrl: string,
  jobId: string,
  callbackUrl: string,
  campaignId?: string,
  brandId?: string,
  influencerParams?: {
    avatar_image_url?: string
    generation_quality?: "standard" | "premium"
    heygen_avatar_id?: string
    voice_id?: string
    personality?: string
  }
) {
  const params: UGCVideoParams = {
    product_image_url: productImageUrl,
    job_id: jobId,
    callback_url: callbackUrl,
    campaign_id: campaignId,
    brand_id: brandId,
    ...influencerParams,
  }
  return callN8nWebhook<UGCVideoResult>("/ugc-generate-video", params)
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/n8n/types.ts lib/n8n/workflows.ts
git commit -m "feat: extend UGCVideoParams and generateUGCVideo with influencer params"
```

---

## Task 3: Run Supabase database migrations

**Files:**
- No code files — Supabase SQL editor only

- [ ] **Step 1: Create the `ai_influencers` table**

Run this SQL in the Supabase SQL editor:

```sql
CREATE TABLE IF NOT EXISTS ai_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('uploaded', 'virtual')),
  avatar_url TEXT NOT NULL,
  voice_id TEXT,
  personality TEXT,
  style_data JSONB DEFAULT '{}',
  generation_quality TEXT DEFAULT 'standard' CHECK (generation_quality IN ('standard', 'premium')),
  heygen_avatar_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_influencers_brand ON ai_influencers(brand_id);
```

Expected: "Success. No rows returned."

- [ ] **Step 2: Add `ai_influencer_id` column to `ugc_video_jobs`**

```sql
ALTER TABLE ugc_video_jobs ADD COLUMN IF NOT EXISTS ai_influencer_id UUID;
```

Expected: "Success. No rows returned."

- [ ] **Step 3: Enable RLS and add policies**

```sql
ALTER TABLE ai_influencers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brand owners manage own influencers"
ON ai_influencers
FOR ALL
USING (
  brand_id IN (
    SELECT id FROM brands WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  brand_id IN (
    SELECT id FROM brands WHERE user_id = auth.uid()
  )
);
```

Expected: "Success. No rows returned."

- [ ] **Step 4: Verify table exists with correct columns**

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'ai_influencers'
ORDER BY ordinal_position;
```

Expected: rows for id, brand_id, name, type, avatar_url, voice_id, personality, style_data, generation_quality, heygen_avatar_id, created_at, updated_at.

---

## Task 4: API — List and create influencers

**Files:**
- Create: `app/api/ai-influencers/route.ts`

- [ ] **Step 1: Create the file**

```ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/constants"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    const { data: influencers, error } = await supabase
      .from("ai_influencers")
      .select("*")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ influencers: influencers ?? [] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
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

    // Enforce influencer slot limit
    const tier = (brand.subscription_tier || "free") as SubscriptionTier
    const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
    const limit = tierConfig.aiInfluencers as number

    if (limit === 0) {
      return NextResponse.json({
        error: "Your plan does not include AI Influencers. Upgrade to Starter or higher.",
        upgradeUrl: "/dashboard/settings/billing",
      }, { status: 403 })
    }

    if (limit !== -1) {
      const { count } = await supabase
        .from("ai_influencers")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)

      if ((count ?? 0) >= limit) {
        return NextResponse.json({
          error: `You've used all ${limit} AI Influencer slot${limit === 1 ? "" : "s"} on your plan. Upgrade for more.`,
          upgradeUrl: "/dashboard/settings/billing",
        }, { status: 403 })
      }
    }

    const body = await request.json()
    const { name, type, avatar_url, voice_id, personality, style_data, generation_quality, heygen_avatar_id } = body

    if (!name || !type || !avatar_url) {
      return NextResponse.json({ error: "name, type, and avatar_url are required" }, { status: 400 })
    }
    if (!["uploaded", "virtual"].includes(type)) {
      return NextResponse.json({ error: "type must be 'uploaded' or 'virtual'" }, { status: 400 })
    }

    // Only Scale can use premium quality
    const effectiveQuality = tier === "scale" ? (generation_quality ?? "standard") : "standard"

    const { data: influencer, error } = await supabase
      .from("ai_influencers")
      .insert({
        brand_id: brand.id,
        name,
        type,
        avatar_url,
        voice_id: voice_id ?? null,
        personality: personality ?? null,
        style_data: style_data ?? {},
        generation_quality: effectiveQuality,
        heygen_avatar_id: heygen_avatar_id ?? null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ influencer }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/ai-influencers/route.ts
git commit -m "feat: add GET/POST /api/ai-influencers with slot limit enforcement"
```

---

## Task 5: API — Delete influencer

**Files:**
- Create: `app/api/ai-influencers/[id]/route.ts`

- [ ] **Step 1: Create the file**

```ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    const { error } = await supabase
      .from("ai_influencers")
      .delete()
      .eq("id", params.id)
      .eq("brand_id", brand.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/api/ai-influencers/[id]/route.ts"
git commit -m "feat: add DELETE /api/ai-influencers/[id]"
```

---

## Task 6: API — Generate virtual avatar (DALL-E 3)

**Files:**
- Create: `app/api/ai-influencers/generate-avatar/route.ts`

- [ ] **Step 1: Verify OpenAI package is installed**

```bash
npm list openai
```
Expected: a version line like `openai@4.x.x`. If missing, run `npm install openai`.

- [ ] **Step 2: Create the file**

```ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const VOICE_PRESETS: Record<string, string> = {
  warm_friendly: "EXAVITQu4vr4xnSDxMaL",
  deep_authoritative: "VR6AewLTigWG4xSOukaG",
  energetic_youthful: "ErXwobaYiN019PkySvjV",
  professional_calm: "MF3mGyEYCl7XYWbV9V6O",
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

      const tempUrl = imageResponse.data[0]?.url
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/ai-influencers/generate-avatar/route.ts
git commit -m "feat: add POST /api/ai-influencers/generate-avatar with DALL-E 3 + R2 upload"
```

---

## Task 7: API — Upload avatar photo

**Files:**
- Create: `app/api/ai-influencers/upload-avatar/route.ts`

- [ ] **Step 1: Create the file**

```ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"

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

    // Free tier cannot create influencers at all (slot limit 0)
    if (!brand.subscription_tier || brand.subscription_tier === "free") {
      return NextResponse.json({
        error: "AI Influencers require a Starter plan or higher.",
        upgradeUrl: "/dashboard/settings/billing",
      }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, and WebP images are allowed" }, { status: 400 })
    }

    const maxSizeBytes = 10 * 1024 * 1024 // 10 MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "File size must be under 10 MB" }, { status: 400 })
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
    const key = `ai-influencers/${brand.id}/uploaded-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    const avatar_url = `${R2_PUBLIC_URL}/${key}`
    return NextResponse.json({ avatar_url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/ai-influencers/upload-avatar/route.ts
git commit -m "feat: add POST /api/ai-influencers/upload-avatar with R2 storage"
```

---

## Task 8: Update generate-ugc-video route with influencer + HeyGen cap

**Files:**
- Modify: `app/api/n8n/generate-ugc-video/route.ts`

- [ ] **Step 1: Replace the entire file content**

```ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateUGCVideo } from "@/lib/n8n/workflows"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { product_image_url, campaign_id, ai_influencer_id } = body

    if (!product_image_url) {
      return NextResponse.json({ error: "product_image_url required" }, { status: 400 })
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("id, subscription_tier")
      .eq("user_id", user.id)
      .single()

    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 })

    const tier = (brand.subscription_tier || "free") as SubscriptionTier
    const tierConfig = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
    const limit = tierConfig.ugcVideosPerMonth as number

    // Enforce standard video monthly limit
    if (limit !== -1) {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { count } = await supabase
        .from("ugc_video_jobs")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)
        .gte("created_at", startOfMonth)

      if ((count ?? 0) >= limit) {
        return NextResponse.json({
          error: `You've reached your monthly limit of ${limit} UGC video${limit === 1 ? "" : "s"}. Upgrade your plan for more.`,
          current: count,
          limit,
          upgradeUrl: "/dashboard/settings/billing",
        }, { status: 403 })
      }
    }

    // Resolve influencer if provided
    let influencerParams: {
      avatar_image_url?: string
      generation_quality?: "standard" | "premium"
      heygen_avatar_id?: string
      voice_id?: string | null
      personality?: string | null
    } | undefined

    if (ai_influencer_id) {
      const { data: influencer } = await supabase
        .from("ai_influencers")
        .select("*")
        .eq("id", ai_influencer_id)
        .eq("brand_id", brand.id)
        .single()

      if (!influencer) {
        return NextResponse.json({ error: "Influencer not found" }, { status: 404 })
      }

      const effectiveQuality: "standard" | "premium" =
        tier === "scale" && influencer.generation_quality === "premium" ? "premium" : "standard"

      // Enforce HeyGen monthly cap for premium
      if (effectiveQuality === "premium") {
        const heygenLimit = tierConfig.heygenVideosPerMonth as number
        if (heygenLimit > 0) {
          const now = new Date()
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

          const { count: heygenCount } = await supabase
            .from("ugc_video_jobs")
            .select("id", { count: "exact", head: true })
            .eq("brand_id", brand.id)
            .eq("generation_quality", "premium")
            .gte("created_at", startOfMonth)

          if ((heygenCount ?? 0) >= heygenLimit) {
            return NextResponse.json({
              error: `You've used all ${heygenLimit} premium HeyGen videos this month. Contact sales for a custom enterprise plan.`,
              upgradeUrl: "/dashboard/settings/billing",
            }, { status: 403 })
          }
        }
      }

      influencerParams = {
        avatar_image_url: influencer.avatar_url,
        generation_quality: effectiveQuality,
        heygen_avatar_id: influencer.heygen_avatar_id ?? undefined,
        voice_id: influencer.voice_id ?? undefined,
        personality: influencer.personality ?? undefined,
      }
    }

    const { data: job, error } = await supabase
      .from("ugc_video_jobs")
      .insert({
        brand_id: brand.id,
        campaign_id: campaign_id || null,
        product_image_url,
        ai_influencer_id: ai_influencer_id || null,
        generation_quality: influencerParams?.generation_quality ?? "standard",
        status: "pending",
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const requestUrl = new URL(request.url)
    const callbackUrl = `${requestUrl.origin}/api/n8n/ugc-video-callback`

    try {
      await generateUGCVideo(
        product_image_url,
        job.id,
        callbackUrl,
        campaign_id,
        brand.id,
        influencerParams
      )

      await supabase
        .from("ugc_video_jobs")
        .update({ status: "processing" })
        .eq("id", job.id)
    } catch (n8nError) {
      await supabase
        .from("ugc_video_jobs")
        .update({
          status: "failed",
          error_message: n8nError instanceof Error ? n8nError.message : "Failed to trigger workflow",
        })
        .eq("id", job.id)
    }

    return NextResponse.json({ job_id: job.id, status: "processing" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/n8n/generate-ugc-video/route.ts
git commit -m "feat: extend generate-ugc-video route with influencer params and HeyGen cap enforcement"
```

---

## Task 9: Create `InfluencerSelector` component

**Files:**
- Create: `components/ugc/influencer-selector.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client"

import { useEffect, useState } from "react"
import { Bot, ChevronDown } from "lucide-react"

interface AIInfluencer {
  id: string
  name: string
  type: "uploaded" | "virtual"
  avatar_url: string
  generation_quality: "standard" | "premium"
  voice_id: string | null
}

interface InfluencerSelectorProps {
  value: string | null
  onChange: (id: string | null, influencer: AIInfluencer | null) => void
  disabled?: boolean
}

export function InfluencerSelector({ value, onChange, disabled }: InfluencerSelectorProps) {
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch("/api/ai-influencers")
      .then((r) => r.json())
      .then((data) => setInfluencers(data.influencers ?? []))
      .catch(() => {})
  }, [])

  const selected = influencers.find((i) => i.id === value) ?? null

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-left hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
      >
        {selected ? (
          <>
            <img
              src={selected.avatar_url}
              alt={selected.name}
              className="h-6 w-6 rounded-full object-cover flex-shrink-0"
            />
            <span className="flex-1 truncate">{selected.name}</span>
            {selected.generation_quality === "premium" && (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">HeyGen</span>
            )}
          </>
        ) : (
          <>
            <Bot className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 text-muted-foreground">No influencer (generic avatar)</span>
          </>
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-11 z-20 w-full bg-popover border rounded-md shadow-lg py-1 max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => { onChange(null, null); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left"
            >
              <Bot className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">No influencer (generic avatar)</span>
            </button>
            {influencers.map((inf) => (
              <button
                key={inf.id}
                type="button"
                onClick={() => { onChange(inf.id, inf); setOpen(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left"
              >
                <img
                  src={inf.avatar_url}
                  alt={inf.name}
                  className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                />
                <span className="flex-1 truncate">{inf.name}</span>
                {inf.generation_quality === "premium" && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">HeyGen</span>
                )}
              </button>
            ))}
            {influencers.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">No influencers created yet</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ugc/influencer-selector.tsx
git commit -m "feat: add InfluencerSelector dropdown component"
```

---

## Task 10: Create `CreateInfluencerWizard` component

**Files:**
- Create: `components/ugc/create-influencer-wizard.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Upload, Sparkles, X, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react"

const VOICE_OPTIONS = [
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Warm & Friendly" },
  { id: "VR6AewLTigWG4xSOukaG", label: "Deep & Authoritative" },
  { id: "ErXwobaYiN019PkySvjV", label: "Energetic & Youthful" },
  { id: "MF3mGyEYCl7XYWbV9V6O", label: "Professional & Calm" },
]

interface CreateInfluencerWizardProps {
  onClose: () => void
  onCreated: () => void
  isScaleTier: boolean
}

type SourceType = "uploaded" | "virtual" | null
type VirtualMode = "text_prompt" | "style_picker" | "ai_generate_4"

export function CreateInfluencerWizard({ onClose, onCreated, isScaleTier }: CreateInfluencerWizardProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [sourceType, setSourceType] = useState<SourceType>(null)

  // Upload path
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Virtual path
  const [virtualMode, setVirtualMode] = useState<VirtualMode>("text_prompt")
  const [textPrompt, setTextPrompt] = useState("")
  const [styleData, setStyleData] = useState({ age_range: "", gender: "", ethnicity: "", style: "" })
  const [brandDescription, setBrandDescription] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  // Voice & Personality
  const [voiceId, setVoiceId] = useState<string | null>(null)
  const [personality, setPersonality] = useState("")
  const [generationQuality, setGenerationQuality] = useState<"standard" | "premium">("standard")

  const [saving, setSaving] = useState(false)

  const avatarUrl = sourceType === "uploaded" ? uploadedUrl : selectedImage

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/ai-influencers/upload-avatar", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUploadedUrl(data.avatar_url)
      toast.success("Photo uploaded!")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    setGeneratedImages([])
    setSelectedImage(null)
    try {
      const body =
        virtualMode === "text_prompt" ? { mode: "text_prompt", prompt: textPrompt } :
        virtualMode === "style_picker" ? { mode: "style_picker", style_data: styleData } :
        { mode: "ai_generate_4", brand_description: brandDescription }

      const res = await fetch("/api/ai-influencers/generate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGeneratedImages(data.image_urls)
      if (data.image_urls.length === 1) setSelectedImage(data.image_urls[0])
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!avatarUrl) return
    setSaving(true)
    try {
      const res = await fetch("/api/ai-influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type: sourceType,
          avatar_url: avatarUrl,
          voice_id: voiceId,
          personality: personality || null,
          generation_quality: generationQuality,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Influencer created!")
      onCreated()
      onClose()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const canGoNext =
    step === 1 ? (name.trim().length > 0 && sourceType !== null) :
    step === 2 ? (sourceType === "uploaded" ? uploadedUrl !== null : selectedImage !== null) :
    step === 3 ? true :
    false

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">Create AI Influencer</h2>
            <p className="text-xs text-muted-foreground">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-6 pt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="px-6 py-6 space-y-4">

          {/* Step 1 — Name & Source */}
          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Influencer Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah, Marcus, Luna..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">How do you want to create the avatar?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSourceType("uploaded")}
                    className={`border-2 rounded-lg p-4 text-center transition-colors ${sourceType === "uploaded" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"}`}
                  >
                    <Upload className="h-7 w-7 mx-auto mb-2 text-primary" />
                    <div className="font-medium text-sm">Upload Photo</div>
                    <div className="text-xs text-muted-foreground mt-1">Your brand ambassador</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceType("virtual")}
                    className={`border-2 rounded-lg p-4 text-center transition-colors ${sourceType === "virtual" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"}`}
                  >
                    <Sparkles className="h-7 w-7 mx-auto mb-2 text-primary" />
                    <div className="font-medium text-sm">Create Virtual</div>
                    <div className="text-xs text-muted-foreground mt-1">AI-generated persona</div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 2A — Upload Photo */}
          {step === 2 && sourceType === "uploaded" && (
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Ambassador Photo</label>
              {uploadedUrl ? (
                <div className="text-center space-y-3">
                  <img src={uploadedUrl} alt="Uploaded avatar" className="h-40 w-40 rounded-full object-cover mx-auto border-4 border-primary" />
                  <p className="text-sm text-green-600 font-medium">Photo uploaded successfully</p>
                  <button
                    type="button"
                    onClick={() => setUploadedUrl(null)}
                    className="text-sm text-muted-foreground underline"
                  >
                    Upload a different photo
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-10 cursor-pointer hover:border-primary/50 transition-colors">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-3" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                  )}
                  <span className="text-sm font-medium">{uploading ? "Uploading..." : "Drag & drop or click to upload"}</span>
                  <span className="text-xs text-muted-foreground mt-1">JPG, PNG · Clear face photo recommended · Max 10 MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              )}
            </div>
          )}

          {/* Step 2B — Create Virtual */}
          {step === 2 && sourceType === "virtual" && (
            <div className="space-y-3">
              {/* Mode tabs */}
              <div className="flex gap-2">
                {(["text_prompt", "style_picker", "ai_generate_4"] as VirtualMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setVirtualMode(m); setGeneratedImages([]); setSelectedImage(null) }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${virtualMode === m ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}
                  >
                    {m === "text_prompt" ? "Text Prompt" : m === "style_picker" ? "Style Picker" : "AI Generate 4"}
                  </button>
                ))}
              </div>

              {virtualMode === "text_prompt" && (
                <textarea
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="Describe your ideal influencer... e.g. 'Young woman, mid-20s, natural makeup, friendly smile'"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              )}

              {virtualMode === "style_picker" && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "age_range", label: "Age Range", options: ["18-24", "25-34", "35-44", "45+"] },
                    { key: "gender", label: "Gender", options: ["Woman", "Man", "Non-binary"] },
                    { key: "ethnicity", label: "Ethnicity", options: ["Asian", "Black", "Hispanic", "White", "Mixed", "Other"] },
                    { key: "style", label: "Style", options: ["Professional", "Casual", "Athletic", "Creative"] },
                  ].map(({ key, label, options }) => (
                    <div key={key}>
                      <label className="text-xs font-medium mb-1 block">{label}</label>
                      <select
                        value={(styleData as any)[key]}
                        onChange={(e) => setStyleData((s) => ({ ...s, [key]: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Any</option>
                        {options.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {virtualMode === "ai_generate_4" && (
                <textarea
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="Briefly describe your brand... e.g. 'Eco-friendly skincare brand targeting millennial women who care about sustainability'"
                  className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || (virtualMode === "text_prompt" && !textPrompt.trim()) || (virtualMode === "ai_generate_4" && !brandDescription.trim())}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
              >
                {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate</>}
              </button>

              {generatedImages.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2">
                    {generatedImages.length > 1 ? "Pick one:" : "Generated avatar:"}
                  </p>
                  <div className={`grid gap-2 ${generatedImages.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-[160px]"}`}>
                    {generatedImages.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setSelectedImage(url)}
                        className={`relative rounded-lg overflow-hidden border-2 aspect-square transition-colors ${selectedImage === url ? "border-primary" : "border-transparent hover:border-muted-foreground/50"}`}
                      >
                        <img src={url} alt="Generated avatar" className="w-full h-full object-cover" />
                        {selectedImage === url && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                            <Check className="h-6 w-6 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Voice & Personality */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Voice Style</label>
                <div className="space-y-2">
                  {VOICE_OPTIONS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoiceId(v.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ${voiceId === v.id ? "border-primary bg-primary/5 font-medium" : "border-input hover:bg-muted"}`}
                    >
                      {v.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setVoiceId(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ${voiceId === null ? "border-primary bg-primary/5 font-medium" : "border-input hover:bg-muted"}`}
                  >
                    Use global default
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Personality / Script Tone</label>
                  <textarea
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder='e.g. "Enthusiastic tech reviewer who speaks simply and focuses on real-world benefits..."'
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-1">GPT-4o uses this when writing the product review script</p>
                </div>
                {isScaleTier && (
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Generation Quality</label>
                    <div className="flex gap-2">
                      {(["standard", "premium"] as const).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setGenerationQuality(q)}
                          className={`flex-1 px-3 py-2 rounded-md text-sm border capitalize transition-colors ${generationQuality === q ? "border-primary bg-primary/5 font-medium" : "border-input hover:bg-muted"}`}
                        >
                          {q === "premium" ? "Premium (HeyGen)" : "Standard"}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Premium uses HeyGen for highest quality (20/mo included)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && avatarUrl && (
            <div className="text-center space-y-4">
              <img src={avatarUrl} alt={name} className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-primary" />
              <div>
                <p className="font-semibold text-lg">{name}</p>
                <p className="text-sm text-muted-foreground">
                  {sourceType === "uploaded" ? "Uploaded photo" : "AI Generated"}
                  {" · "}
                  {voiceId ? VOICE_OPTIONS.find((v) => v.id === voiceId)?.label ?? "Custom voice" : "Global default voice"}
                </p>
              </div>
              {personality && (
                <p className="text-sm text-muted-foreground bg-muted rounded-md px-4 py-2 text-left">
                  <span className="font-medium">Personality:</span> {personality}
                </p>
              )}
              <span className={`inline-block text-xs px-2 py-1 rounded font-medium ${generationQuality === "premium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                {generationQuality === "premium" ? "Premium (HeyGen)" : "Standard"}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !avatarUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {saving ? "Saving..." : "Create Influencer"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ugc/create-influencer-wizard.tsx
git commit -m "feat: add CreateInfluencerWizard 4-step modal component"
```

---

## Task 11: Create `AIInfluencersTab` component

**Files:**
- Create: `components/ugc/ai-influencers-tab.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Loader2, Bot } from "lucide-react"
import { CreateInfluencerWizard } from "./create-influencer-wizard"

interface AIInfluencer {
  id: string
  name: string
  type: "uploaded" | "virtual"
  avatar_url: string
  generation_quality: "standard" | "premium"
  voice_id: string | null
  personality: string | null
  created_at: string
}

interface AIInfluencersTabProps {
  isScaleTier: boolean
  influencerLimit: number
}

const VOICE_LABEL: Record<string, string> = {
  "EXAVITQu4vr4xnSDxMaL": "Warm & Friendly",
  "VR6AewLTigWG4xSOukaG": "Deep & Authoritative",
  "ErXwobaYiN019PkySvjV": "Energetic & Youthful",
  "MF3mGyEYCl7XYWbV9V6O": "Professional & Calm",
}

export function AIInfluencersTab({ isScaleTier, influencerLimit }: AIInfluencersTabProps) {
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([])
  const [loading, setLoading] = useState(true)
  const [showWizard, setShowWizard] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchInfluencers()
  }, [])

  async function fetchInfluencers() {
    try {
      const res = await fetch("/api/ai-influencers")
      const data = await res.json()
      setInfluencers(data.influencers ?? [])
    } catch {
      toast.error("Failed to load influencers")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this influencer? This cannot be undone.")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/ai-influencers/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setInfluencers((prev) => prev.filter((i) => i.id !== id))
      toast.success("Influencer deleted")
    } catch {
      toast.error("Failed to delete influencer")
    } finally {
      setDeletingId(null)
    }
  }

  const atLimit = influencerLimit !== -1 && influencers.length >= influencerLimit

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Your AI Influencers</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage your brand&apos;s AI personas
            {influencerLimit !== -1 && ` · ${influencers.length}/${influencerLimit} used`}
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          disabled={influencerLimit === 0 || atLimit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus className="h-4 w-4" />
          Create Influencer
        </button>
      </div>

      {influencerLimit === 0 && (
        <div className="border rounded-lg p-4 bg-muted/50 text-sm text-muted-foreground">
          AI Influencers are not available on the Free plan.{" "}
          <a href="/dashboard/settings/billing" className="text-primary underline">Upgrade to Starter</a> to create up to 1 influencer.
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {influencers.map((inf) => (
            <div key={inf.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-muted relative">
                <img src={inf.avatar_url} alt={inf.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <div className="font-semibold text-sm">{inf.name}</div>
                <div className="text-xs text-muted-foreground">
                  {inf.type === "uploaded" ? "Uploaded photo" : "AI Generated"}
                  {inf.voice_id && ` · ${VOICE_LABEL[inf.voice_id] ?? "Custom voice"}`}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${inf.generation_quality === "premium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    {inf.generation_quality === "premium" ? "Premium (HeyGen)" : "Standard"}
                  </span>
                  <button
                    onClick={() => handleDelete(inf.id)}
                    disabled={deletingId === inf.id}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                  >
                    {deletingId === inf.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          {influencerLimit !== 0 && !atLimit && (
            <button
              onClick={() => setShowWizard(true)}
              className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 p-6 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors min-h-[200px]"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Add Influencer</span>
            </button>
          )}

          {influencers.length === 0 && influencerLimit !== 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No influencers yet</p>
              <p className="text-sm mt-1">Create your first AI persona to appear in your videos</p>
            </div>
          )}
        </div>
      )}

      {showWizard && (
        <CreateInfluencerWizard
          onClose={() => setShowWizard(false)}
          onCreated={fetchInfluencers}
          isScaleTier={isScaleTier}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ugc/ai-influencers-tab.tsx
git commit -m "feat: add AIInfluencersTab component with library grid and delete"
```

---

## Task 12: Rewrite UGC Videos page with tabs

**Files:**
- Modify: `app/(dashboard)/dashboard/ugc-videos/page.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Video, Loader2, CheckCircle2, XCircle,
  Clock, Play, Download, RefreshCw, Sparkles, Image,
  MoreVertical, Trash2, RotateCcw, Copy, ExternalLink, Bot
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { AIInfluencersTab } from "@/components/ugc/ai-influencers-tab"
import { InfluencerSelector } from "@/components/ugc/influencer-selector"

type ActiveTab = "generate" | "influencers" | "past"

interface UGCVideoUsage {
  used: number
  limit: number
  tier: string
  tierKey: SubscriptionTier
  aiInfluencers: number
}

interface UGCVideoJob {
  id: string
  status: string
  product_image_url: string
  generated_image_url: string | null
  video_url: string | null
  caption: string | null
  tts_script: string | null
  error_message: string | null
  created_at: string
  completed_at: string | null
}

export default function UGCVideosPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("generate")
  const [jobs, setJobs] = useState<UGCVideoJob[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [productImageUrl, setProductImageUrl] = useState("")
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null)
  const [pollingJobId, setPollingJobId] = useState<string | null>(null)
  const [usage, setUsage] = useState<UGCVideoUsage | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
    fetchUsage()
  }, [])

  async function fetchUsage() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: brand } = await supabase
        .from("brands")
        .select("id, subscription_tier")
        .eq("user_id", user.id)
        .single()

      if (!brand) return

      const tierKey = (brand.subscription_tier || "free") as SubscriptionTier
      const tierConfig = SUBSCRIPTION_TIERS[tierKey] || SUBSCRIPTION_TIERS.free

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const { count } = await supabase
        .from("ugc_video_jobs")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)
        .gte("created_at", startOfMonth)

      setUsage({
        used: count ?? 0,
        limit: tierConfig.ugcVideosPerMonth,
        tier: tierConfig.name,
        tierKey,
        aiInfluencers: tierConfig.aiInfluencers,
      })
    } catch {
      // Silently fail
    }
  }

  useEffect(() => {
    if (!pollingJobId) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/n8n/ugc-video-status?job_id=${pollingJobId}`)
        const job = await res.json()
        if (job.status === "completed" || job.status === "failed") {
          setPollingJobId(null)
          fetchJobs()
          if (job.status === "completed") {
            toast.success("UGC video generated successfully!")
          } else {
            toast.error("Video generation failed: " + (job.error_message || "Unknown error"))
          }
        }
      } catch {
        // Continue polling
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [pollingJobId])

  async function fetchJobs() {
    try {
      const res = await fetch("/api/ugc-videos")
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs || [])
      }
    } catch (err) {
      console.error("Failed to fetch UGC jobs:", err)
    }
    setLoading(false)
  }

  async function handleGenerate() {
    if (!productImageUrl.trim()) {
      toast.error("Please enter a product image URL")
      return
    }
    setGenerating(true)
    try {
      const res = await fetch("/api/n8n/generate-ugc-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_image_url: productImageUrl,
          ai_influencer_id: selectedInfluencerId || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        if (res.status === 403 && err.upgradeUrl) {
          toast.error(err.error, {
            action: { label: "Upgrade", onClick: () => window.location.href = err.upgradeUrl },
            duration: 8000,
          })
          return
        }
        throw new Error(err.error || "Failed to start generation")
      }
      const { job_id } = await res.json()
      setPollingJobId(job_id)
      setProductImageUrl("")
      toast.success("UGC video generation started! This takes 3-5 minutes.")
      fetchJobs()
      fetchUsage()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleDelete(jobId: string) {
    if (!confirm("Are you sure you want to delete this video job?")) return
    try {
      const res = await fetch("/api/ugc-videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId }),
      })
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId))
        toast.success("Video job deleted")
      } else {
        toast.error("Failed to delete video job")
      }
    } catch {
      toast.error("Failed to delete video job")
    }
    setOpenMenuId(null)
  }

  async function handleRetry(job: UGCVideoJob) {
    setOpenMenuId(null)
    setProductImageUrl(job.product_image_url)
    setActiveTab("generate")
    toast.info("Product image URL loaded. Click 'Generate Video' to retry.")
  }

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
    setOpenMenuId(null)
  }

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    pending:    { icon: Clock,         color: "text-yellow-600 bg-yellow-100", label: "Queued" },
    processing: { icon: Loader2,       color: "text-blue-600 bg-blue-100",     label: "Processing" },
    completed:  { icon: CheckCircle2,  color: "text-green-600 bg-green-100",   label: "Completed" },
    failed:     { icon: XCircle,       color: "text-red-600 bg-red-100",       label: "Failed" },
  }

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "generate",    label: "Generate Video" },
    { id: "influencers", label: "AI Influencers" },
    { id: "past",        label: "Past Videos" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">AI UGC Video Generator</h1>
        <p className="text-muted-foreground">
          Powered by GPT-4o, ElevenLabs &amp; WaveSpeed · Premium: HeyGen
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.id === "generate" && <Video className="h-3.5 w-3.5 inline mr-1.5 mb-0.5" />}
              {tab.id === "influencers" && <Bot className="h-3.5 w-3.5 inline mr-1.5 mb-0.5" />}
              {tab.id === "past" && <Clock className="h-3.5 w-3.5 inline mr-1.5 mb-0.5" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Video Tab */}
      {activeTab === "generate" && (
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="font-semibold text-lg">Generate UGC Video Ad</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select an AI influencer and paste a product image URL to generate a realistic UGC video.
                  </p>
                </div>

                {/* Influencer selector */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">AI Influencer</label>
                  <InfluencerSelector
                    value={selectedInfluencerId}
                    onChange={(id) => setSelectedInfluencerId(id)}
                    disabled={generating}
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={productImageUrl}
                      onChange={(e) => setProductImageUrl(e.target.value)}
                      placeholder="Paste product image URL (e.g., https://example.com/product.jpg)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      disabled={generating}
                    />
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !productImageUrl.trim()}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
                  >
                    {generating ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Starting...</>
                    ) : (
                      <><Video className="h-4 w-4" /> Generate Video</>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Takes 3-5 minutes</span>
                    <span className="flex items-center gap-1"><Image className="h-3 w-3" /> 9:16 portrait format</span>
                    <span className="flex items-center gap-1"><Video className="h-3 w-3" /> AI lip-synced speech</span>
                  </div>
                  {usage && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      usage.limit === -1 ? "bg-green-100 text-green-700" :
                      usage.used >= usage.limit ? "bg-red-100 text-red-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {usage.limit === -1 ? "Unlimited" : `${usage.used}/${usage.limit} this month`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {pollingJobId && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Video generation in progress</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your AI UGC video is being created. This typically takes 3-5 minutes.
                    The page will update automatically when it&apos;s ready.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Influencers Tab */}
      {activeTab === "influencers" && usage && (
        <AIInfluencersTab
          isScaleTier={usage.tierKey === "scale"}
          influencerLimit={usage.aiInfluencers}
        />
      )}
      {activeTab === "influencers" && !usage && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Past Videos Tab */}
      {activeTab === "past" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Generated Videos</h2>
            <button
              onClick={fetchJobs}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-muted"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border rounded-lg p-4 animate-pulse">
                  <div className="aspect-[9/16] bg-muted rounded-md mb-3" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => {
                const status = statusConfig[job.status] || statusConfig.pending
                const StatusIcon = status.icon
                return (
                  <div key={job.id} className="bg-card border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {job.video_url ? (
                        <video
                          src={job.video_url}
                          className="w-full h-full object-cover"
                          controls
                          poster={job.generated_image_url || job.product_image_url}
                        />
                      ) : job.generated_image_url ? (
                        <img src={job.generated_image_url} alt="Generated" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {job.status === "processing" ? (
                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                          ) : job.status === "failed" ? (
                            <XCircle className="h-8 w-8 text-destructive" />
                          ) : (
                            <Clock className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className={`h-3 w-3 ${job.status === "processing" ? "animate-spin" : ""}`} />
                          {status.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{formatDate(job.created_at)}</span>
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                              className="p-1 rounded hover:bg-muted"
                            >
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                            {openMenuId === job.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                <div className="absolute right-0 top-8 z-20 w-48 bg-popover border rounded-md shadow-lg py-1">
                                  {job.video_url && (
                                    <>
                                      <a
                                        href={job.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full"
                                        onClick={() => setOpenMenuId(null)}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        Open video
                                      </a>
                                      <button
                                        onClick={() => handleCopyUrl(job.video_url!)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
                                      >
                                        <Copy className="h-4 w-4" />
                                        Copy video URL
                                      </button>
                                    </>
                                  )}
                                  {(job.status === "failed" || job.status === "pending") && (
                                    <button
                                      onClick={() => handleRetry(job)}
                                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
                                    >
                                      <RotateCcw className="h-4 w-4" />
                                      Retry generation
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(job.id)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {job.caption && <p className="text-sm text-muted-foreground line-clamp-2">{job.caption}</p>}
                      {job.error_message && <p className="text-sm text-destructive">{job.error_message}</p>}
                      {job.video_url && (
                        <div className="flex gap-2">
                          <a
                            href={job.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm hover:bg-muted flex-1 justify-center"
                          >
                            <Play className="h-3.5 w-3.5" /> View
                          </a>
                          <a
                            href={job.video_url}
                            download
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 flex-1 justify-center"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg">No videos generated yet</h3>
              <p className="text-muted-foreground mt-1">
                Go to the Generate Video tab to create your first AI UGC video ad
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Start dev server and manually verify all three tabs render**

```bash
npm run dev
```

Open `http://localhost:3000/dashboard/ugc-videos` and verify:
- Three tabs visible: Generate Video, AI Influencers, Past Videos
- Influencer selector dropdown appears under the Generate Video form
- AI Influencers tab loads without crash (shows empty state or existing influencers)
- Past Videos tab shows job list

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/dashboard/ugc-videos/page.tsx"
git commit -m "feat: convert UGC Videos page to three-tab layout with AI influencer selector"
```

---

## Task 13: Add `generation_quality` column to `ugc_video_jobs`

The updated generate route inserts a `generation_quality` column. Run this migration.

**Files:**
- No code — Supabase SQL editor only

- [ ] **Step 1: Add column**

```sql
ALTER TABLE ugc_video_jobs ADD COLUMN IF NOT EXISTS generation_quality TEXT DEFAULT 'standard';
```

Expected: "Success. No rows returned."

- [ ] **Step 2: Commit migration note**

```bash
git commit --allow-empty -m "chore: added generation_quality column to ugc_video_jobs (run in Supabase)"
```

---

## Spec Coverage Self-Check

| Spec requirement | Covered by |
|---|---|
| Three tabs on UGC Videos page | Task 12 |
| AI Influencers library grid | Task 11 |
| Create Influencer 4-step wizard | Task 10 |
| Upload Photo path → R2 | Task 7, Task 10 |
| Text Prompt / Style Picker / AI Generate 4 | Task 6, Task 10 |
| Voice presets + global default | Task 10 (step 3) |
| Personality field | Task 10 (step 3) |
| Review & Save (step 4) | Task 10 (step 4) |
| Standard vs Premium quality badge | Tasks 10, 11 |
| Influencer selector on Generate tab | Tasks 9, 12 |
| Tier slot limits (0/1/5/unlimited) | Task 1, Task 4 |
| HeyGen 20/month cap on Scale | Task 1, Task 8 |
| ai_influencer_id on ugc_video_jobs | Tasks 3, 8 |
| generation_quality on ugc_video_jobs | Task 13, Task 8 |
| n8n workflow extended with influencer params | Tasks 2, 8 |
| RLS on ai_influencers | Task 3 |
| New subscription prices ($19/$87/$243) | Task 1 |
| Free tier blocked from creating influencers | Tasks 4, 7, 11 |
| DALL-E 3 images stored in R2 | Task 6 |
| DELETE influencer route | Task 5 |

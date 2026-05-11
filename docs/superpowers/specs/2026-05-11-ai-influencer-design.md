# AI Influencer Feature — Design Spec
**Date:** 2026-05-11  
**Status:** Approved  

---

## Overview

Add an "AI Influencers" tab to the existing UGC Videos page. Brands create and manage a library of AI personas (uploaded photo or fully virtual). When generating UGC videos, they select which influencer appears — no real person needs to be on camera.

Two video generation tiers:
- **Standard** (all paid plans) — existing WaveSpeed + ElevenLabs + GPT-4o pipeline with avatar image passed as presenter face
- **Premium HeyGen** (Scale tier only) — HeyGen API for highest-quality talking head video

---

## UI Structure

The UGC Videos page gains three tabs:

| Tab | Content |
|-----|---------|
| 🎬 Generate Video | Existing generator card (unchanged) + influencer selector dropdown added |
| 🤖 AI Influencers | Library grid + Create Influencer wizard |
| 📂 Past Videos | Existing job list (unchanged) |

---

## AI Influencer Profile

Each influencer stores:

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `brand_id` | UUID | Owner brand |
| `name` | TEXT | e.g. "Sarah", "Marcus" |
| `type` | TEXT | `uploaded` or `virtual` |
| `avatar_url` | TEXT | Stored in Cloudflare R2 |
| `voice_id` | TEXT | ElevenLabs voice ID. NULL = global default |
| `personality` | TEXT | GPT-4o script tone prompt override |
| `style_data` | JSONB | Style picker selections (age, gender, ethnicity, style) |
| `generation_quality` | TEXT | Preferred quality: `standard` or `premium`. Actual quality gated by brand tier at generation time — Scale brands only can use `premium` |
| `heygen_avatar_id` | TEXT | Populated when premium HeyGen avatar is created |

---

## Database Changes

```sql
CREATE TABLE ai_influencers (
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

CREATE INDEX idx_ai_influencers_brand ON ai_influencers(brand_id);

-- Add influencer reference to video jobs
ALTER TABLE ugc_video_jobs ADD COLUMN IF NOT EXISTS ai_influencer_id UUID;
```

RLS: brand owners can manage own influencers only.

---

## Create Influencer Wizard (4 Steps)

### Step 1 — Name & Source
- Text input: influencer name
- Choice: **Upload Photo** or **Create Virtual**

### Step 2A — Upload Photo
- File upload (JPG/PNG) → uploads to Cloudflare R2 → stores URL
- Clear face photo recommended

### Step 2B — Create Virtual (3 sub-modes, tabbed)
- **Text Prompt** — free-text description → DALL-E 3 generates avatar
- **Style Picker** — dropdowns for age range, gender, ethnicity, style → builds prompt → DALL-E 3 generates
- **AI Generate 4** — short brand description → GPT-4o expands to prompt → DALL-E 3 generates 4 options → brand picks one

All virtual avatars stored in R2.

### Step 3 — Voice & Personality
- **Voice** — pick from ElevenLabs presets (Warm & Friendly, Deep & Authoritative, Energetic & Youthful, Professional & Calm) OR "Use global default"
- **Personality** — optional free-text script tone override for GPT-4o

### Step 4 — Review & Save
- Preview avatar image, name, voice, quality badge (Standard/Premium)
- Save button creates the `ai_influencers` row

---

## Video Generation Flow (Updated)

When a brand clicks "Generate Video":
1. Select AI Influencer from dropdown (or skip to use generic avatar)
2. Paste product image URL
3. Hit Generate

**Standard path (WaveSpeed):**  
`avatar_image_url` + `product_image_url` + influencer `personality` → n8n workflow → GPT-4o script → ElevenLabs TTS (influencer voice) → WaveSpeed lip-sync animation

**Premium path (HeyGen) — Scale tier only:**  
`heygen_avatar_id` + `product_image_url` + influencer `personality` → n8n workflow → GPT-4o script → HeyGen API (generates talking head video with synced audio)

---

## Tier Limits

| Feature | Free | Starter | Growth | Scale |
|---------|------|---------|--------|-------|
| Price/month | $0 | $19 | $87 | $243 |
| AI Influencer slots | 0 | 1 | 5 | Unlimited |
| Standard videos/month | 2 | 10 | 50 | Unlimited |
| Premium HeyGen videos/month | — | — | — | 20 |
| Virtual influencer generation | — | ✓ | ✓ | ✓ |
| Custom voice per influencer | — | ✓ | ✓ | ✓ |

HeyGen is hard-capped at 20 videos/month on Scale. Exceeding shows an enterprise contact prompt.

---

## Profitability (Scale tier)

| | Amount |
|-|--------|
| Revenue per customer | $243/mo |
| HeyGen API cost (20 videos @ ~$1.50) | ~$30/mo |
| OpenAI DALL-E (virtual gen) | ~$2/mo |
| Infrastructure share | ~$5/mo |
| **Net margin per Scale customer** | **~$206/mo** |
| **ROI** | **~350%** |

---

## New API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/ai-influencers` | GET | List brand's influencers |
| `/api/ai-influencers` | POST | Create influencer |
| `/api/ai-influencers/[id]` | DELETE | Delete influencer |
| `/api/ai-influencers/generate-avatar` | POST | DALL-E 3 virtual avatar generation |
| `/api/ai-influencers/upload-avatar` | POST | Upload photo → R2 |

---

## n8n Workflow Changes

Extend existing UGC video workflow to accept two new optional inputs:
- `avatar_image_url` — influencer face image URL (standard path)
- `generation_quality` — `standard` or `premium`
- `heygen_avatar_id` — HeyGen avatar ID (premium path only)
- `voice_id` — ElevenLabs voice ID override
- `personality` — script tone override

When `generation_quality = premium`, workflow skips WaveSpeed and calls HeyGen Talking Photo API instead.

---

## Updated Subscription Constants

```ts
// lib/constants.ts — updated SUBSCRIPTION_TIERS
free:    { price: 0,     ugcVideosPerMonth: 2,  aiInfluencers: 0,  heygenVideosPerMonth: 0  }
starter: { price: 1900,  ugcVideosPerMonth: 10, aiInfluencers: 1,  heygenVideosPerMonth: 0  }
growth:  { price: 8700,  ugcVideosPerMonth: 50, aiInfluencers: 5,  heygenVideosPerMonth: 0  }
scale:   { price: 24300, ugcVideosPerMonth: -1, aiInfluencers: -1, heygenVideosPerMonth: 20 }
```

Stripe price IDs for new prices need to be created in the Stripe dashboard and updated in `.env.local`.

---

## Out of Scope

- Influencer analytics (which influencer performs best)
- Team sharing of influencers across brand seats
- Influencer marketplace (selling avatars to other brands)
- Video editing after generation

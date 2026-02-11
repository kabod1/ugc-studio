import { z } from "zod"

export const creatorProfileSchema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
  bio: z.string().max(1000).optional(),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  country: z.string().optional(),
  city: z.string().optional(),
  languages: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  content_types: z.array(z.string()).optional(),
  tiktok_handle: z.string().optional(),
  instagram_handle: z.string().optional(),
  youtube_handle: z.string().optional(),
  base_rate_cents: z.number().int().min(0, "Rate must be positive").optional(),
  currency: z.string().length(3).optional(),
})

export const applicationSchema = z.object({
  campaign_id: z.string().uuid(),
  pitch: z.string().max(2000).optional(),
  proposed_rate_cents: z.number().int().positive("Proposed rate must be positive").optional(),
  proposed_deliverables: z.array(z.any()).optional(),
})

export type CreatorProfileFormData = z.infer<typeof creatorProfileSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>

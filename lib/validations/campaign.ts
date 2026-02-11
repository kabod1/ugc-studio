import { z } from "zod"

export const briefSchema = z.object({
  brief_objective: z.string().optional(),
  brief_deliverables: z.array(z.any()).optional(),
  brief_dos: z.string().optional(),
  brief_donts: z.string().optional(),
  brief_examples: z.array(z.string()).optional(),
  brief_mood_board_urls: z.array(z.string().url()).optional(),
})

export const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "completed", "cancelled"]).optional(),
  content_types: z.array(z.string()).optional(),
  required_platforms: z.array(z.string()).optional(),
  target_audience: z.string().optional(),
  age_range: z.string().optional(),
  gender_preference: z.string().optional(),
  location_requirements: z.array(z.string()).optional(),
  language_requirements: z.array(z.string()).optional(),
  min_followers: z.number().int().min(0).optional(),
  budget_cents: z.number().int().positive("Budget must be a positive amount"),
  budget_per_creator_cents: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  max_creators: z.number().int().min(1).optional(),
  application_deadline: z.string().optional(),
  content_deadline: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  usage_rights: z.enum(["exclusive", "non_exclusive", "limited", "perpetual"]).optional(),
  rights_duration_days: z.number().int().min(1).optional(),
  ...briefSchema.shape,
})

export type CampaignFormData = z.infer<typeof campaignSchema>

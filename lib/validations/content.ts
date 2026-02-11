import { z } from "zod"

export const contentSubmissionSchema = z.object({
  campaign_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content_type: z.enum([
    "video",
    "image",
    "story",
    "reel",
    "tiktok",
    "review",
    "unboxing",
    "testimonial",
  ]),
  file_url: z.string().url("A valid file URL is required"),
  file_type: z.string().optional(),
  file_size_bytes: z.number().int().optional(),
  thumbnail_url: z.string().url().optional(),
  duration_seconds: z.number().int().min(0).optional(),
  contract_id: z.string().uuid().optional(),
  parent_submission_id: z.string().uuid().optional(),
})

export const contentCommentSchema = z.object({
  submission_id: z.string().uuid(),
  comment: z.string().min(1, "Comment is required"),
  timestamp_seconds: z.number().min(0).optional(),
  x_position: z.number().min(0).max(1).optional(),
  y_position: z.number().min(0).max(1).optional(),
})

export type ContentSubmissionFormData = z.infer<typeof contentSubmissionSchema>
export type ContentCommentFormData = z.infer<typeof contentCommentSchema>

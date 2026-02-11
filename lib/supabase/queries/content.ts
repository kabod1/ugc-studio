import { SupabaseClient } from "@supabase/supabase-js"
import type { ContentSubmission, ContentComment, ContentStatus } from "@/types"

interface SubmissionFilters {
  campaignId?: string
  creatorId?: string
  status?: ContentStatus
}

export async function getSubmissions(
  supabase: SupabaseClient,
  filters?: SubmissionFilters
) {
  let query = supabase
    .from("content_submissions")
    .select("*, creator:creator_profiles(*), campaign:campaigns(*)")

  if (filters?.campaignId) {
    query = query.eq("campaign_id", filters.campaignId)
  }
  if (filters?.creatorId) {
    query = query.eq("creator_id", filters.creatorId)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as ContentSubmission[]
}

export async function getSubmissionById(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .from("content_submissions")
    .select(
      "*, creator:creator_profiles(*), campaign:campaigns(*), comments:content_comments(*, author:profiles(*))"
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as ContentSubmission
}

export async function createSubmission(
  supabase: SupabaseClient,
  data: {
    campaign_id: string
    creator_id: string
    contract_id?: string
    title?: string
    description?: string
    content_type: string
    file_url: string
    file_type?: string
    file_size_bytes?: number
    thumbnail_url?: string
    duration_seconds?: number
    parent_submission_id?: string
    version?: number
  }
) {
  const { data: submission, error } = await supabase
    .from("content_submissions")
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return submission as ContentSubmission
}

export async function updateSubmission(
  supabase: SupabaseClient,
  id: string,
  data: Partial<ContentSubmission>
) {
  const { data: submission, error } = await supabase
    .from("content_submissions")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return submission as ContentSubmission
}

export async function getComments(
  supabase: SupabaseClient,
  submissionId: string
) {
  const { data, error } = await supabase
    .from("content_comments")
    .select("*, author:profiles(*)")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data as ContentComment[]
}

export async function createComment(
  supabase: SupabaseClient,
  data: {
    submission_id: string
    author_id: string
    comment: string
    timestamp_seconds?: number
    x_position?: number
    y_position?: number
  }
) {
  const { data: comment, error } = await supabase
    .from("content_comments")
    .insert(data)
    .select("*, author:profiles(*)")
    .single()

  if (error) throw error
  return comment as ContentComment
}

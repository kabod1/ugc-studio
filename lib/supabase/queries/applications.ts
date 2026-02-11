import { SupabaseClient } from "@supabase/supabase-js"
import type { CampaignApplication, ApplicationStatus } from "@/types"

export async function getApplicationsByCampaign(
  supabase: SupabaseClient,
  campaignId: string
) {
  const { data, error } = await supabase
    .from("campaign_applications")
    .select("*, creator:creator_profiles(*), campaign:campaigns(*)")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as CampaignApplication[]
}

export async function getApplicationsByCreator(
  supabase: SupabaseClient,
  creatorId: string
) {
  const { data, error } = await supabase
    .from("campaign_applications")
    .select("*, campaign:campaigns(*, brand:brands(*))")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as CampaignApplication[]
}

export async function createApplication(
  supabase: SupabaseClient,
  data: {
    campaign_id: string
    creator_id: string
    pitch?: string
    proposed_rate_cents?: number
    proposed_deliverables?: unknown[]
  }
) {
  const { data: application, error } = await supabase
    .from("campaign_applications")
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return application as CampaignApplication
}

export async function updateApplicationStatus(
  supabase: SupabaseClient,
  id: string,
  status: ApplicationStatus,
  reviewedBy?: string
) {
  const updateData: Record<string, unknown> = {
    status,
    reviewed_at: new Date().toISOString(),
  }

  if (reviewedBy) {
    updateData.reviewed_by = reviewedBy
  }

  const { data, error } = await supabase
    .from("campaign_applications")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as CampaignApplication
}

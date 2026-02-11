import { SupabaseClient } from "@supabase/supabase-js"
import type { Campaign, CampaignStatus } from "@/types"

export async function getCampaigns(
  supabase: SupabaseClient,
  brandId?: string,
  status?: CampaignStatus,
  page = 1,
  limit = 20
) {
  let query = supabase
    .from("campaigns")
    .select("*, brand:brands(*)", { count: "exact" })

  if (brandId) {
    query = query.eq("brand_id", brandId)
  }
  if (status) {
    query = query.eq("status", status)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    campaigns: data as Campaign[],
    count: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function getCampaignById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*, brand:brands(*)")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Campaign
}

export async function createCampaign(
  supabase: SupabaseClient,
  data: Partial<Campaign>
) {
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return campaign as Campaign
}

export async function updateCampaign(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Campaign>
) {
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return campaign as Campaign
}

export async function deleteCampaign(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("campaigns").delete().eq("id", id)

  if (error) throw error
  return true
}

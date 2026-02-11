import { SupabaseClient } from "@supabase/supabase-js"
import type { Contract } from "@/types"

interface ContractFilters {
  campaignId?: string
  creatorId?: string
  brandId?: string
}

export async function getContracts(
  supabase: SupabaseClient,
  filters?: ContractFilters
) {
  let query = supabase.from("contracts").select("*")

  if (filters?.campaignId) {
    query = query.eq("campaign_id", filters.campaignId)
  }
  if (filters?.creatorId) {
    query = query.eq("creator_id", filters.creatorId)
  }
  if (filters?.brandId) {
    query = query.eq("brand_id", filters.brandId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as Contract[]
}

export async function getContractById(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Contract
}

export async function createContract(
  supabase: SupabaseClient,
  data: {
    campaign_id: string
    creator_id: string
    brand_id: string
    terms: Record<string, unknown>
    usage_rights?: string
    rights_duration_days?: number
    rights_territories?: string[]
    total_amount_cents: number
    currency?: string
    deliverables?: unknown[]
    deadlines?: Record<string, unknown>
    document_url?: string
  }
) {
  const { data: contract, error } = await supabase
    .from("contracts")
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return contract as Contract
}

export async function updateContract(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Contract>
) {
  const { data: contract, error } = await supabase
    .from("contracts")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return contract as Contract
}

export async function signContract(
  supabase: SupabaseClient,
  id: string,
  role: "brand" | "creator"
) {
  const now = new Date().toISOString()
  const updateData: Record<string, unknown> =
    role === "brand"
      ? { signed_by_brand_at: now }
      : { signed_by_creator_at: now }

  // Check if both parties have signed to update status
  const { data: existing } = await supabase
    .from("contracts")
    .select("signed_by_brand_at, signed_by_creator_at")
    .eq("id", id)
    .single()

  if (existing) {
    const brandSigned =
      role === "brand" ? true : !!existing.signed_by_brand_at
    const creatorSigned =
      role === "creator" ? true : !!existing.signed_by_creator_at

    if (brandSigned && creatorSigned) {
      updateData.status = "signed"
    } else {
      updateData.status = "sent"
    }
  }

  const { data: contract, error } = await supabase
    .from("contracts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return contract as Contract
}

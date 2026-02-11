import { SupabaseClient } from "@supabase/supabase-js"
import type { Payment } from "@/types"

interface PaymentFilters {
  brandId?: string
  creatorId?: string
  status?: string
}

export async function getPayments(
  supabase: SupabaseClient,
  filters?: PaymentFilters
) {
  let query = supabase.from("payments").select("*")

  if (filters?.brandId) {
    query = query.eq("brand_id", filters.brandId)
  }
  if (filters?.creatorId) {
    query = query.eq("creator_id", filters.creatorId)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as Payment[]
}

export async function createPayment(
  supabase: SupabaseClient,
  data: {
    contract_id: string
    campaign_id: string
    brand_id: string
    creator_id: string
    amount_cents: number
    platform_fee_cents: number
    creator_payout_cents: number
    currency?: string
    stripe_payment_intent_id?: string
    is_bonus?: boolean
    bonus_reason?: string
  }
) {
  const { data: payment, error } = await supabase
    .from("payments")
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return payment as Payment
}

export async function updatePayment(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Payment>
) {
  const { data: payment, error } = await supabase
    .from("payments")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return payment as Payment
}

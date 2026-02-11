import { SupabaseClient } from "@supabase/supabase-js"
import type { CreatorProfile, ContentType } from "@/types"

interface CreatorFilters {
  categories?: string[]
  content_types?: ContentType[]
  min_followers?: number
  country?: string
  search?: string
}

export async function getCreators(
  supabase: SupabaseClient,
  filters?: CreatorFilters,
  page = 1,
  limit = 20
) {
  let query = supabase
    .from("creator_profiles")
    .select("*", { count: "exact" })

  if (filters?.categories && filters.categories.length > 0) {
    query = query.overlaps("categories", filters.categories)
  }

  if (filters?.content_types && filters.content_types.length > 0) {
    query = query.overlaps("content_types", filters.content_types)
  }

  if (filters?.min_followers) {
    query = query.or(
      `tiktok_followers.gte.${filters.min_followers},instagram_followers.gte.${filters.min_followers},youtube_subscribers.gte.${filters.min_followers}`
    )
  }

  if (filters?.country) {
    query = query.eq("country", filters.country)
  }

  if (filters?.search) {
    query = query.or(
      `display_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`
    )
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query
    .order("platform_rating", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    creators: data as CreatorProfile[],
    count: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function getCreatorById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as CreatorProfile
}

export async function getCreatorByUserId(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) throw error
  return data as CreatorProfile
}

export async function updateCreatorProfile(
  supabase: SupabaseClient,
  id: string,
  data: Partial<CreatorProfile>
) {
  const { data: profile, error } = await supabase
    .from("creator_profiles")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return profile as CreatorProfile
}

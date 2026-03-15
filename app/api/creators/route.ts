import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { matchCreatorToCampaign } from "@/lib/ai/matching"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const svc = createServiceClient()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const platform = searchParams.get("platform")
    const minFollowers = searchParams.get("min_followers")
    const maxRate = searchParams.get("max_rate")
    const search = searchParams.get("search")
    const language = searchParams.get("language")
    const contentType = searchParams.get("content_type")
    const location = searchParams.get("location")
    const minRating = searchParams.get("min_rating")
    const verifiedOnly = searchParams.get("verified_only")
    const sortBy = searchParams.get("sort_by") || "rating"
    const aiMatch = searchParams.get("ai_match")
    const campaignId = searchParams.get("campaign_id")

    let query = svc
      .from("creator_profiles")
      .select("*")

    // Default: show all creators (remove verified-only default so filters work)
    if (verifiedOnly === "true") {
      query = query.eq("is_verified", true)
    }

    if (category) query = query.contains("categories", [category])
    if (platform) query = query.contains("platforms", [platform])
    if (minFollowers) query = query.gte("follower_count", parseInt(minFollowers))
    if (maxRate) query = query.lte("hourly_rate_cents", parseInt(maxRate))
    if (search) query = query.ilike("display_name", `%${search}%`)
    if (language) query = query.contains("languages", [language])
    if (contentType) query = query.contains("content_types", [contentType])
    if (location) query = query.ilike("country", `%${location}%`)
    if (minRating) query = query.gte("avg_rating", parseFloat(minRating))

    // Sort: Pro/Elite creators first, then by selected sort
    const sortColumn =
      sortBy === "followers" ? "follower_count" :
      sortBy === "rate" ? "hourly_rate_cents" :
      sortBy === "name" ? "display_name" :
      "avg_rating"

    const ascending = sortBy === "rate" || sortBy === "name"

    query = query
      .order("subscription_tier", { ascending: false }) // pro > free
      .order(sortColumn, { ascending })

    const { data: creators, error } = await query.limit(50)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // AI Matching
    if (aiMatch === "true" && campaignId) {
      try {
        const { data: campaign } = await svc
          .from("campaigns")
          .select("*")
          .eq("id", campaignId)
          .single()

        if (campaign && creators && creators.length > 0) {
          // Match top 20 creators for cost efficiency
          const toMatch = creators.slice(0, 20)
          const matchResults = await Promise.allSettled(
            toMatch.map((creator) => matchCreatorToCampaign(campaign, creator))
          )

          const scoredCreators = toMatch.map((creator, i) => {
            const result = matchResults[i]
            if (result.status === "fulfilled") {
              return {
                ...creator,
                match_score: result.value.score,
                match_reasons: result.value.reasons,
                match_concerns: result.value.concerns,
              }
            }
            return { ...creator, match_score: 0, match_reasons: [], match_concerns: [] }
          })

          // Sort by match score descending
          scoredCreators.sort((a, b) => b.match_score - a.match_score)

          // Add remaining unscored creators
          const remaining = creators.slice(20).map((c) => ({
            ...c,
            match_score: null,
            match_reasons: [],
            match_concerns: [],
          }))

          return NextResponse.json([...scoredCreators, ...remaining])
        }
      } catch (aiError) {
        console.error("AI matching failed, returning unscored results:", aiError)
      }
    }

    return NextResponse.json(creators)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

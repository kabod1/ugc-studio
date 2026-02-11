import { openai } from "./openai"
import type { Campaign, CreatorProfile } from "@/types"

export interface MatchResult {
  score: number
  reasons: string[]
  concerns: string[]
}

export async function matchCreatorToCampaign(
  campaign: Campaign,
  creator: CreatorProfile
): Promise<MatchResult> {
  const prompt = `You are an AI matching engine for a UGC (User-Generated Content) platform.
Analyze the compatibility between a campaign and a creator.

Scoring Criteria (total 100 points):
- Content type alignment (20pts): How well the creator's content types match the campaign needs
- Audience overlap (20pts): How relevant the creator's audience is to the campaign's target audience
- Follower match (15pts): Whether the creator meets the minimum follower requirements
- Category fit (15pts): How well the creator's categories align with the campaign
- Location match (10pts): Whether the creator's location matches campaign requirements
- Performance metrics (10pts): Creator's platform rating and campaign completion rate
- Rate fit (10pts): Whether the creator's rate fits the campaign budget per creator

Campaign Details:
- Title: ${campaign.title}
- Description: ${campaign.description ?? "N/A"}
- Content Types Needed: ${campaign.content_types.join(", ")}
- Target Audience: ${campaign.target_audience ?? "General"}
- Age Range: ${campaign.age_range ?? "Any"}
- Gender Preference: ${campaign.gender_preference ?? "Any"}
- Location Requirements: ${campaign.location_requirements.join(", ") || "None"}
- Language Requirements: ${campaign.language_requirements.join(", ") || "Any"}
- Min Followers: ${campaign.min_followers}
- Budget Per Creator: $${(campaign.budget_per_creator_cents / 100).toFixed(2)}

Creator Details:
- Display Name: ${creator.display_name}
- Bio: ${creator.bio ?? "N/A"}
- Categories: ${creator.categories.join(", ")}
- Content Types: ${creator.content_types.join(", ")}
- Country: ${creator.country ?? "Unknown"}
- Languages: ${creator.languages.join(", ") || "Unknown"}
- TikTok Followers: ${creator.tiktok_followers}
- Instagram Followers: ${creator.instagram_followers}
- YouTube Subscribers: ${creator.youtube_subscribers}
- Base Rate: $${(creator.base_rate_cents / 100).toFixed(2)}
- Platform Rating: ${creator.platform_rating}/5
- Campaigns Completed: ${creator.total_campaigns_completed}

Return a JSON object with:
- "score": number between 0 and 100
- "reasons": array of 2-5 strings explaining why this is a good match
- "concerns": array of 0-3 strings noting potential issues`

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1000,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error("No response from OpenAI")
  }

  const result = JSON.parse(content) as MatchResult

  return {
    score: Math.min(100, Math.max(0, Math.round(result.score))),
    reasons: result.reasons ?? [],
    concerns: result.concerns ?? [],
  }
}

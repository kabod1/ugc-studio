/**
 * Seed script: create 15 featured creator accounts in Supabase
 * Run: node scripts/seed-creators.mjs
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://shqkvzzwademhglwlgiy.supabase.co"
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocWt2enp3YWRlbWhnbHdsZ2l5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyNDE1MiwiZXhwIjoyMDg2MjAwMTUyfQ.omXac-qcVj9huh2e9OwV-DW71RfkJaWQTVXvzH14mUw"

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const CREATORS = [
  {
    full_name: "Khaby Lame",
    email: "khaby.lame@ugcdemo.studio",
    instagram_handle: "khaby.lame",
    tiktok_handle: "@khaby00",
    youtube_handle: "@KhabyLame",
    country: "Italy",
    city: "Milan",
    niche: "Comedy & Reactions",
    categories: ["Lifestyle", "Comedy"],
    content_types: ["video", "tiktok", "reel"],
    languages: ["Italian", "English", "French"],
    bio: "The world's most-followed TikToker. I react to life's unnecessary complications — silently. No words needed. Born in Senegal, raised in Italy, loved everywhere.",
    instagram_followers: 80_200_000,
    tiktok_followers: 162_400_000,
    youtube_subscribers: 4_500_000,
    tiktok_avg_views: 28_000_000,
    base_rate_cents: 50_000_00,
    platform_rating: 5.0,
    total_campaigns_completed: 48,
    total_earnings_cents: 980_000_00,
    age_verified: true,
    flag: "🇮🇹",
  },
  {
    full_name: "Charli D'Amelio",
    email: "charli.damelio@ugcdemo.studio",
    instagram_handle: "charlidamelio",
    tiktok_handle: "@charlidamelio",
    youtube_handle: "@charlidamelio",
    country: "United States",
    city: "Los Angeles, CA",
    niche: "Dance & Lifestyle",
    categories: ["Lifestyle", "Fashion"],
    content_types: ["video", "tiktok", "reel", "story"],
    languages: ["English"],
    bio: "Dancer. Creator. Building my own path. Proud to partner with brands that share my values of authenticity and self-expression. Let's create something special.",
    instagram_followers: 55_600_000,
    tiktok_followers: 155_100_000,
    youtube_subscribers: 11_200_000,
    tiktok_avg_views: 18_000_000,
    base_rate_cents: 45_000_00,
    platform_rating: 4.9,
    total_campaigns_completed: 62,
    total_earnings_cents: 1_240_000_00,
    age_verified: true,
    flag: "🇺🇸",
  },
  {
    full_name: "Addison Rae",
    email: "addison.rae@ugcdemo.studio",
    instagram_handle: "addisonraee",
    tiktok_handle: "@addisonre",
    youtube_handle: "@AddisonRae",
    country: "United States",
    city: "Los Angeles, CA",
    niche: "Beauty & Lifestyle",
    categories: ["Beauty", "Lifestyle", "Fashion"],
    content_types: ["video", "tiktok", "reel", "story"],
    languages: ["English"],
    bio: "Content creator, actress, and entrepreneur. Beauty enthusiast with a love for authentic storytelling. Partnering with brands I genuinely use and love every day.",
    instagram_followers: 40_100_000,
    tiktok_followers: 88_700_000,
    youtube_subscribers: 3_900_000,
    tiktok_avg_views: 8_500_000,
    base_rate_cents: 35_000_00,
    platform_rating: 4.8,
    total_campaigns_completed: 54,
    total_earnings_cents: 760_000_00,
    age_verified: true,
    flag: "🇺🇸",
  },
  {
    full_name: "Wisdom Kaye",
    email: "wisdom.kaye@ugcdemo.studio",
    instagram_handle: "wisdomkaye",
    tiktok_handle: "@wisdomkaye",
    youtube_handle: "@WisdomKaye",
    country: "Nigeria",
    city: "London, UK",
    niche: "Fashion & Style",
    categories: ["Fashion"],
    content_types: ["video", "tiktok", "reel", "image"],
    languages: ["English", "Yoruba"],
    bio: "Voted 'Best Dressed Man on the Internet' by Vogue. Nigerian-born fashion creator redefining African elegance on a global stage. I bring high-fashion storytelling to every brand partnership.",
    instagram_followers: 2_800_000,
    tiktok_followers: 8_200_000,
    youtube_subscribers: 680_000,
    tiktok_avg_views: 3_200_000,
    base_rate_cents: 12_000_00,
    platform_rating: 4.9,
    total_campaigns_completed: 38,
    total_earnings_cents: 290_000_00,
    age_verified: true,
    flag: "🇳🇬",
  },
  {
    full_name: "Jay Shetty",
    email: "jay.shetty@ugcdemo.studio",
    instagram_handle: "jayshetty",
    tiktok_handle: "@jayshetty",
    youtube_handle: "@JayShetty",
    country: "United Kingdom",
    city: "London, UK",
    niche: "Wellness & Mindset",
    categories: ["Education", "Lifestyle"],
    content_types: ["video", "reel", "story"],
    languages: ["English"],
    bio: "Former monk turned purpose coach and #1 NYT bestselling author of 'Think Like a Monk'. I help millions find purpose and meaning. Partnering with wellness, education, and conscious brands.",
    instagram_followers: 21_500_000,
    tiktok_followers: 5_800_000,
    youtube_subscribers: 6_200_000,
    tiktok_avg_views: 1_200_000,
    base_rate_cents: 20_000_00,
    platform_rating: 4.9,
    total_campaigns_completed: 31,
    total_earnings_cents: 450_000_00,
    age_verified: true,
    flag: "🇬🇧",
  },
  {
    full_name: "Nikkie de Jager",
    email: "nikkie.tutorials@ugcdemo.studio",
    instagram_handle: "nikkietutorials",
    tiktok_handle: "@nikkietutorials",
    youtube_handle: "@NikkieTutorials",
    country: "Netherlands",
    city: "Uden, Netherlands",
    niche: "Beauty & Makeup",
    categories: ["Beauty"],
    content_types: ["video", "reel", "story", "image"],
    languages: ["Dutch", "English"],
    bio: "Makeup artist, beauty YouTuber, and Netherlands TV presenter. With 14M+ YouTube subscribers, I've built a loyal beauty community that trusts my honest product reviews and tutorials.",
    instagram_followers: 18_400_000,
    tiktok_followers: 4_200_000,
    youtube_subscribers: 14_100_000,
    tiktok_avg_views: 950_000,
    base_rate_cents: 18_000_00,
    platform_rating: 4.8,
    total_campaigns_completed: 76,
    total_earnings_cents: 890_000_00,
    age_verified: true,
    flag: "🇳🇱",
  },
  {
    full_name: "Bretman Rock",
    email: "bretman.rock@ugcdemo.studio",
    instagram_handle: "bretmanrock",
    tiktok_handle: "@bretmanrock",
    youtube_handle: "@BretmanRock",
    country: "Philippines",
    city: "Honolulu, Hawaii",
    niche: "Beauty & Comedy",
    categories: ["Beauty", "Lifestyle"],
    content_types: ["video", "reel", "tiktok", "story"],
    languages: ["English", "Tagalog", "Ilocano"],
    bio: "Filipino-American beauty creator, comedian, and MTV reality star. I blend beauty with unapologetic humor and authenticity. Proud to rep for the LGBTQ+ community and Filipino culture worldwide.",
    instagram_followers: 18_200_000,
    tiktok_followers: 12_100_000,
    youtube_subscribers: 8_700_000,
    tiktok_avg_views: 2_800_000,
    base_rate_cents: 22_000_00,
    platform_rating: 4.9,
    total_campaigns_completed: 44,
    total_earnings_cents: 540_000_00,
    age_verified: true,
    flag: "🇵🇭",
  },
  {
    full_name: "Zach King",
    email: "zach.king@ugcdemo.studio",
    instagram_handle: "zachking",
    tiktok_handle: "@zachking",
    youtube_handle: "@ZachKing",
    country: "United States",
    city: "Los Angeles, CA",
    niche: "Magic & Illusions",
    categories: ["Lifestyle", "Tech"],
    content_types: ["video", "tiktok", "reel"],
    languages: ["English"],
    bio: "Digital illusionist and master of the 'magic vines'. My videos have earned over 6 billion views worldwide. I create mind-bending branded content that stops thumbs and starts conversations.",
    instagram_followers: 24_600_000,
    tiktok_followers: 80_400_000,
    youtube_subscribers: 3_400_000,
    tiktok_avg_views: 15_000_000,
    base_rate_cents: 40_000_00,
    platform_rating: 5.0,
    total_campaigns_completed: 39,
    total_earnings_cents: 720_000_00,
    age_verified: true,
    flag: "🇺🇸",
  },
  {
    full_name: "Emma Chamberlain",
    email: "emma.chamberlain@ugcdemo.studio",
    instagram_handle: "emmachamberlain",
    tiktok_handle: "@emmachamberlain",
    youtube_handle: "@emmachamberlain",
    country: "United States",
    city: "Los Angeles, CA",
    niche: "Lifestyle & Fashion",
    categories: ["Lifestyle", "Fashion"],
    content_types: ["video", "reel", "story", "image"],
    languages: ["English"],
    bio: "YouTube OG. Coffee fanatic. Fashion icon. Founder of Chamberlain Coffee. I've been creating honest, unfiltered content since 2017 — partnering only with brands that feel genuinely right.",
    instagram_followers: 15_800_000,
    tiktok_followers: 7_200_000,
    youtube_subscribers: 12_400_000,
    tiktok_avg_views: 2_100_000,
    base_rate_cents: 28_000_00,
    platform_rating: 4.8,
    total_campaigns_completed: 29,
    total_earnings_cents: 380_000_00,
    age_verified: true,
    flag: "🇺🇸",
  },
  {
    full_name: "Nuseir Yassin",
    email: "nas.daily@ugcdemo.studio",
    instagram_handle: "nasdaily",
    tiktok_handle: "@nasdaily",
    youtube_handle: "@NasDaily",
    country: "Palestine",
    city: "Singapore",
    niche: "Travel & Storytelling",
    categories: ["Travel", "Education", "Lifestyle"],
    content_types: ["video", "reel", "tiktok"],
    languages: ["English", "Arabic", "Hebrew"],
    bio: "I quit my Harvard job to travel the world and make a 1-minute video every day for 1000 days. Now I build global creator schools and partner with brands that make the world better.",
    instagram_followers: 20_100_000,
    tiktok_followers: 6_400_000,
    youtube_subscribers: 3_100_000,
    tiktok_avg_views: 1_800_000,
    base_rate_cents: 15_000_00,
    platform_rating: 4.9,
    total_campaigns_completed: 57,
    total_earnings_cents: 620_000_00,
    age_verified: true,
    flag: "🇵🇸",
  },
  {
    full_name: "Imane Anys",
    email: "pokimane@ugcdemo.studio",
    instagram_handle: "pokimanelol",
    tiktok_handle: "@pokimane",
    youtube_handle: "@Pokimane",
    country: "Canada",
    city: "Los Angeles, CA",
    niche: "Gaming & Lifestyle",
    categories: ["Gaming", "Lifestyle"],
    content_types: ["video", "reel", "story"],
    languages: ["English", "French", "Arabic"],
    bio: "Canada's most-watched female streamer. Twitch Partner, Forbes 30 Under 30, and co-founder of OfflineTV. I create authentic gaming and lifestyle content for brands reaching the Gen-Z audience.",
    instagram_followers: 9_400_000,
    tiktok_followers: 4_800_000,
    youtube_subscribers: 7_200_000,
    tiktok_avg_views: 1_200_000,
    base_rate_cents: 16_000_00,
    platform_rating: 4.7,
    total_campaigns_completed: 22,
    total_earnings_cents: 280_000_00,
    age_verified: true,
    flag: "🇨🇦",
  },
  {
    full_name: "Lilly Singh",
    email: "lilly.singh@ugcdemo.studio",
    instagram_handle: "iisuperwomanii",
    tiktok_handle: "@iisuperwomanii",
    youtube_handle: "@IISuperwomanII",
    country: "Canada",
    city: "Toronto, Canada",
    niche: "Comedy & Entertainment",
    categories: ["Lifestyle", "Comedy", "Education"],
    content_types: ["video", "reel", "story"],
    languages: ["English", "Punjabi", "Hindi"],
    bio: "Author, comedian, former late-night host, and YouTube pioneer. Born and raised in Toronto to Punjabi parents — I've been making the internet laugh since 2010. Forbes Celebrity 100 & Time's Most Influential People.",
    instagram_followers: 13_900_000,
    tiktok_followers: 3_200_000,
    youtube_subscribers: 14_400_000,
    tiktok_avg_views: 890_000,
    base_rate_cents: 14_000_00,
    platform_rating: 4.8,
    total_campaigns_completed: 41,
    total_earnings_cents: 420_000_00,
    age_verified: true,
    flag: "🇨🇦",
  },
  {
    full_name: "Bhuvan Bam",
    email: "bhuvan.bam@ugcdemo.studio",
    instagram_handle: "bhuvan.bam22",
    tiktok_handle: "@bhuvan_bam",
    youtube_handle: "@BBKiVines",
    country: "India",
    city: "New Delhi, India",
    niche: "Comedy & Storytelling",
    categories: ["Comedy", "Lifestyle", "Education"],
    content_types: ["video", "reel", "tiktok"],
    languages: ["Hindi", "English"],
    bio: "India's first YouTuber to hit 10M, 15M, and 20M subscribers. Creator of BB Ki Vines. Actor. Musician. I speak to 600M Hindi speakers with humour rooted in everyday Indian life.",
    instagram_followers: 16_200_000,
    tiktok_followers: 2_100_000,
    youtube_subscribers: 26_500_000,
    tiktok_avg_views: 1_400_000,
    base_rate_cents: 10_000_00,
    platform_rating: 4.9,
    total_campaigns_completed: 33,
    total_earnings_cents: 310_000_00,
    age_verified: true,
    flag: "🇮🇳",
  },
  {
    full_name: "Mikayla Nogueira",
    email: "mikayla.nogueira@ugcdemo.studio",
    instagram_handle: "mikaylanogueira",
    tiktok_handle: "@mikaylanogueira",
    youtube_handle: "@MikaylaNogueira",
    country: "United States",
    city: "Boston, MA",
    niche: "Beauty & Skincare",
    categories: ["Beauty"],
    content_types: ["video", "tiktok", "reel", "review"],
    languages: ["English"],
    bio: "Massachusetts girl making beauty accessible for real people. Known for honest, dramatic reactions that cut through the noise. My reviews go viral because I tell the truth — always.",
    instagram_followers: 4_100_000,
    tiktok_followers: 16_400_000,
    youtube_subscribers: 1_800_000,
    tiktok_avg_views: 4_200_000,
    base_rate_cents: 18_000_00,
    platform_rating: 4.8,
    total_campaigns_completed: 67,
    total_earnings_cents: 560_000_00,
    age_verified: true,
    flag: "🇺🇸",
  },
  {
    full_name: "Marques Brownlee",
    email: "mkbhd@ugcdemo.studio",
    instagram_handle: "mkbhd",
    tiktok_handle: "@mkbhd",
    youtube_handle: "@mkbhd",
    country: "United States",
    city: "Kearny, NJ",
    niche: "Tech & Reviews",
    categories: ["Tech"],
    content_types: ["video", "review", "reel"],
    languages: ["English"],
    bio: "Making the best tech videos on YouTube since I was 15. 18M+ subscribers. Rated the best tech reviewer on the internet by multiple outlets. I bring depth and integrity to every brand partnership.",
    instagram_followers: 3_900_000,
    tiktok_followers: 2_200_000,
    youtube_subscribers: 18_700_000,
    tiktok_avg_views: 780_000,
    base_rate_cents: 25_000_00,
    platform_rating: 4.9,
    total_campaigns_completed: 28,
    total_earnings_cents: 480_000_00,
    age_verified: true,
    flag: "🇺🇸",
  },
]

async function seed() {
  console.log("🌱 Seeding 15 featured creator accounts...\n")

  for (const creator of CREATORS) {
    console.log(`→ Creating: ${creator.full_name} (${creator.flag} ${creator.country})`)

    // 1. Create auth user
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: creator.email,
      password: "Creator@2026!",
      email_confirm: true,
      user_metadata: {
        full_name: creator.full_name,
        role: "creator",
      },
    })

    if (authErr) {
      if (authErr.message?.includes("already been registered") || authErr.message?.includes("already exists")) {
        console.log(`  ⚠️  Auth user already exists, looking up...`)
        // Try to find existing user
        const { data: listData } = await supabase.auth.admin.listUsers()
        const existing = listData?.users?.find((u) => u.email === creator.email)
        if (!existing) {
          console.log(`  ✗ Could not find existing user for ${creator.email}`)
          continue
        }
        await upsertProfile(existing.id, creator)
        continue
      }
      console.log(`  ✗ Auth error: ${authErr.message}`)
      continue
    }

    const userId = authData.user.id
    console.log(`  ✓ Auth user created: ${userId}`)

    // Small delay to let DB trigger create the profiles row
    await new Promise((r) => setTimeout(r, 800))

    await upsertProfile(userId, creator)
  }

  console.log("\n✅ Seeding complete!")
}

async function upsertProfile(userId, creator) {
  // 2. Update profiles row (created by DB trigger)
  const { error: profileErr } = await supabase
    .from("profiles")
    .update({
      role: "creator",
      full_name: creator.full_name,
      avatar_url: `https://unavatar.io/instagram/${creator.instagram_handle}`,
      onboarding_completed: true,
      is_verified: true,
      is_active: true,
    })
    .eq("id", userId)

  if (profileErr) {
    console.log(`  ⚠️  Profile update warning: ${profileErr.message}`)
  } else {
    console.log(`  ✓ Profile updated`)
  }

  // 3. Upsert creator_profiles
  const { error: cpErr } = await supabase.from("creator_profiles").upsert(
    {
      user_id: userId,
      display_name: creator.full_name,
      bio: creator.bio,
      country: creator.country,
      city: creator.city,
      languages: creator.languages,
      categories: creator.categories,
      content_types: creator.content_types,
      tiktok_handle: creator.tiktok_handle,
      tiktok_followers: creator.tiktok_followers,
      tiktok_avg_views: creator.tiktok_avg_views,
      instagram_handle: creator.instagram_handle,
      instagram_followers: creator.instagram_followers,
      youtube_handle: creator.youtube_handle,
      youtube_subscribers: creator.youtube_subscribers,
      base_rate_cents: creator.base_rate_cents,
      currency: "USD",
      platform_rating: creator.platform_rating,
      total_campaigns_completed: creator.total_campaigns_completed,
      total_earnings_cents: creator.total_earnings_cents,
      age_verified: creator.age_verified,
      tax_form_type: "W-8BEN",
      tax_form_submitted: true,
      is_featured: true,
      ai_match_score: Math.round(creator.platform_rating * 20),
    },
    { onConflict: "user_id" }
  )

  if (cpErr) {
    console.log(`  ✗ Creator profile error: ${cpErr.message}`)
  } else {
    console.log(`  ✓ Creator profile upserted ✓\n`)
  }
}

seed().catch(console.error)

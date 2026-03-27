"use client"

import { useState } from "react"
import { Star, Quote } from "lucide-react"

interface Testimonial {
  name: string
  country: string
  flag: string
  niche: string
  instagram_followers: number
  tiktok_followers: number
  rating: number
  quote: string
  avatar_img: number
  campaigns: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aisha Okafor",
    country: "Nigeria",
    flag: "🇳🇬",
    niche: "Beauty & Skincare",
    instagram_followers: 4200,
    tiktok_followers: 9800,
    rating: 4.8,
    campaigns: 7,
    avatar_img: 1,
    quote:
      "I got my first €300 brand deal two weeks after joining Townshub. As a micro-creator in Lagos, I thought brands would never find me. The AI matched me with a skincare brand that was literally perfect for my audience.",
  },
  {
    name: "Jake Thornton",
    country: "United Kingdom",
    flag: "🇬🇧",
    niche: "Fitness & Gym",
    instagram_followers: 3100,
    tiktok_followers: 8700,
    rating: 4.7,
    campaigns: 5,
    avatar_img: 3,
    quote:
      "The escrow payment system is a game changer. I got burned by a brand before — paid 50% then ghosted. With Townshub the money is locked before I even start filming. 5 campaigns, zero payment issues.",
  },
  {
    name: "María González",
    country: "Mexico",
    flag: "🇲🇽",
    niche: "Food & Cooking",
    instagram_followers: 6300,
    tiktok_followers: 14200,
    rating: 4.9,
    campaigns: 11,
    avatar_img: 5,
    quote:
      "En dos meses conseguí 11 campañas. The platform is incredibly easy — I upload my content, brand approves, money appears in my Wise. I've recommended Townshub to every creator I know.",
  },
  {
    name: "Priya Nair",
    country: "India",
    flag: "🇮🇳",
    niche: "Skincare & Wellness",
    instagram_followers: 11400,
    tiktok_followers: 22800,
    rating: 4.8,
    campaigns: 14,
    avatar_img: 7,
    quote:
      "Townshub understands that micro-creators drive real purchasing decisions. My 11K followers convert better than influencers with millions. Brands are finally seeing that — this platform made it possible.",
  },
  {
    name: "Lucas van den Berg",
    country: "Netherlands",
    flag: "🇳🇱",
    niche: "Tech & Gadgets",
    instagram_followers: 2900,
    tiktok_followers: 5400,
    rating: 4.7,
    campaigns: 9,
    avatar_img: 10,
    quote:
      "As a tech creator in the Netherlands, finding EU-relevant brands was always a hurdle. Townshub filtered campaigns by region automatically — I only see what's relevant to me. Brilliant.",
  },
  {
    name: "Zoë Campbell",
    country: "Australia",
    flag: "🇦🇺",
    niche: "Lifestyle & Home",
    instagram_followers: 9200,
    tiktok_followers: 17600,
    rating: 4.9,
    campaigns: 18,
    avatar_img: 12,
    quote:
      "18 campaigns in my first 6 months. The contract system is incredibly professional — I never have to chase usage rights or payment terms. Everything is documented and enforced automatically.",
  },
  {
    name: "David Kimani",
    country: "Kenya",
    flag: "🇰🇪",
    niche: "Fitness & Sports",
    instagram_followers: 5700,
    tiktok_followers: 7400,
    rating: 4.8,
    campaigns: 6,
    avatar_img: 14,
    quote:
      "Before Townshub I had zero brand deals. Now I earn enough from UGC to cover my rent every month. The Wise payout works perfectly in Kenya — money arrives same day. This platform changed my life.",
  },
  {
    name: "Sofia Kowalski",
    country: "Poland",
    flag: "🇵🇱",
    niche: "Fashion & Style",
    instagram_followers: 5600,
    tiktok_followers: 12300,
    rating: 4.7,
    campaigns: 8,
    avatar_img: 16,
    quote:
      "Polish creators are often overlooked by global brands. Townshub changed that — I'm now working with brands from the UK, Germany, and the US regularly. The AI matching actually understands my style.",
  },
  {
    name: "Carlos Mendes",
    country: "Brazil",
    flag: "🇧🇷",
    niche: "Gaming & Tech",
    instagram_followers: 4800,
    tiktok_followers: 9100,
    rating: 4.8,
    campaigns: 10,
    avatar_img: 18,
    quote:
      "I had a YouTube channel for years but no brand deals. Within 3 weeks on Townshub I had my first campaign. The platform showed brands my engagement rate, not just my subscriber count — that made all the difference.",
  },
  {
    name: "Fatima Al-Hassan",
    country: "UAE",
    flag: "🇦🇪",
    niche: "Beauty & Fragrance",
    instagram_followers: 8900,
    tiktok_followers: 19400,
    rating: 4.9,
    campaigns: 13,
    avatar_img: 20,
    quote:
      "The Gulf market is hard to access for Western beauty brands. I've become their bridge on Townshub. My last three campaigns each had a 40%+ conversion rate. Brands keep coming back because results speak.",
  },
  {
    name: "Tom Bradley",
    country: "United States",
    flag: "🇺🇸",
    niche: "Home Decor & DIY",
    instagram_followers: 4700,
    tiktok_followers: 11800,
    rating: 4.7,
    campaigns: 9,
    avatar_img: 22,
    quote:
      "Townshub's brief system gives me everything I need to nail the brand's vision — guidelines, examples, tone of voice. My revision requests dropped to zero since joining.",
  },
  {
    name: "Yuna Park",
    country: "South Korea",
    flag: "🇰🇷",
    niche: "K-Beauty & Skincare",
    instagram_followers: 15200,
    tiktok_followers: 28400,
    rating: 4.9,
    campaigns: 21,
    avatar_img: 25,
    quote:
      "K-beauty is global but the creator economy still feels localised. Townshub gave me access to European and US beauty brands who were desperate for authentic Seoul-based content. 21 campaigns and counting.",
  },
  {
    name: "Emma Walsh",
    country: "Ireland",
    flag: "🇮🇪",
    niche: "Lifestyle & Wellness",
    instagram_followers: 6800,
    tiktok_followers: 13500,
    rating: 4.8,
    campaigns: 12,
    avatar_img: 28,
    quote:
      "I was skeptical — another platform promising brand deals. But my first campaign went live in under a week. The quality scoring feedback actually helped me improve my content. Now I'm booked 3 weeks ahead.",
  },
  {
    name: "Raj Patel",
    country: "United Kingdom",
    flag: "🇬🇧",
    niche: "Food & Recipe",
    instagram_followers: 3200,
    tiktok_followers: 8600,
    rating: 4.7,
    campaigns: 7,
    avatar_img: 30,
    quote:
      "As a British-Indian creator, I bring cultural context that generic food content can't replicate. Townshub helped spice and meal-kit brands find me specifically for that. Three repeat clients in two months.",
  },
  {
    name: "Amara Diallo",
    country: "France",
    flag: "🇫🇷",
    niche: "Fashion & Streetwear",
    instagram_followers: 9700,
    tiktok_followers: 21000,
    rating: 4.9,
    campaigns: 15,
    avatar_img: 33,
    quote:
      "Paris has a saturated creator market but my Afro-Parisian aesthetic is unique. Townshub's AI picked up on that immediately and matched me with brands that celebrate diversity. I finally feel seen as a creator.",
  },
]

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function CreatorAvatar({ name, img }: { name: string; img: number }) {
  const [err, setErr] = useState(false)
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("")

  if (err) {
    return (
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
        {initials}
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://i.pravatar.cc/150?img=${img}`}
      alt={name}
      onError={() => setErr(true)}
      className="h-12 w-12 rounded-full object-cover shrink-0 ring-2 ring-primary/10"
    />
  )
}

export function CreatorTestimonials() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Creators Love Townshub</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From Lagos to Seoul, micro-creators worldwide are landing their first brand deals and building real income on our platform.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid bg-card border rounded-xl p-5 space-y-4 hover:border-primary/40 hover:shadow-md transition-all"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${
                      s <= Math.round(t.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="absolute -top-1 -left-1 h-4 w-4 text-primary/30" />
                <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                  {t.quote}
                </p>
              </div>

              {/* Creator info */}
              <div className="flex items-center gap-3 pt-1 border-t">
                <CreatorAvatar name={t.name} img={t.avatar_img} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">
                    {t.name}
                    <span className="ml-1.5 text-xs">{t.flag}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{t.niche}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>{formatFollowers(t.tiktok_followers)} TikTok</span>
                    <span>·</span>
                    <span>{t.campaigns} campaigns</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

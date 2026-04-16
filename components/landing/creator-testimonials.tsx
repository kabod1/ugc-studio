"use client"

import { useState, useRef } from "react"
import { Star, Quote, ChevronLeft, ChevronRight, X } from "lucide-react"

interface Testimonial {
  name: string
  country: string
  flag: string
  niche: string
  tiktok_followers: number
  rating: number
  quote: string
  avatar_img: number
  campaigns: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aisha Okafor",
    country: "Nigeria", flag: "🇳🇬",
    niche: "Beauty & Skincare",
    tiktok_followers: 9800, rating: 4.8, campaigns: 7, avatar_img: 1,
    quote: "I got my first €300 brand deal two weeks after joining Townshub. As a micro-creator in Lagos, I thought brands would never find me. The AI matched me with a skincare brand that was literally perfect for my audience.",
  },
  {
    name: "Zoë Campbell",
    country: "Australia", flag: "🇦🇺",
    niche: "Lifestyle & Home",
    tiktok_followers: 17600, rating: 4.9, campaigns: 18, avatar_img: 12,
    quote: "18 campaigns in my first 6 months. The contract system is incredibly professional — I never have to chase usage rights or payment terms. Everything is documented and enforced automatically.",
  },
  {
    name: "Yuna Park",
    country: "South Korea", flag: "🇰🇷",
    niche: "K-Beauty & Skincare",
    tiktok_followers: 28400, rating: 4.9, campaigns: 21, avatar_img: 25,
    quote: "K-beauty is global but the creator economy still feels localised. Townshub gave me access to European and US beauty brands desperate for authentic Seoul-based content. 21 campaigns and counting.",
  },
  // ── remaining 12 — only shown in the carousel ────────────────────────────
  {
    name: "Jake Thornton",
    country: "United Kingdom", flag: "🇬🇧",
    niche: "Fitness & Gym",
    tiktok_followers: 8700, rating: 4.7, campaigns: 5, avatar_img: 3,
    quote: "The escrow payment system is a game changer. I got burned by a brand before — paid 50% then ghosted. With Townshub the money is locked before I even start filming. 5 campaigns, zero payment issues.",
  },
  {
    name: "María González",
    country: "Mexico", flag: "🇲🇽",
    niche: "Food & Cooking",
    tiktok_followers: 14200, rating: 4.9, campaigns: 11, avatar_img: 5,
    quote: "En dos meses conseguí 11 campañas. The platform is incredibly easy — I upload my content, brand approves, money appears in my Wise. I've recommended Townshub to every creator I know.",
  },
  {
    name: "Priya Nair",
    country: "India", flag: "🇮🇳",
    niche: "Skincare & Wellness",
    tiktok_followers: 22800, rating: 4.8, campaigns: 14, avatar_img: 7,
    quote: "Townshub understands that micro-creators drive real purchasing decisions. My 11K followers convert better than influencers with millions. Brands are finally seeing that — this platform made it possible.",
  },
  {
    name: "Lucas van den Berg",
    country: "Netherlands", flag: "🇳🇱",
    niche: "Tech & Gadgets",
    tiktok_followers: 5400, rating: 4.7, campaigns: 9, avatar_img: 10,
    quote: "As a tech creator in the Netherlands, finding EU-relevant brands was always a hurdle. Townshub filtered campaigns by region automatically — I only see what's relevant to me. Brilliant.",
  },
  {
    name: "David Kimani",
    country: "Kenya", flag: "🇰🇪",
    niche: "Fitness & Sports",
    tiktok_followers: 7400, rating: 4.8, campaigns: 6, avatar_img: 14,
    quote: "Before Townshub I had zero brand deals. Now I earn enough from UGC to cover my rent every month. The Wise payout works perfectly in Kenya — money arrives same day. This platform changed my life.",
  },
  {
    name: "Sofia Kowalski",
    country: "Poland", flag: "🇵🇱",
    niche: "Fashion & Style",
    tiktok_followers: 12300, rating: 4.7, campaigns: 8, avatar_img: 16,
    quote: "Polish creators are often overlooked by global brands. Townshub changed that — I'm now working with brands from the UK, Germany, and the US regularly. The AI matching actually understands my style.",
  },
  {
    name: "Carlos Mendes",
    country: "Brazil", flag: "🇧🇷",
    niche: "Gaming & Tech",
    tiktok_followers: 9100, rating: 4.8, campaigns: 10, avatar_img: 18,
    quote: "I had a YouTube channel for years but no brand deals. Within 3 weeks on Townshub I had my first campaign. The platform showed brands my engagement rate, not just subscriber count — that made all the difference.",
  },
  {
    name: "Fatima Al-Hassan",
    country: "UAE", flag: "🇦🇪",
    niche: "Beauty & Fragrance",
    tiktok_followers: 19400, rating: 4.9, campaigns: 13, avatar_img: 20,
    quote: "The Gulf market is hard to access for Western beauty brands. I've become their bridge on Townshub. My last three campaigns each had a 40%+ conversion rate. Brands keep coming back because results speak.",
  },
  {
    name: "Tom Bradley",
    country: "United States", flag: "🇺🇸",
    niche: "Home Decor & DIY",
    tiktok_followers: 11800, rating: 4.7, campaigns: 9, avatar_img: 22,
    quote: "Townshub's brief system gives me everything I need to nail the brand's vision — guidelines, examples, tone of voice. My revision requests dropped to zero since joining.",
  },
  {
    name: "Emma Walsh",
    country: "Ireland", flag: "🇮🇪",
    niche: "Lifestyle & Wellness",
    tiktok_followers: 13500, rating: 4.8, campaigns: 12, avatar_img: 28,
    quote: "I was skeptical — another platform promising brand deals. But my first campaign went live in under a week. The quality scoring feedback actually helped me improve. Now I'm booked 3 weeks ahead.",
  },
  {
    name: "Raj Patel",
    country: "United Kingdom", flag: "🇬🇧",
    niche: "Food & Recipe",
    tiktok_followers: 8600, rating: 4.7, campaigns: 7, avatar_img: 30,
    quote: "As a British-Indian creator, I bring cultural context that generic food content can't replicate. Townshub helped spice and meal-kit brands find me specifically for that. Three repeat clients in two months.",
  },
  {
    name: "Amara Diallo",
    country: "France", flag: "🇫🇷",
    niche: "Fashion & Streetwear",
    tiktok_followers: 21000, rating: 4.9, campaigns: 15, avatar_img: 33,
    quote: "Paris has a saturated creator market but my Afro-Parisian aesthetic is unique. Townshub's AI picked up on that immediately and matched me with brands that celebrate diversity. I finally feel seen as a creator.",
  },
]

const VISIBLE = 3 // cards shown on the page before "Read more"

function formatK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("")
  return (
    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
      {initials}
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-card border rounded-xl p-5 space-y-4 h-full flex flex-col">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-3.5 w-3.5 ${s <= Math.round(t.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
          />
        ))}
      </div>
      <div className="relative flex-1">
        <Quote className="absolute -top-1 -left-1 h-4 w-4 text-primary/25" />
        <p className="text-sm text-muted-foreground leading-relaxed pl-4">{t.quote}</p>
      </div>
      <div className="flex items-center gap-3 pt-1 border-t">
        <Avatar name={t.name} />
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">
            {t.name} <span className="text-xs">{t.flag}</span>
          </p>
          <p className="text-xs text-muted-foreground truncate">{t.niche}</p>
          <p className="text-xs text-muted-foreground">
            {formatK(t.tiktok_followers)} TikTok · {t.campaigns} campaigns
          </p>
        </div>
      </div>
    </div>
  )
}

function CarouselModal({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const total = TESTIMONIALS.length

  function go(dir: number) {
    const next = (index + dir + total) % total
    setIndex(next)
    trackRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="font-bold text-lg">Creator Stories</h3>
            <p className="text-xs text-muted-foreground">{index + 1} of {total}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Slide track (hidden overflow, single card shown) */}
        <div className="px-6 py-6">
          <TestimonialCard t={TESTIMONIALS[index]} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 pb-5">
          <button
            onClick={() => go(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5" ref={trackRef}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === index ? "w-4 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => go(1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function CreatorTestimonials() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Creators Experience</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These stories are illustrative examples of the outcomes creators on our platform achieve.
              Names and details have been changed for privacy.
            </p>
          </div>

          {/* 3 visible cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, VISIBLE).map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>

          {/* Read more */}
          <div className="text-center mt-10">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Read all {TESTIMONIALS.length} creator stories
              <ChevronRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-muted-foreground mt-3">
              Illustrative examples. Names changed for privacy. Results may vary.
            </p>
          </div>
        </div>
      </section>

      {open && <CarouselModal onClose={() => setOpen(false)} />}
    </>
  )
}

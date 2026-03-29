"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface Creator {
  name: string
  slug: string
  niche: string
  country: string
  flag: string
  followers: string
  rating: number
}

const CREATORS: Creator[] = [
  {
    name: "Khaby Lame",
    slug: "khaby-lame",
    niche: "Comedy & Reactions",
    country: "Italy",
    flag: "🇮🇹",
    followers: "162M",
    rating: 5.0,
  },
  {
    name: "Charli D'Amelio",
    slug: "charli-damelio",
    niche: "Dance & Lifestyle",
    country: "United States",
    flag: "🇺🇸",
    followers: "155M",
    rating: 4.9,
  },
  {
    name: "Addison Rae",
    slug: "addison-rae",
    niche: "Beauty & Lifestyle",
    country: "United States",
    flag: "🇺🇸",
    followers: "88M",
    rating: 4.8,
  },
  {
    name: "Wisdom Kaye",
    slug: "wisdom-kaye",
    niche: "Fashion & Style",
    country: "Nigeria",
    flag: "🇳🇬",
    followers: "8.2M",
    rating: 4.9,
  },
  {
    name: "Jay Shetty",
    slug: "jay-shetty",
    niche: "Wellness & Mindset",
    country: "United Kingdom",
    flag: "🇬🇧",
    followers: "22M",
    rating: 4.9,
  },
  {
    name: "NikkieTutorials",
    slug: "nikkie-tutorials",
    niche: "Beauty & Makeup",
    country: "Netherlands",
    flag: "🇳🇱",
    followers: "18M",
    rating: 4.8,
  },
  {
    name: "Bretman Rock",
    slug: "bretman-rock",
    niche: "Beauty & Comedy",
    country: "Philippines",
    flag: "🇵🇭",
    followers: "18M",
    rating: 4.9,
  },
  {
    name: "Zach King",
    slug: "zach-king",
    niche: "Magic & Illusions",
    country: "United States",
    flag: "🇺🇸",
    followers: "80M",
    rating: 5.0,
  },
  {
    name: "Emma Chamberlain",
    slug: "emma-chamberlain",
    niche: "Lifestyle & Fashion",
    country: "United States",
    flag: "🇺🇸",
    followers: "15M",
    rating: 4.8,
  },
  {
    name: "Nas Daily",
    slug: "nas-daily",
    niche: "Travel & Storytelling",
    country: "Palestine",
    flag: "🇵🇸",
    followers: "20M",
    rating: 4.9,
  },
  {
    name: "Pokimane",
    slug: "pokimane",
    niche: "Gaming & Lifestyle",
    country: "Canada",
    flag: "🇨🇦",
    followers: "9.4M",
    rating: 4.7,
  },
  {
    name: "Lilly Singh",
    slug: "lilly-singh",
    niche: "Comedy & Entertainment",
    country: "Canada",
    flag: "🇨🇦",
    followers: "14M",
    rating: 4.8,
  },
  {
    name: "Bhuvan Bam",
    slug: "bhuvan-bam",
    niche: "Comedy & Storytelling",
    country: "India",
    flag: "🇮🇳",
    followers: "16M",
    rating: 4.9,
  },
  {
    name: "Mikayla Nogueira",
    slug: "mikayla-nogueira",
    niche: "Beauty & Skincare",
    country: "United States",
    flag: "🇺🇸",
    followers: "16M",
    rating: 4.8,
  },
  {
    name: "Marques Brownlee",
    slug: "mkbhd",
    niche: "Tech & Reviews",
    country: "United States",
    flag: "🇺🇸",
    followers: "18M",
    rating: 4.9,
  },
]

function CreatorCard({ creator }: { creator: Creator }) {
  const [imgError, setImgError] = useState(false)

  const initials = creator.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")

  return (
    <div className="bg-card border rounded-xl p-5 text-center hover:border-primary/50 hover:shadow-lg transition-all group">
      <div className="relative h-16 w-16 mx-auto mb-3">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/creators/${creator.slug}.jpg`}
            alt={creator.name}
            onError={() => setImgError(true)}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary ring-2 ring-primary/10">
            {initials}
          </div>
        )}
      </div>

      <h3 className="font-semibold text-sm leading-tight">{creator.name}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{creator.niche}</p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {creator.flag} {creator.country}
      </p>

      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mt-2">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          {creator.rating.toFixed(1)}
        </span>
        <span>{creator.followers} followers</span>
      </div>
    </div>
  )
}

export function FeaturedCreators() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {CREATORS.map((c) => (
        <CreatorCard key={c.slug} creator={c} />
      ))}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface Creator {
  name: string
  handle: string
  niche: string
  country: string
  flag: string
  followers: string
  rating: number
  platform: "instagram" | "twitter" | "youtube"
}

const CREATORS: Creator[] = [
  {
    name: "Khaby Lame",
    handle: "khaby.lame",
    niche: "Comedy & Reactions",
    country: "Italy",
    flag: "🇮🇹",
    followers: "162M",
    rating: 5.0,
    platform: "instagram",
  },
  {
    name: "Charli D'Amelio",
    handle: "charlidamelio",
    niche: "Dance & Lifestyle",
    country: "United States",
    flag: "🇺🇸",
    followers: "155M",
    rating: 4.9,
    platform: "instagram",
  },
  {
    name: "Addison Rae",
    handle: "addisonraee",
    niche: "Beauty & Lifestyle",
    country: "United States",
    flag: "🇺🇸",
    followers: "88M",
    rating: 4.8,
    platform: "instagram",
  },
  {
    name: "Wisdom Kaye",
    handle: "wisdomkaye",
    niche: "Fashion & Style",
    country: "Nigeria",
    flag: "🇳🇬",
    followers: "8.2M",
    rating: 4.9,
    platform: "instagram",
  },
  {
    name: "Jay Shetty",
    handle: "jayshetty",
    niche: "Wellness & Mindset",
    country: "United Kingdom",
    flag: "🇬🇧",
    followers: "22M",
    rating: 4.9,
    platform: "instagram",
  },
  {
    name: "NikkieTutorials",
    handle: "nikkietutorials",
    niche: "Beauty & Makeup",
    country: "Netherlands",
    flag: "🇳🇱",
    followers: "18M",
    rating: 4.8,
    platform: "instagram",
  },
  {
    name: "Bretman Rock",
    handle: "bretmanrock",
    niche: "Beauty & Comedy",
    country: "Philippines",
    flag: "🇵🇭",
    followers: "18M",
    rating: 4.9,
    platform: "instagram",
  },
  {
    name: "Zach King",
    handle: "zachking",
    niche: "Magic & Illusions",
    country: "United States",
    flag: "🇺🇸",
    followers: "80M",
    rating: 5.0,
    platform: "instagram",
  },
  {
    name: "Emma Chamberlain",
    handle: "emmachamberlain",
    niche: "Lifestyle & Fashion",
    country: "United States",
    flag: "🇺🇸",
    followers: "15M",
    rating: 4.8,
    platform: "instagram",
  },
  {
    name: "Nas Daily",
    handle: "nasdaily",
    niche: "Travel & Storytelling",
    country: "Palestine",
    flag: "🇵🇸",
    followers: "20M",
    rating: 4.9,
    platform: "instagram",
  },
  {
    name: "Pokimane",
    handle: "pokimanelol",
    niche: "Gaming & Lifestyle",
    country: "Canada",
    flag: "🇨🇦",
    followers: "9.4M",
    rating: 4.7,
    platform: "instagram",
  },
  {
    name: "Lilly Singh",
    handle: "iisuperwomanii",
    niche: "Comedy & Entertainment",
    country: "Canada",
    flag: "🇨🇦",
    followers: "14M",
    rating: 4.8,
    platform: "instagram",
  },
  {
    name: "Bhuvan Bam",
    handle: "bhuvan.bam22",
    niche: "Comedy & Storytelling",
    country: "India",
    flag: "🇮🇳",
    followers: "16M",
    rating: 4.9,
    platform: "instagram",
  },
  {
    name: "Mikayla Nogueira",
    handle: "mikaylanogueira",
    niche: "Beauty & Skincare",
    country: "United States",
    flag: "🇺🇸",
    followers: "16M",
    rating: 4.8,
    platform: "instagram",
  },
  {
    name: "Marques Brownlee",
    handle: "mkbhd",
    niche: "Tech & Reviews",
    country: "United States",
    flag: "🇺🇸",
    followers: "18M",
    rating: 4.9,
    platform: "instagram",
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
            src={`https://unavatar.io/${creator.platform}/${creator.handle}`}
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
        <CreatorCard key={c.handle} creator={c} />
      ))}
    </div>
  )
}

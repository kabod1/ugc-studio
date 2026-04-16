"use client"

import { Star } from "lucide-react"

interface Creator {
  name: string
  initials: string
  niche: string
  country: string
  flag: string
  followers: string
  rating: number
  color: string
}

// Illustrative creator profiles representing the types of creators on the platform.
// These are fictional personas, not real individuals.
const CREATORS: Creator[] = [
  { name: "Amara D.", initials: "AD", niche: "Beauty & Skincare", country: "Nigeria", flag: "🇳🇬", followers: "24K", rating: 4.9, color: "bg-pink-100 text-pink-700" },
  { name: "Lucas V.", initials: "LV", niche: "Tech & Gadgets", country: "Netherlands", flag: "🇳🇱", followers: "11K", rating: 4.8, color: "bg-blue-100 text-blue-700" },
  { name: "Yuna P.", initials: "YP", niche: "K-Beauty", country: "South Korea", flag: "🇰🇷", followers: "38K", rating: 4.9, color: "bg-purple-100 text-purple-700" },
  { name: "Jake T.", initials: "JT", niche: "Fitness & Gym", country: "United Kingdom", flag: "🇬🇧", followers: "9K", rating: 4.7, color: "bg-green-100 text-green-700" },
  { name: "María G.", initials: "MG", niche: "Food & Cooking", country: "Mexico", flag: "🇲🇽", followers: "17K", rating: 4.9, color: "bg-orange-100 text-orange-700" },
  { name: "David K.", initials: "DK", niche: "Fitness & Sports", country: "Kenya", flag: "🇰🇪", followers: "8K", rating: 4.8, color: "bg-yellow-100 text-yellow-700" },
  { name: "Sofia W.", initials: "SW", niche: "Fashion & Style", country: "Poland", flag: "🇵🇱", followers: "14K", rating: 4.7, color: "bg-rose-100 text-rose-700" },
  { name: "Carlos M.", initials: "CM", niche: "Gaming & Tech", country: "Brazil", flag: "🇧🇷", followers: "10K", rating: 4.8, color: "bg-indigo-100 text-indigo-700" },
  { name: "Fatima H.", initials: "FH", niche: "Beauty & Fragrance", country: "UAE", flag: "🇦🇪", followers: "22K", rating: 4.9, color: "bg-amber-100 text-amber-700" },
  { name: "Tom B.", initials: "TB", niche: "Home & DIY", country: "United States", flag: "🇺🇸", followers: "13K", rating: 4.7, color: "bg-teal-100 text-teal-700" },
  { name: "Emma W.", initials: "EW", niche: "Lifestyle & Wellness", country: "Ireland", flag: "🇮🇪", followers: "16K", rating: 4.8, color: "bg-cyan-100 text-cyan-700" },
  { name: "Raj P.", initials: "RP", niche: "Food & Recipe", country: "United Kingdom", flag: "🇬🇧", followers: "9K", rating: 4.7, color: "bg-lime-100 text-lime-700" },
  { name: "Priya N.", initials: "PN", niche: "Skincare & Wellness", country: "India", flag: "🇮🇳", followers: "26K", rating: 4.8, color: "bg-fuchsia-100 text-fuchsia-700" },
  { name: "Zoë C.", initials: "ZC", niche: "Lifestyle & Home", country: "Australia", flag: "🇦🇺", followers: "19K", rating: 4.9, color: "bg-sky-100 text-sky-700" },
  { name: "Karim A.", initials: "KA", niche: "Travel & Vlog", country: "France", flag: "🇫🇷", followers: "31K", rating: 4.9, color: "bg-violet-100 text-violet-700" },
]

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="bg-card border rounded-xl p-5 text-center hover:border-primary/50 hover:shadow-lg transition-all">
      <div className={`h-14 w-14 rounded-full ${creator.color} flex items-center justify-center text-lg font-bold mx-auto mb-3`}>
        {creator.initials}
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
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CREATORS.map((c) => (
          <CreatorCard key={c.name} creator={c} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-4">
        Illustrative creator profiles representing the types of talent on the platform.
        <a href="/signup" className="underline ml-1 hover:text-foreground">Join to see real creators.</a>
      </p>
    </div>
  )
}

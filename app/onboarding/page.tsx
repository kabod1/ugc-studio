"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ChevronRight, Star, Briefcase, Sparkles } from "lucide-react"
import { LogoFull } from "@/components/shared/logo"

const NICHES = [
  { label: "Social & Communication", icon: "💬" },
  { label: "Finance & Commerce", icon: "💰" },
  { label: "Entertainment & Media", icon: "🎬" },
  { label: "Health & Fitness", icon: "💪" },
  { label: "Education & Learning", icon: "🎓" },
  { label: "Travel & Local", icon: "✈️" },
  { label: "Lifestyle & Utilities", icon: "🌟" },
  { label: "Photo & Video", icon: "📸" },
  { label: "Food & Drink", icon: "🍕" },
  { label: "Home & Family", icon: "🏠" },
  { label: "Fashion & Beauty", icon: "👗" },
  { label: "Gaming & Tech", icon: "🎮" },
]

const BRANDS = [
  { name: "Sephora", domain: "sephora.com" },
  { name: "Spotify", domain: "spotify.com" },
  { name: "Starbucks", domain: "starbucks.com" },
  { name: "DoorDash", domain: "doordash.com" },
  { name: "Nike", domain: "nike.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "Notion", domain: "notion.so" },
  { name: "Shopify", domain: "shopify.com" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState("Creator")
  const [experience, setExperience] = useState<"yes" | "no" | null>(null)
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadName() {
      try {
        const res = await fetch("/api/auth/profile")
        if (res.ok) {
          const data = await res.json()
          const name = data?.full_name || data?.display_name || ""
          if (name) setFirstName(name.split(" ")[0])
        }
      } catch {
        // use default
      }
    }
    loadName()
  }, [])

  function toggleNiche(label: string) {
    setSelectedNiches((prev) => {
      if (prev.includes(label)) return prev.filter((n) => n !== label)
      if (prev.length >= 5) return prev
      return [...prev, label]
    })
  }

  async function finish() {
    setSaving(true)
    try {
      // Map selected niches to category keys used in creator settings
      const categoryMap: Record<string, string> = {
        "Fashion & Beauty": "Fashion",
        "Health & Fitness": "Fitness",
        "Entertainment & Media": "Entertainment",
        "Food & Drink": "Food",
        "Education & Learning": "Education",
        "Travel & Local": "Travel",
        "Lifestyle & Utilities": "Lifestyle",
        "Gaming & Tech": "Gaming",
        "Finance & Commerce": "Finance",
        "Photo & Video": "Photo & Video",
        "Social & Communication": "Social",
        "Home & Family": "Home",
      }
      const categories = selectedNiches.map((n) => categoryMap[n] || n)
      await fetch("/api/creator/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      })
    } catch {
      // non-critical, continue
    }
    router.push("/creator")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LogoFull className="w-20 h-20" />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-primary/60" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Experience */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Have you done UGC work before?</h1>
              <p className="text-muted-foreground mt-2">This helps us personalise your onboarding path.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setExperience("yes")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  experience === "yes" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  experience === "yes" ? "bg-primary/15" : "bg-muted"
                }`}>
                  <CheckCircle2 className={`h-5 w-5 ${experience === "yes" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Yes, I&apos;ve created for brands</p>
                  <p className="text-xs text-muted-foreground mt-0.5">I have experience making UGC content</p>
                </div>
              </button>
              <button
                onClick={() => setExperience("no")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  experience === "no" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  experience === "no" ? "bg-primary/15" : "bg-muted"
                }`}>
                  <Sparkles className={`h-5 w-5 ${experience === "no" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm">No, I&apos;m just getting started</p>
                  <p className="text-xs text-muted-foreground mt-0.5">New to UGC — I want to learn and earn</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => experience && setStep(2)}
              disabled={!experience}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Brand showcase */}
        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {firstName}, you could work with these brands!
              </h1>
              <p className="text-muted-foreground mt-2">
                {experience === "no"
                  ? "Even as a beginner, you can create content for major companies."
                  : "Your experience makes you a great fit for top brand campaigns."}
              </p>
            </div>

            {/* Brand logo grid */}
            <div className="grid grid-cols-3 gap-3">
              {BRANDS.map((brand) => (
                <div
                  key={brand.name}
                  className="bg-card border rounded-xl p-3 flex items-center justify-center aspect-square shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://logo.clearbit.com/${brand.domain}`}
                    alt={brand.name}
                    className="h-10 w-10 object-contain"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement
                      el.style.display = "none"
                      const parent = el.parentElement
                      if (parent) {
                        parent.innerHTML = `<span class="text-xs font-bold text-muted-foreground">${brand.name}</span>`
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Niche selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">What are your niches?</h1>
              <p className="text-muted-foreground mt-2">Select up to 5. We&apos;ll match you with the right campaigns.</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {NICHES.map((niche) => {
                const active = selectedNiches.includes(niche.label)
                return (
                  <button
                    key={niche.label}
                    onClick={() => toggleNiche(niche.label)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <span>{niche.icon}</span>
                    {niche.label}
                  </button>
                )
              })}
            </div>

            {selectedNiches.length > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                {selectedNiches.length}/5 selected
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 h-12 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={finish}
                disabled={selectedNiches.length === 0 || saving}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-primary/90 transition-colors"
              >
                {saving ? "Saving..." : "Go to Dashboard"}
                {!saving && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

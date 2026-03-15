"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { CONTENT_TYPES, CATEGORIES, PLATFORMS } from "@/lib/constants"

const STEPS = [
  { id: "basics", title: "Basic Info" },
  { id: "brief", title: "Creative Brief" },
  { id: "requirements", title: "Requirements" },
  { id: "budget", title: "Budget & Timeline" },
  { id: "review", title: "Review" },
]

export default function NewCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    content_types: [] as string[],
    required_platforms: [] as string[],
    brief_objective: "",
    brief_deliverables: [] as { type: string; quantity: number }[],
    brief_dos: "",
    brief_donts: "",
    target_audience: "",
    age_range: "",
    gender_preference: "",
    location_requirements: [] as string[],
    language_requirements: [] as string[],
    min_followers: 0,
    budget_cents: 0,
    budget_per_creator_cents: 0,
    max_creators: 10,
    application_deadline: "",
    content_deadline: "",
    start_date: "",
    end_date: "",
    usage_rights: "non_exclusive",
    rights_duration_days: 90,
  })

  function updateForm(updates: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  function toggleArrayItem(key: keyof typeof form, value: string) {
    const arr = form[key] as string[]
    if (arr.includes(value)) {
      updateForm({ [key]: arr.filter((v) => v !== value) })
    } else {
      updateForm({ [key]: [...arr, value] })
    }
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create campaign")
      }

      const campaign = await res.json()
      toast.success("Campaign created successfully!")
      router.push(`/dashboard/campaigns/${campaign.id}`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/campaigns" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground">Set up your UGC campaign in a few steps</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full ${
                i === step ? "bg-primary text-primary-foreground" :
                i < step ? "bg-primary/10 text-primary" :
                "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-lg p-6">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder="e.g., Summer Product Review Campaign"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Describe your campaign goals and what you're looking for..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Types *</label>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleArrayItem("content_types", type.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.content_types.includes(type.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Required Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => toggleArrayItem("required_platforms", p.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.required_platforms.includes(p.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Creative Brief */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Creative Brief</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Objective *</label>
              <textarea
                value={form.brief_objective}
                onChange={(e) => updateForm({ brief_objective: e.target.value })}
                placeholder="What do you want to achieve? e.g., Product awareness, drive sales, social proof..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Do&apos;s (What creators should include)</label>
              <textarea
                value={form.brief_dos}
                onChange={(e) => updateForm({ brief_dos: e.target.value })}
                placeholder="e.g., Show product in use, mention key features, include call-to-action..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Don&apos;ts (What to avoid)</label>
              <textarea
                value={form.brief_donts}
                onChange={(e) => updateForm({ brief_donts: e.target.value })}
                placeholder="e.g., Don't mention competitors, avoid negative language..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Requirements */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Creator Requirements</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <input
                type="text"
                value={form.target_audience}
                onChange={(e) => updateForm({ target_audience: e.target.value })}
                placeholder="e.g., Women 25-34 interested in skincare"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age Range</label>
                <input
                  type="text"
                  value={form.age_range}
                  onChange={(e) => updateForm({ age_range: e.target.value })}
                  placeholder="e.g., 18-35"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender Preference</label>
                <select
                  value={form.gender_preference}
                  onChange={(e) => updateForm({ gender_preference: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Followers</label>
              <input
                type="number"
                value={form.min_followers || ""}
                onChange={(e) => updateForm({ min_followers: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}

        {/* Step 4: Budget & Timeline */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Budget & Timeline</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Budget (EUR) *</label>
                <input
                  type="number"
                  value={form.budget_cents ? form.budget_cents / 100 : ""}
                  onChange={(e) => updateForm({ budget_cents: Math.round(parseFloat(e.target.value) * 100) || 0 })}
                  placeholder="5000"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Per Creator (EUR)</label>
                <input
                  type="number"
                  value={form.budget_per_creator_cents ? form.budget_per_creator_cents / 100 : ""}
                  onChange={(e) => updateForm({ budget_per_creator_cents: Math.round(parseFloat(e.target.value) * 100) || 0 })}
                  placeholder="500"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Creators</label>
              <input
                type="number"
                value={form.max_creators}
                onChange={(e) => updateForm({ max_creators: parseInt(e.target.value) || 10 })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Application Deadline</label>
                <input
                  type="date"
                  value={form.application_deadline}
                  onChange={(e) => updateForm({ application_deadline: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Deadline</label>
                <input
                  type="date"
                  value={form.content_deadline}
                  onChange={(e) => updateForm({ content_deadline: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usage Rights</label>
                <select
                  value={form.usage_rights}
                  onChange={(e) => updateForm({ usage_rights: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="non_exclusive">Non-Exclusive</option>
                  <option value="exclusive">Exclusive</option>
                  <option value="limited">Limited</option>
                  <option value="perpetual">Perpetual</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rights Duration (days)</label>
                <input
                  type="number"
                  value={form.rights_duration_days}
                  onChange={(e) => updateForm({ rights_duration_days: parseInt(e.target.value) || 90 })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Review Campaign</h2>
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Basic Info</h3>
                <p><span className="text-muted-foreground">Title:</span> {form.title || "Not set"}</p>
                <p><span className="text-muted-foreground">Content Types:</span> {form.content_types.join(", ") || "None"}</p>
                <p><span className="text-muted-foreground">Platforms:</span> {form.required_platforms.join(", ") || "Any"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Brief</h3>
                <p><span className="text-muted-foreground">Objective:</span> {form.brief_objective || "Not set"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Budget</h3>
                <p><span className="text-muted-foreground">Total:</span> ${(form.budget_cents / 100).toLocaleString()}</p>
                <p><span className="text-muted-foreground">Per Creator:</span> ${(form.budget_per_creator_cents / 100).toLocaleString()}</p>
                <p><span className="text-muted-foreground">Max Creators:</span> {form.max_creators}</p>
                <p><span className="text-muted-foreground">Rights:</span> {form.usage_rights} ({form.rights_duration_days} days)</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !form.title}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !form.title || !form.budget_cents}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Create Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

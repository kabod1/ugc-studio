"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Loader2, Bot } from "lucide-react"
import { CreateInfluencerWizard } from "./create-influencer-wizard"

interface AIInfluencer {
  id: string
  name: string
  type: "uploaded" | "virtual"
  avatar_url: string
  generation_quality: "standard" | "premium"
  voice_id: string | null
  personality: string | null
  created_at: string
}

interface AIInfluencersTabProps {
  isScaleTier: boolean
  influencerLimit: number
  onInfluencerCreated?: () => void
}

const VOICE_LABEL: Record<string, string> = {
  "EXAVITQu4vr4xnSDxMaL": "Warm & Friendly",
  "VR6AewLTigWG4xSOukaG": "Deep & Authoritative",
  "ErXwobaYiN019PkySvjV": "Energetic & Youthful",
  "MF3mGyEYCl7XYWbV9V6O": "Professional & Calm",
}

export function AIInfluencersTab({ isScaleTier, influencerLimit, onInfluencerCreated }: AIInfluencersTabProps) {
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([])
  const [loading, setLoading] = useState(true)
  const [showWizard, setShowWizard] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchInfluencers()
  }, [])

  async function fetchInfluencers() {
    try {
      const res = await fetch("/api/ai-influencers")
      const data = await res.json()
      setInfluencers(data.influencers ?? [])
    } catch {
      toast.error("Failed to load influencers")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this influencer? This cannot be undone.")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/ai-influencers/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setInfluencers((prev) => prev.filter((i) => i.id !== id))
      toast.success("Influencer deleted")
    } catch {
      toast.error("Failed to delete influencer")
    } finally {
      setDeletingId(null)
    }
  }

  const atLimit = influencerLimit !== -1 && influencers.length >= influencerLimit

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Your AI Influencers</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage your brand&apos;s AI personas
            {influencerLimit !== -1 && ` · ${influencers.length}/${influencerLimit} used`}
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          disabled={influencerLimit === 0 || atLimit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus className="h-4 w-4" />
          Create Influencer
        </button>
      </div>

      {influencerLimit === 0 && (
        <div className="border rounded-lg p-4 bg-muted/50 text-sm text-muted-foreground">
          AI Influencers are not available on the Free plan.{" "}
          <a href="/dashboard/settings/billing" className="text-primary underline">Upgrade to Starter</a> to create up to 1 influencer.
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {influencers.map((inf) => (
            <div key={inf.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-muted relative">
                <img src={inf.avatar_url} alt={inf.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <div className="font-semibold text-sm">{inf.name}</div>
                <div className="text-xs text-muted-foreground">
                  {inf.type === "uploaded" ? "Uploaded photo" : "AI Generated"}
                  {inf.voice_id && ` · ${VOICE_LABEL[inf.voice_id] ?? "Custom voice"}`}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${inf.generation_quality === "premium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    {inf.generation_quality === "premium" ? "Premium HD" : "Standard"}
                  </span>
                  <button
                    onClick={() => handleDelete(inf.id)}
                    disabled={deletingId === inf.id}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                  >
                    {deletingId === inf.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          {influencerLimit !== 0 && !atLimit && (
            <button
              onClick={() => setShowWizard(true)}
              className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 p-6 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors min-h-[200px]"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Add Influencer</span>
            </button>
          )}

          {influencers.length === 0 && influencerLimit !== 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No influencers yet</p>
              <p className="text-sm mt-1">Create your first AI persona to appear in your videos</p>
            </div>
          )}
        </div>
      )}

      {showWizard && (
        <CreateInfluencerWizard
          onClose={() => setShowWizard(false)}
          onCreated={() => { fetchInfluencers(); onInfluencerCreated?.() }}
          isScaleTier={isScaleTier}
        />
      )}
    </div>
  )
}

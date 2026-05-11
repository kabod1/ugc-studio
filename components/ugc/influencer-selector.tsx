"use client"

import { useEffect, useState } from "react"
import { Bot, ChevronDown } from "lucide-react"

interface AIInfluencer {
  id: string
  name: string
  type: "uploaded" | "virtual"
  avatar_url: string
  generation_quality: "standard" | "premium"
  voice_id: string | null
}

interface InfluencerSelectorProps {
  value: string | null
  onChange: (id: string | null, influencer: AIInfluencer | null) => void
  disabled?: boolean
}

export function InfluencerSelector({ value, onChange, disabled }: InfluencerSelectorProps) {
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch("/api/ai-influencers")
      .then((r) => r.json())
      .then((data) => setInfluencers(data.influencers ?? []))
      .catch(() => {})
  }, [])

  const selected = influencers.find((i) => i.id === value) ?? null

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-left hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
      >
        {selected ? (
          <>
            <img
              src={selected.avatar_url}
              alt={selected.name}
              className="h-6 w-6 rounded-full object-cover flex-shrink-0"
            />
            <span className="flex-1 truncate">{selected.name}</span>
            {selected.generation_quality === "premium" && (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">HeyGen</span>
            )}
          </>
        ) : (
          <>
            <Bot className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 text-muted-foreground">No influencer (generic avatar)</span>
          </>
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-11 z-20 w-full bg-popover border rounded-md shadow-lg py-1 max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => { onChange(null, null); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left"
            >
              <Bot className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">No influencer (generic avatar)</span>
            </button>
            {influencers.map((inf) => (
              <button
                key={inf.id}
                type="button"
                onClick={() => { onChange(inf.id, inf); setOpen(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left"
              >
                <img
                  src={inf.avatar_url}
                  alt={inf.name}
                  className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                />
                <span className="flex-1 truncate">{inf.name}</span>
                {inf.generation_quality === "premium" && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">HeyGen</span>
                )}
              </button>
            ))}
            {influencers.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">No influencers created yet</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

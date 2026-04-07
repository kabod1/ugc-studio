"use client"

import { useState } from "react"
import { Globe } from "lucide-react"

export type LegalLang = "en" | "de" | "fr"

const LABELS: Record<LegalLang, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
}

interface LegalLangSwitcherProps {
  lang: LegalLang
  onChange: (lang: LegalLang) => void
}

export function LegalLangSwitcher({ lang, onChange }: LegalLangSwitcherProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        {LABELS[lang]}
        <span className="ml-0.5 text-xs opacity-60">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-1 z-50 min-w-[120px] rounded-md border bg-popover shadow-md"
        >
          {(Object.keys(LABELS) as LegalLang[]).map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === lang}
              type="button"
              onClick={() => { onChange(l); setOpen(false) }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                l === lang ? "font-semibold text-primary" : "text-foreground"
              }`}
            >
              {LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

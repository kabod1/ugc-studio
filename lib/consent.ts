export type ConsentCategories = {
  essential: true
  functional: boolean
  analytics: boolean
  aiProcessing: boolean
}

const CONSENT_KEY = "townshub-cookie-consent"

export function getConsent(): ConsentCategories | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(CONSENT_KEY)
  if (!stored) return null
  try {
    const parsed = JSON.parse(stored)
    // Backfill aiProcessing for older consent objects that predate this field
    if (parsed && typeof parsed.aiProcessing === "undefined") {
      parsed.aiProcessing = false
    }
    return parsed as ConsentCategories
  } catch {
    return null
  }
}

export function setConsent(consent: Omit<ConsentCategories, "essential">): ConsentCategories {
  const full: ConsentCategories = { essential: true, ...consent }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(full))
  window.dispatchEvent(new CustomEvent("consent-updated", { detail: full }))
  return full
}

export function hasConsented(): boolean {
  return getConsent() !== null
}

export function acceptAll(): ConsentCategories {
  return setConsent({ functional: true, analytics: true, aiProcessing: true })
}

export function rejectAll(): ConsentCategories {
  return setConsent({ functional: false, analytics: false, aiProcessing: false })
}

export function withdrawAll(): ConsentCategories {
  return setConsent({ functional: false, analytics: false, aiProcessing: false })
}

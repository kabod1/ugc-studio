"use client"

import { useState } from "react"
import { CookiePreferences } from "@/components/shared/cookie-preferences"

export function ManageCookiesButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:text-foreground"
      >
        Manage Cookies
      </button>
      <CookiePreferences
        open={open}
        onClose={() => setOpen(false)}
        onSave={() => setOpen(false)}
      />
    </>
  )
}

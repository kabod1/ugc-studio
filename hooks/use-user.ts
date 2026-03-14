"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/types"
import type { User } from "@supabase/supabase-js"

async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const res = await fetch(`/api/auth/profile?userId=${userId}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          const p = await fetchProfile(user.id)
          setProfile(p)
        }
      } catch {
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          const p = await fetchProfile(session.user.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
    } catch {}
    setUser(null)
    setProfile(null)
    window.location.href = "/login"
  }

  return { user, profile, loading, signOut }
}

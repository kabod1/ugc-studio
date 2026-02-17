"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react"

const SUPABASE_URL = "https://shqkvzzwademhglwlgiy.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocWt2enp3YWRlbWhnbHdsZ2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQxNTIsImV4cCI6MjA4NjIwMDE1Mn0.fOhyCA9mD9KmS_ktqY26E8jMMuEUvZQshDb6je0a5A8"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setLoading(true)
    try {
      // Use direct fetch to bypass any Supabase client issues
      const authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      const authData = await authRes.json()

      if (!authRes.ok) {
        toast.error(`${authData.msg || "Login failed"} — Password sent: "${data.password}"`)
        setLoading(false)
        return
      }

      // Now set the session in the Supabase client so cookies get set
      const supabase = createClient()
      await supabase.auth.setSession({
        access_token: authData.access_token,
        refresh_token: authData.refresh_token,
      })

      toast.success("Login successful! Redirecting...")

      // Determine redirect destination based on role
      let destination = redirect || "/dashboard"

      try {
        const profileRes = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${authData.user.id}`,
          {
            headers: {
              "apikey": SUPABASE_ANON_KEY,
              "Authorization": `Bearer ${authData.access_token}`,
            },
          }
        )
        const profiles = await profileRes.json()
        const role = profiles?.[0]?.role

        if (role === "creator") destination = redirect || "/creator"
        else if (role === "admin") destination = redirect || "/admin"
      } catch {
        // Profile fetch failed — use default destination
      }

      window.location.href = destination
    } catch (err: any) {
      toast.error("Error: " + (err?.message || "Unknown error"))
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">UGC Studio</h1>
        </div>
        <p className="text-muted-foreground">Sign in to your account</p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}

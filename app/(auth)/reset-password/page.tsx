"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { LogoFull } from "@/components/shared/logo"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [ready, setReady] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    if (!email || !token) {
      // No OTP params — might be coming from Supabase magic link (hash-based)
      setReady(true)
      return
    }

    // Verify the OTP to establish a session before showing the form
    async function verifyOtp() {
      setVerifying(true)
      const supabase = createClient()
      const { error } = await supabase.auth.verifyOtp({
        email: email!,
        token: token!,
        type: "recovery",
      })
      if (error) {
        toast.error("This reset link has expired or already been used. Please request a new one.")
        router.push("/forgot-password")
        return
      }
      setReady(true)
      setVerifying(false)
    }

    verifyOtp()
  }, [searchParams, router])

  async function onSubmit(data: ResetPasswordFormData) {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Password updated successfully!")
      router.push("/login")
    }
    setLoading(false)
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Verifying your reset link...</p>
      </div>
    )
  }

  if (!ready) return null

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center"><LogoFull className="w-20 h-20" /></div>
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <p className="text-muted-foreground">Enter your new password below</p>
      </div>
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">New Password</label>
            <input id="password" type="password" placeholder="Min. 8 characters"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm_password" className="text-sm font-medium">Confirm Password</label>
            <input id="confirm_password" type="password" placeholder="Confirm password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("confirm_password")} />
            {errors.confirm_password && <p className="text-sm text-destructive">{errors.confirm_password.message}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

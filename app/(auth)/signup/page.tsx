"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupFormData } from "@/lib/validations/auth"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Sparkles, Building2, Palette, CheckCircle2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "brand" },
  })

  const selectedRole = watch("role")

  async function onSubmit(data: SignupFormData) {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        toast.error(result.error || "Signup failed. Please try again.")
        setLoading(false)
        return
      }
      if (result.needsConfirmation) {
        setDone(true)
      } else {
        toast.success("Account created!")
        router.push(data.role === "creator" ? "/creator" : "/dashboard")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">UGC Studio</h1>
        </div>
        <div className="bg-card border rounded-lg p-8 shadow-sm space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="text-muted-foreground">
            We sent a verification link to your email address. Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Back to Sign In
          </Link>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">UGC Studio</h1>
        </div>
        <p className="text-muted-foreground">Create your account</p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("role", "brand")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  selectedRole === "brand"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Building2 className={`h-6 w-6 ${selectedRole === "brand" ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${selectedRole === "brand" ? "text-primary" : ""}`}>Brand</span>
                <span className="text-xs text-muted-foreground text-center">Find creators & manage campaigns</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "creator")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  selectedRole === "creator"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Palette className={`h-6 w-6 ${selectedRole === "creator" ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${selectedRole === "creator" ? "text-primary" : ""}`}>Creator</span>
                <span className="text-xs text-muted-foreground text-center">Find campaigns & earn money</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
            <input
              id="full_name"
              type="text"
              placeholder="John Doe"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("full_name")}
            />
            {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
          </div>

          {selectedRole === "brand" && (
            <div className="space-y-2">
              <label htmlFor="company_name" className="text-sm font-medium">Company Name</label>
              <input
                id="company_name"
                type="text"
                placeholder="Your Company"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                {...register("company_name")}
              />
              {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
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
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm_password" className="text-sm font-medium">Confirm Password</label>
            <input
              id="confirm_password"
              type="password"
              placeholder="Confirm your password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("confirm_password")}
            />
            {errors.confirm_password && <p className="text-sm text-destructive">{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
      <p className="text-center text-xs text-muted-foreground">
        Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a>
      </p>
    </div>
  )
}

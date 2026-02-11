"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import type { CreatorProfile, ContentType } from "@/types"
import { CATEGORIES, CONTENT_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, X } from "lucide-react"

const profileSchema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be under 500 characters").nullable(),
  tiktok_handle: z.string().nullable(),
  instagram_handle: z.string().nullable(),
  youtube_handle: z.string().nullable(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  content_types: z.array(z.string()).min(1, "Select at least one content type"),
  base_rate_dollars: z.coerce
    .number()
    .min(0, "Rate cannot be negative")
    .max(100000, "Rate seems too high"),
  country: z.string().nullable(),
  city: z.string().nullable(),
  languages: z.array(z.string()),
  portfolio_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
  date_of_birth: z.string().nullable(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface CreatorProfileFormProps {
  profile: CreatorProfile
}

export function CreatorProfileForm({ profile }: CreatorProfileFormProps) {
  const [saving, setSaving] = useState(false)
  const [languageInput, setLanguageInput] = useState("")
  const supabase = createClient()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile.display_name,
      bio: profile.bio ?? "",
      tiktok_handle: profile.tiktok_handle ?? "",
      instagram_handle: profile.instagram_handle ?? "",
      youtube_handle: profile.youtube_handle ?? "",
      categories: profile.categories,
      content_types: profile.content_types,
      base_rate_dollars: profile.base_rate_cents / 100,
      country: profile.country ?? "",
      city: profile.city ?? "",
      languages: profile.languages ?? [],
      portfolio_url: profile.portfolio_url ?? "",
      date_of_birth: profile.date_of_birth ?? "",
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form

  const selectedCategories = watch("categories")
  const selectedContentTypes = watch("content_types")
  const languages = watch("languages")

  function toggleCategory(category: string) {
    const current = selectedCategories ?? []
    if (current.includes(category)) {
      setValue(
        "categories",
        current.filter((c) => c !== category),
        { shouldValidate: true }
      )
    } else {
      setValue("categories", [...current, category], { shouldValidate: true })
    }
  }

  function toggleContentType(type: string) {
    const current = selectedContentTypes ?? []
    if (current.includes(type)) {
      setValue(
        "content_types",
        current.filter((t) => t !== type),
        { shouldValidate: true }
      )
    } else {
      setValue("content_types", [...current, type], { shouldValidate: true })
    }
  }

  function addLanguage() {
    const trimmed = languageInput.trim()
    if (trimmed && !languages.includes(trimmed)) {
      setValue("languages", [...languages, trimmed])
      setLanguageInput("")
    }
  }

  function removeLanguage(lang: string) {
    setValue(
      "languages",
      languages.filter((l) => l !== lang)
    )
  }

  async function onSubmit(data: ProfileFormValues) {
    setSaving(true)
    try {
      const updateData = {
        display_name: data.display_name,
        bio: data.bio || null,
        tiktok_handle: data.tiktok_handle || null,
        instagram_handle: data.instagram_handle || null,
        youtube_handle: data.youtube_handle || null,
        categories: data.categories,
        content_types: data.content_types as ContentType[],
        base_rate_cents: Math.round(data.base_rate_dollars * 100),
        country: data.country || null,
        city: data.city || null,
        languages: data.languages,
        portfolio_url: data.portfolio_url || null,
        date_of_birth: data.date_of_birth || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("creator_profiles")
        .update(updateData)
        .eq("id", profile.id)

      if (error) throw error

      alert("Profile updated successfully!")
    } catch (err) {
      console.error("Error updating profile:", err)
      alert("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name *</Label>
            <Input
              id="display_name"
              {...register("display_name")}
              placeholder="Your display name"
            />
            {errors.display_name && (
              <p className="text-sm text-destructive">
                {errors.display_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register("bio")}
              placeholder="Tell brands about yourself, your style, and what makes your content unique..."
              rows={4}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="United States"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="Los Angeles"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register("date_of_birth")}
            />
            <p className="text-xs text-muted-foreground">
              Required for age verification. Must be 18 or older.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio URL</Label>
            <Input
              id="portfolio_url"
              type="url"
              {...register("portfolio_url")}
              placeholder="https://yourportfolio.com"
            />
            {errors.portfolio_url && (
              <p className="text-sm text-destructive">
                {errors.portfolio_url.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Connect your social accounts so brands can see your reach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tiktok_handle">TikTok Handle</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">@</span>
              <Input
                id="tiktok_handle"
                {...register("tiktok_handle")}
                placeholder="yourtiktok"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram_handle">Instagram Handle</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">@</span>
              <Input
                id="instagram_handle"
                {...register("instagram_handle")}
                placeholder="yourinstagram"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_handle">YouTube Handle</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">@</span>
              <Input
                id="youtube_handle"
                {...register("youtube_handle")}
                placeholder="youryoutube"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Select the categories that best describe your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  selectedCategories?.includes(category)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                )}
              >
                {category}
              </button>
            ))}
          </div>
          {errors.categories && (
            <p className="text-sm text-destructive mt-2">
              {errors.categories.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Content Types */}
      <Card>
        <CardHeader>
          <CardTitle>Content Types</CardTitle>
          <CardDescription>
            What types of content do you create?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleContentType(type.value)}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  selectedContentTypes?.includes(type.value)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
          {errors.content_types && (
            <p className="text-sm text-destructive mt-2">
              {errors.content_types.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
          <CardDescription>
            Languages you can create content in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              placeholder="e.g. English"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addLanguage()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addLanguage}>
              Add
            </Button>
          </div>
          {languages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Badge
                  key={lang}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Set your base rate for content creation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="base_rate_dollars">Base Rate (USD)</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                id="base_rate_dollars"
                type="number"
                step="0.01"
                min="0"
                {...register("base_rate_dollars")}
                placeholder="150.00"
                className="max-w-[200px]"
              />
            </div>
            {errors.base_rate_dollars && (
              <p className="text-sm text-destructive">
                {errors.base_rate_dollars.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This is your starting rate. You can propose different rates per campaign.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

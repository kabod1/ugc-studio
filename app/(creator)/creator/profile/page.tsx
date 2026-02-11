import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreatorProfileForm } from "@/components/creator/profile-form"

export default async function CreatorProfilePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!creatorProfile) redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your creator profile, social accounts, and preferences.
        </p>
      </div>

      <CreatorProfileForm profile={creatorProfile} />
    </div>
  )
}

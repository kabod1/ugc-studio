import { SupabaseClient } from "@supabase/supabase-js"

export async function getSignedUploadUrl(
  supabase: SupabaseClient,
  bucket: string,
  path: string
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path)

  if (error) throw error
  return data
}

export async function getPublicUrl(
  supabase: SupabaseClient,
  bucket: string,
  path: string
) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(
  supabase: SupabaseClient,
  bucket: string,
  path: string
) {
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) throw error
  return true
}

import { SupabaseClient } from "@supabase/supabase-js"
import type { Notification } from "@/types"

export async function getNotifications(
  supabase: SupabaseClient,
  userId: string,
  limit = 50
) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Notification[]
}

export async function markAsRead(
  supabase: SupabaseClient,
  notificationId: string
) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single()

  if (error) throw error
  return data as Notification
}

export async function markAllAsRead(
  supabase: SupabaseClient,
  userId: string
) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) throw error
  return true
}

export async function createNotification(
  supabase: SupabaseClient,
  data: {
    user_id: string
    title: string
    message: string
    type?: string
    link?: string
  }
) {
  const { data: notification, error } = await supabase
    .from("notifications")
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return notification as Notification
}

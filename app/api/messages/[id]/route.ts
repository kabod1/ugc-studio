import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

// GET: Get all messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversationId = params.id
    const serviceClient = createServiceClient()

    // Fetch messages with sender profile info
    const { data: messages, error: msgError } = await serviceClient
      .from("messages")
      .select(`
        id,
        conversation_id,
        sender_id,
        content,
        created_at,
        read_at,
        profiles:sender_id(full_name, avatar_url)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (msgError) {
      console.error("Error fetching messages:", msgError)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    // Mark unread messages as read for the current user
    // (messages not sent by this user that haven't been read yet)
    await serviceClient
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .is("read_at", null)

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error("Messages [id] GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

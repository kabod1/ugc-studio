import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

// GET: List conversations for the current user
export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const serviceClient = createServiceClient()

    // Get the user's brand
    const { data: brand } = await serviceClient
      .from("brands")
      .select("id, company_name")
      .eq("user_id", user.id)
      .single()

    // Get the user's creator profile
    const { data: creatorProfile } = await serviceClient
      .from("creator_profiles")
      .select("id, display_name")
      .eq("user_id", user.id)
      .single()

    if (!brand && !creatorProfile) {
      return NextResponse.json({ conversations: [] })
    }

    // Build query to get conversations where user is either brand or creator
    let query = serviceClient
      .from("conversations")
      .select(`
        id,
        brand_id,
        creator_id,
        campaign_id,
        last_message_at,
        created_at,
        brands(id, company_name),
        creator_profiles(id, display_name)
      `)
      .order("last_message_at", { ascending: false, nullsFirst: false })

    if (brand && creatorProfile) {
      query = query.or(`brand_id.eq.${brand.id},creator_id.eq.${creatorProfile.id}`)
    } else if (brand) {
      query = query.eq("brand_id", brand.id)
    } else if (creatorProfile) {
      query = query.eq("creator_id", creatorProfile.id)
    }

    const { data: conversations, error: convError } = await query

    if (convError) {
      console.error("Error fetching conversations:", convError)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    // Get the last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      (conversations || []).map(async (conv) => {
        const { data: lastMessage } = await serviceClient
          .from("messages")
          .select("content, created_at, sender_id")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        return {
          ...conv,
          last_message: lastMessage || null,
        }
      })
    )

    return NextResponse.json({
      conversations: conversationsWithLastMessage,
      userId: user.id,
      userBrandId: brand?.id || null,
      userCreatorId: creatorProfile?.id || null,
    })
  } catch (error) {
    console.error("Messages GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create a new message (and optionally a new conversation)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { conversation_id, brand_id, creator_id, campaign_id, content } = body

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const serviceClient = createServiceClient()
    let activeConversationId = conversation_id

    // If no conversation_id, create a new conversation
    if (!activeConversationId) {
      if (!brand_id || !creator_id) {
        return NextResponse.json(
          { error: "brand_id and creator_id are required to start a new conversation" },
          { status: 400 }
        )
      }

      // Check if conversation already exists between this brand and creator
      let existingQuery = serviceClient
        .from("conversations")
        .select("id")
        .eq("brand_id", brand_id)
        .eq("creator_id", creator_id)

      if (campaign_id) {
        existingQuery = existingQuery.eq("campaign_id", campaign_id)
      }

      const { data: existing } = await existingQuery.limit(1).single()

      if (existing) {
        activeConversationId = existing.id
      } else {
        const { data: newConv, error: convError } = await serviceClient
          .from("conversations")
          .insert({
            brand_id,
            creator_id,
            campaign_id: campaign_id || null,
            last_message_at: new Date().toISOString(),
          })
          .select("id")
          .single()

        if (convError) {
          console.error("Error creating conversation:", convError)
          return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
        }

        activeConversationId = newConv.id
      }
    }

    // Insert the message
    const { data: message, error: msgError } = await serviceClient
      .from("messages")
      .insert({
        conversation_id: activeConversationId,
        sender_id: user.id,
        content: content.trim(),
      })
      .select("*")
      .single()

    if (msgError) {
      console.error("Error creating message:", msgError)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    // Update conversation's last_message_at
    await serviceClient
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", activeConversationId)

    return NextResponse.json({
      message,
      conversation_id: activeConversationId,
    })
  } catch (error) {
    console.error("Messages POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

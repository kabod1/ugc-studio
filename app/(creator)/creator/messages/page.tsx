"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { MessageThread } from "@/components/shared/message-thread"
import { MessageSquare, Search, Loader2, Plus, X, Send } from "lucide-react"
import { toast } from "sonner"

interface Conversation {
  id: string
  brand_id: string
  creator_id: string
  campaign_id: string | null
  last_message_at: string
  created_at: string
  brands: { id: string; company_name: string } | null
  creator_profiles: { id: string; display_name: string } | null
  last_message: {
    content: string
    created_at: string
    sender_id: string
  } | null
}

interface Brand {
  id: string
  company_name: string
  industry: string | null
}

export default function CreatorMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // New conversation modal state
  const [showCompose, setShowCompose] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandsLoading, setBrandsLoading] = useState(false)
  const [brandSearch, setBrandSearch] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [firstMessage, setFirstMessage] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/messages")
        if (res.ok) {
          const data = await res.json()
          setConversations(data.conversations || [])
          if (data.userId) setCurrentUserId(data.userId)
          if (data.userCreatorId) setCreatorId(data.userCreatorId)
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  async function openCompose() {
    setShowCompose(true)
    setSelectedBrand(null)
    setBrandSearch("")
    setFirstMessage("")
    if (brands.length === 0) {
      setBrandsLoading(true)
      try {
        const res = await fetch("/api/brands")
        if (res.ok) {
          const data = await res.json()
          setBrands(data.brands || [])
        }
      } catch {
        toast.error("Could not load brands")
      } finally {
        setBrandsLoading(false)
      }
    }
  }

  async function sendFirstMessage() {
    if (!selectedBrand || !firstMessage.trim() || !creatorId) return
    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: selectedBrand.id,
          creator_id: creatorId,
          content: firstMessage.trim(),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        // Refresh conversations
        const refresh = await fetch("/api/messages")
        if (refresh.ok) {
          const refreshData = await refresh.json()
          const updatedConvs = refreshData.conversations || []
          setConversations(updatedConvs)
          // Select the new conversation
          const newConv = updatedConvs.find((c: Conversation) => c.id === data.conversation_id)
          if (newConv) setSelectedConversation(newConv)
        }
        setShowCompose(false)
        toast.success(`Message sent to ${selectedBrand.company_name}`)
      } else {
        toast.error("Failed to send message")
      }
    } catch {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const query = searchQuery.toLowerCase()
    return conversations.filter((conv) =>
      conv.brands?.company_name?.toLowerCase().includes(query)
    )
  }, [conversations, searchQuery])

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands
    const q = brandSearch.toLowerCase()
    return brands.filter((b) => b.company_name.toLowerCase().includes(q))
  }, [brands, brandSearch])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    if (isToday) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const truncate = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + "..."

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Communicate with brands about campaigns and collaborations
        </p>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        <div className="flex h-full">
          {/* Conversation list sidebar */}
          <div className="w-80 border-r flex flex-col shrink-0">
            {/* Search + New */}
            <div className="p-3 border-b space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button
                onClick={openCompose}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Message
              </button>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <p className="text-sm text-center">
                    {searchQuery ? "No conversations match your search" : "No conversations yet"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={openCompose}
                      className="mt-3 text-xs text-primary hover:underline"
                    >
                      Start a conversation →
                    </button>
                  )}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left px-4 py-3 border-b hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conv.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm truncate">
                        {conv.brands?.company_name || "Unknown Brand"}
                      </span>
                      {conv.last_message && (
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {formatTime(conv.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    {conv.last_message && (
                      <p className="text-xs text-muted-foreground truncate">
                        {truncate(conv.last_message.content, 50)}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message thread area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation && currentUserId ? (
              <MessageThread
                conversationId={selectedConversation.id}
                currentUserId={currentUserId}
                recipientName={selectedConversation.brands?.company_name || "Unknown Brand"}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-3" />
                <p className="text-sm">Select a conversation to start messaging</p>
                <button
                  onClick={openCompose}
                  className="mt-4 flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-semibold">New Message</h3>
              <button
                onClick={() => setShowCompose(false)}
                className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Brand selector */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">To (Brand)</label>
                {selectedBrand ? (
                  <div className="flex items-center justify-between h-10 px-3 rounded-md border border-input bg-primary/5">
                    <span className="text-sm font-medium text-primary">{selectedBrand.company_name}</span>
                    <button onClick={() => setSelectedBrand(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search brands..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        autoFocus
                      />
                    </div>
                    {brandsLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="max-h-40 overflow-y-auto border rounded-md divide-y">
                        {filteredBrands.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-3">No brands found</p>
                        ) : (
                          filteredBrands.slice(0, 20).map((brand) => (
                            <button
                              key={brand.id}
                              onClick={() => setSelectedBrand(brand)}
                              className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                            >
                              <span className="font-medium">{brand.company_name}</span>
                              {brand.industry && (
                                <span className="text-xs text-muted-foreground ml-2">{brand.industry}</span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message input */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <textarea
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  placeholder="Hi! I'd love to collaborate on a campaign..."
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              {/* Send button */}
              <button
                onClick={sendFirstMessage}
                disabled={!selectedBrand || !firstMessage.trim() || sending}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Mail, Plus, Search, X, Send, Edit2, Trash2,
  Building2, User, CheckCircle2, XCircle,
  Loader2, UserPlus, MailOpen, AlertCircle, Sparkles
} from "lucide-react"

type ProspectType = "brand" | "creator"
type ProspectStatus = "new" | "contacted" | "replied" | "onboarded" | "declined"

interface Prospect {
  id: string
  name: string
  email: string
  company: string | null
  type: ProspectType
  status: ProspectStatus
  notes: string | null
  source: string | null
  website: string | null
  instagram: string | null
  tiktok: string | null
  emails_sent: number
  last_contacted_at: string | null
  created_at: string
}

const STATUS_CONFIG: Record<ProspectStatus, { label: string; color: string; icon: React.ElementType }> = {
  new:       { label: "New",       color: "bg-blue-100 text-blue-700",   icon: UserPlus },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700", icon: MailOpen },
  replied:   { label: "Replied",   color: "bg-purple-100 text-purple-700", icon: Mail },
  onboarded: { label: "Onboarded", color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  declined:  { label: "Declined",  color: "bg-red-100 text-red-700",     icon: XCircle },
}

const BRAND_TEMPLATES = [
  {
    label: "Cold intro",
    subject: "Grow your brand with authentic UGC — UGC Studio",
    message: `I came across your brand and thought you'd be a great fit for UGC Studio.

We connect brands like yours with vetted content creators who produce authentic user-generated content — product videos, reviews, reels, and more — at a fraction of agency costs.

With UGC Studio you can:
• Post campaigns and receive applications within hours
• Review creator portfolios and pick the right fit
• Manage briefs, contracts, and payments all in one place

Brands on our platform typically see 3-5x better engagement compared to traditional ads.

Would love to show you around — it takes less than 5 minutes to post your first campaign.`,
  },
  {
    label: "Follow-up",
    subject: "Following up — UGC Studio",
    message: `Just wanted to follow up on my previous message about UGC Studio.

We've recently had several brands in your space launch successful UGC campaigns and I think you'd see great results too.

If you have any questions or would like a quick walkthrough, just reply here — happy to help.`,
  },
]

const CREATOR_TEMPLATES = [
  {
    label: "Cold intro",
    subject: "Get paid to create content — UGC Studio",
    message: `I saw your content and think you'd be a perfect fit for UGC Studio.

We're a platform that connects content creators with brands looking for authentic UGC — videos, photos, reels, and more. No follower count requirement, just quality content.

As a creator on UGC Studio you can:
• Browse paid campaigns from real brands
• Set your own rates and choose work you love
• Get paid securely through the platform

Creators on the platform earn between €100–€500 per campaign depending on the deliverables.

Takes 2 minutes to set up your profile — would love to have you on board.`,
  },
  {
    label: "Follow-up",
    subject: "Still interested? — UGC Studio",
    message: `Circling back on my note about UGC Studio — we have several new brand campaigns posted this week that I think would suit your style.

If you're open to it, I'd love to get you onboarded. Just reply and I'll help you get set up.`,
  },
]

export default function AdminOutreachPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null)
  const [sendingTo, setSendingTo] = useState<Prospect | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProspects = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (typeFilter) params.set("type", typeFilter)
    if (statusFilter) params.set("status", statusFilter)
    const res = await fetch(`/api/admin/outreach?${params}`)
    const data = await res.json()
    setProspects(data.prospects || [])
    setLoading(false)
  }, [search, typeFilter, statusFilter])

  useEffect(() => {
    const t = setTimeout(fetchProspects, 300)
    return () => clearTimeout(t)
  }, [fetchProspects])

  async function handleDelete(id: string) {
    if (!confirm("Delete this prospect?")) return
    setDeletingId(id)
    await fetch(`/api/admin/outreach/${id}`, { method: "DELETE" })
    setDeletingId(null)
    fetchProspects()
  }

  async function handleStatusChange(id: string, status: ProspectStatus) {
    await fetch(`/api/admin/outreach/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    fetchProspects()
  }

  const stats = {
    total: prospects.length,
    new: prospects.filter(p => p.status === "new").length,
    contacted: prospects.filter(p => p.status === "contacted").length,
    replied: prospects.filter(p => p.status === "replied").length,
    onboarded: prospects.filter(p => p.status === "onboarded").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Outreach</h1>
          <p className="text-muted-foreground text-sm">Source and contact brands &amp; creators to join the platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" /> AI Source
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Manually
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "New", value: stats.new, color: "text-blue-600" },
          { label: "Contacted", value: stats.contacted, color: "text-yellow-600" },
          { label: "Replied", value: stats.replied, color: "text-purple-600" },
          { label: "Onboarded", value: stats.onboarded, color: "text-green-600" },
        ].map(s => (
          <div key={s.label} className="bg-card border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, company..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-36"
        >
          <option value="">All Types</option>
          <option value="brand">Brands</option>
          <option value="creator">Creators</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-40"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : prospects.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">No prospects yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add brands and creators you want to reach out to</p>
          <button onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add your first prospect
          </button>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Emails</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {prospects.map(p => {
                  const s = STATUS_CONFIG[p.status]
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                          {p.company && <p className="text-xs text-muted-foreground">{p.company}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.type === "brand" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {p.type === "brand" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={p.status}
                          onChange={e => handleStatusChange(p.id, e.target.value as ProspectStatus)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none ${s.color}`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground">{p.emails_sent || 0}</span>
                        {p.last_contacted_at && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(p.last_contacted_at).toLocaleDateString("en-IE", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{p.source || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSendingTo(p)}
                            className="p-1.5 rounded-md hover:bg-primary/10 text-primary"
                            title="Send email"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingProspect(p)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
                            title="Delete"
                          >
                            {deletingId === p.id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Source Modal */}
      {showAiModal && (
        <AiSourceModal
          onClose={() => setShowAiModal(false)}
          onAdded={() => { setShowAiModal(false); fetchProspects() }}
        />
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingProspect) && (
        <ProspectModal
          prospect={editingProspect}
          onClose={() => { setShowAddModal(false); setEditingProspect(null) }}
          onSaved={() => { setShowAddModal(false); setEditingProspect(null); fetchProspects() }}
        />
      )}

      {/* Send Email Modal */}
      {sendingTo && (
        <SendEmailModal
          prospect={sendingTo}
          onClose={() => setSendingTo(null)}
          onSent={() => { setSendingTo(null); fetchProspects() }}
        />
      )}
    </div>
  )
}

// ─── Add / Edit Prospect Modal ─────────────────────────────────────────────

function ProspectModal({
  prospect,
  onClose,
  onSaved,
}: {
  prospect: Prospect | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    name: prospect?.name || "",
    email: prospect?.email || "",
    company: prospect?.company || "",
    type: prospect?.type || "brand",
    notes: prospect?.notes || "",
    source: prospect?.source || "",
    website: prospect?.website || "",
    instagram: prospect?.instagram || "",
    tiktok: prospect?.tiktok || "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const url = prospect ? `/api/admin/outreach/${prospect.id}` : "/api/admin/outreach"
      const method = prospect ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to save"); return }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-lg">{prospect ? "Edit Prospect" : "Add Prospect"}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ProspectType }))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm">
                <option value="brand">Brand</option>
                <option value="creator">Creator</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Source</label>
              <input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                placeholder="Instagram, LinkedIn, referral..."
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="email@example.com"
              className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {form.type === "brand" ? "Company / Brand Name" : "Handle / Niche"}
            </label>
            <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              placeholder={form.type === "brand" ? "Acme Inc." : "Lifestyle / Travel"}
              className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</label>
              <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                placeholder="https://"
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Instagram</label>
              <input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                placeholder="@handle"
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any context about this prospect..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm resize-none" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Cancel</button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {prospect ? "Save Changes" : "Add Prospect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Send Email Modal ──────────────────────────────────────────────────────

function SendEmailModal({
  prospect,
  onClose,
  onSent,
}: {
  prospect: Prospect
  onClose: () => void
  onSent: () => void
}) {
  const templates = prospect.type === "brand" ? BRAND_TEMPLATES : CREATOR_TEMPLATES
  const [subject, setSubject] = useState(templates[0].subject)
  const [message, setMessage] = useState(templates[0].message)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  function applyTemplate(idx: number) {
    setSubject(templates[idx].subject)
    setMessage(templates[idx].message)
  }

  async function handleSend() {
    setSending(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/outreach/${prospect.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to send email"); return }
      setSent(true)
      setTimeout(onSent, 1500)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-semibold text-lg">Send Outreach Email</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              To: <strong>{prospect.name}</strong> · {prospect.email}
              {prospect.emails_sent > 0 && (
                <span className="ml-2 text-xs text-yellow-600">({prospect.emails_sent} email{prospect.emails_sent !== 1 ? "s" : ""} already sent)</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        {sent ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-lg">Email sent!</p>
            <p className="text-muted-foreground text-sm mt-1">Status updated to "Contacted"</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {/* Template picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Template</label>
              <div className="flex gap-2">
                {templates.map((t, i) => (
                  <button key={i} type="button" onClick={() => applyTemplate(i)}
                    className="px-3 py-1.5 rounded-md border text-sm hover:bg-muted">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={14}
                className="flex w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm font-mono resize-none"
              />
              <p className="text-xs text-muted-foreground">A "Join UGC Studio" CTA button and unsubscribe note will be added automatically.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Cancel</button>
              <button onClick={handleSend} disabled={sending || !subject || !message}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── AI Source Modal ───────────────────────────────────────────────────────

const INDUSTRIES = [
  "Beauty", "Fashion", "Tech", "Food & Beverage", "Fitness", "Travel",
  "Lifestyle", "Gaming", "Education", "Finance", "Health", "Home & Garden",
  "Pets", "Entertainment", "Automotive", "Sports",
]

interface AiProspect {
  name: string
  email: string
  company: string | null
  type: ProspectType
  website: string | null
  instagram: string | null
  tiktok: string | null
  industry: string | null
  notes: string | null
  source: string
  why_good_fit?: string
  estimated_budget?: string
  content_types?: string
}

function AiSourceModal({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: () => void
}) {
  const [type, setType] = useState<ProspectType>("brand")
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [count, setCount] = useState(10)
  const [extra, setExtra] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AiProspect[]>([])
  const [emails, setEmails] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [addedCount, setAddedCount] = useState(0)
  const [error, setError] = useState("")

  async function handleGenerate() {
    setLoading(true)
    setError("")
    setResults([])
    setEmails({})
    setSelected(new Set())
    try {
      const res = await fetch("/api/admin/outreach/ai-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, industry, location, count, extra_criteria: extra }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to generate prospects"); return }
      setResults(data.prospects || [])
      // Select all by default
      setSelected(new Set((data.prospects || []).map((_: any, i: number) => i)))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleSelect(i: number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function selectAll() { setSelected(new Set(results.map((_, i) => i))) }
  function selectNone() { setSelected(new Set()) }

  async function handleAdd() {
    const toAdd = results
      .map((p, i) => ({ p, i }))
      .filter(({ i }) => selected.has(i))

    if (!toAdd.length) return

    // Validate that selected prospects have emails filled in
    const missingEmail = toAdd.find(({ i }) => !(emails[i] || "").trim())
    if (missingEmail) {
      setError("Please fill in the email address for all selected prospects before adding.")
      return
    }

    setAdding(true)
    setError("")
    try {
      const responses = await Promise.all(
        toAdd.map(({ p, i }) => {
          const clean = {
            ...p,
            name: (p.name || "").trim(),
            email: (emails[i] || "").trim().toLowerCase(),
            company: (p.company || "").trim() || null,
            website: (p.website || "").trim() || null,
            instagram: (p.instagram || "").trim() || null,
            tiktok: (p.tiktok || "").trim() || null,
          }
          return fetch("/api/admin/outreach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clean),
          }).then(r => r.json().then(d => ({ ok: r.ok, status: r.status, data: d })))
        })
      )

      const failed = responses.filter(r => !r.ok)
      const succeeded = responses.filter(r => r.ok).length

      if (succeeded === 0 && failed.length > 0) {
        // All failed — show error
        const firstErr = failed[0].data?.error || "Failed to add prospects"
        setError(`Could not add prospects: ${firstErr}`)
        return
      }

      // At least some succeeded
      setAddedCount(succeeded)
      setAdded(true)
      if (failed.length > 0) {
        // Some skipped (likely duplicates)
        console.warn(`${failed.length} prospects skipped (likely duplicate emails)`)
      }
      setTimeout(onAdded, 1200)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">AI Prospect Sourcing</h2>
              <p className="text-xs text-muted-foreground">GPT-4 finds real-fit prospects — you pick the ones you want</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        {added ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-lg">{addedCount} prospect{addedCount !== 1 ? "s" : ""} added!</p>
            <p className="text-muted-foreground text-sm mt-1">Ready to send outreach emails</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {/* Criteria form */}
            {results.length === 0 && !loading && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Source Type *</label>
                    <select value={type} onChange={e => setType(e.target.value as ProspectType)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm">
                      <option value="brand">Brands</option>
                      <option value="creator">Creators</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Industry / Niche</label>
                    <select value={industry} onChange={e => setIndustry(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm">
                      <option value="">Any industry</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location / Market</label>
                    <input value={location} onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Ireland, UK, Europe..."
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Number to Generate</label>
                    <select value={count} onChange={e => setCount(parseInt(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm">
                      {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} prospects</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Extra Criteria (optional)</label>
                  <input value={extra} onChange={e => setExtra(e.target.value)}
                    placeholder={type === "brand" ? "e.g. DTC brands, skincare, under 50 employees..." : "e.g. female creators, 18–30, lifestyle content..."}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm" />
                </div>
                <button onClick={handleGenerate}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:opacity-90">
                  <Sparkles className="h-4 w-4" />
                  Generate {count} {type === "brand" ? "Brand" : "Creator"} Prospects with AI
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="py-16 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium">AI is sourcing {count} {type === "brand" ? "brand" : "creator"} prospects...</p>
                <p className="text-sm text-muted-foreground">This takes about 10–20 seconds</p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  AI does not generate real email addresses. Fill in each prospect's real email before adding them.
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{results.length} prospects generated — select the ones you want to add</p>
                  <div className="flex gap-2 text-xs">
                    <button onClick={selectAll} className="text-primary hover:underline">Select all</button>
                    <span className="text-muted-foreground">·</span>
                    <button onClick={selectNone} className="text-muted-foreground hover:text-foreground">None</button>
                    <span className="text-muted-foreground">·</span>
                    <button onClick={() => { setResults([]); setSelected(new Set()) }}
                      className="text-muted-foreground hover:text-foreground">
                      Start over
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {results.map((p, i) => (
                    <button key={i} type="button" onClick={() => toggleSelect(i)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selected.has(i)
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          selected.has(i) ? "border-primary bg-primary" : "border-muted-foreground/40"
                        }`}>
                          {selected.has(i) && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{p.name}</span>
                            {p.company && (
                              <span className="text-xs text-muted-foreground">· {p.company}</span>
                            )}
                            {p.industry && (
                              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{p.industry}</span>
                            )}
                          </div>
                          {p.notes && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.notes}</p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                            {p.website && <span>🌐 {p.website.replace("https://", "").replace("http://", "")}</span>}
                            {p.instagram && <span>📸 {p.instagram}</span>}
                            {p.tiktok && <span>🎵 {p.tiktok}</span>}
                          </div>
                          {/* Real email input */}
                          <div className="mt-2" onClick={e => e.stopPropagation()}>
                            <input
                              type="email"
                              value={emails[i] || ""}
                              onChange={e => setEmails(prev => ({ ...prev, [i]: e.target.value }))}
                              placeholder="Enter real email address..."
                              className={`flex h-8 w-full rounded-md border px-2.5 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring ${
                                selected.has(i) && !(emails[i] || "").trim()
                                  ? "border-orange-400 placeholder:text-orange-400"
                                  : "border-input"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">{selected.size} of {results.length} selected</p>
                  <button onClick={handleAdd} disabled={adding || selected.size === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:opacity-90 disabled:opacity-50">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    Add {selected.size} to Outreach List
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

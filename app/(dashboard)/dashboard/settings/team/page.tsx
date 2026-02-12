"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus, Trash2, Loader2 } from "lucide-react"

interface TeamMember {
  id: string
  email: string
  role: string
  status: string
  created_at: string
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [currentCount, setCurrentCount] = useState(0)
  const [limit, setLimit] = useState(1)
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "member">("member")

  async function fetchTeam() {
    try {
      const res = await fetch("/api/team")
      const data = await res.json()
      if (res.ok) {
        setMembers(data.members)
        setCurrentCount(data.currentCount)
        setLimit(data.limit)
      } else {
        alert(data.error || "Failed to load team members")
      }
    } catch {
      alert("Failed to load team members")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setInviting(true)
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      })
      const data = await res.json()
      if (res.ok) {
        alert("Invite sent successfully!")
        setEmail("")
        setRole("member")
        fetchTeam()
      } else {
        alert(data.error || "Failed to send invite")
      }
    } catch {
      alert("Failed to send invite")
    } finally {
      setInviting(false)
    }
  }

  async function handleRemove(memberId: string) {
    if (!confirm("Are you sure you want to remove this team member?")) return

    setRemovingId(memberId)
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      })
      const data = await res.json()
      if (res.ok) {
        alert("Team member removed")
        fetchTeam()
      } else {
        alert(data.error || "Failed to remove team member")
      }
    } catch {
      alert("Failed to remove team member")
    } finally {
      setRemovingId(null)
    }
  }

  const formatLimit = (n: number) => (n === -1 ? "Unlimited" : String(n))
  const usagePercent = limit === -1 ? 0 : Math.min(100, (currentCount / limit) * 100)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Team Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Invite and manage team members who can access your brand workspace.
        </p>
      </div>

      {/* Usage */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Team Seats Used</span>
          <span className="font-medium">
            {currentCount} / {formatLimit(limit)} team seats used
          </span>
        </div>
        {limit !== -1 && (
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        )}
        {limit === -1 && (
          <p className="text-xs text-muted-foreground">Unlimited team seats on your current plan.</p>
        )}
      </div>

      {/* Team Members Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Team Members</h2>
        </div>
        {members.length === 0 ? (
          <div className="px-6 py-8 text-center text-muted-foreground">
            No team members yet. Invite someone below.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-6 py-3 font-medium">Email</th>
                  <th className="text-left px-6 py-3 font-medium">Role</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Joined</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b last:border-0">
                    <td className="px-6 py-3">{member.email}</td>
                    <td className="px-6 py-3 capitalize">{member.role}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          member.status === "active"
                            ? "bg-green-100 text-green-700"
                            : member.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleRemove(member.id)}
                        disabled={removingId === member.id}
                        className="inline-flex items-center gap-1 text-destructive hover:text-destructive/80 text-sm disabled:opacity-50"
                      >
                        {removingId === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Form */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite Team Member
        </h2>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={inviting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {inviting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Send Invite
          </button>
        </form>
      </div>
    </div>
  )
}

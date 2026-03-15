import { createServiceClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Users, CheckCircle2, XCircle } from "lucide-react"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { role?: string; search?: string }
}) {
  const svc = createServiceClient()

  // Get all auth users (includes email + user_metadata)
  const { data: authData } = await svc.auth.admin.listUsers({ perPage: 200 })
  // Get all profiles (includes role)
  const { data: profiles } = await svc.from("profiles").select("id, role, created_at")

  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))

  let users = (authData?.users || []).map((u: any) => ({
    id: u.id,
    email: u.email,
    full_name: u.user_metadata?.full_name || u.user_metadata?.name || "",
    role: profileMap.get(u.id)?.role || u.user_metadata?.role || "brand",
    created_at: profileMap.get(u.id)?.created_at || u.created_at,
    is_verified: !!u.email_confirmed_at,
    is_active: !u.banned_until,
  }))

  if (searchParams.role && searchParams.role !== "all") {
    users = users.filter((u) => u.role === searchParams.role)
  }
  if (searchParams.search) {
    const q = searchParams.search.toLowerCase()
    users = users.filter((u) => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage all platform users</p>
      </div>

      <div className="bg-card border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Verified</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Active</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.full_name || "No name"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin" ? "bg-red-100 text-red-800" :
                      user.role === "creator" ? "bg-purple-100 text-purple-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>{user.role}</span>
                  </td>
                  <td className="p-4">
                    {user.is_verified ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`h-2 w-2 rounded-full inline-block ${user.is_active ? "bg-green-500" : "bg-red-500"}`} />
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(user.created_at)}</td>
                  <td className="p-4">
                    <Link href={`/admin/users/${user.id}`} className="text-primary hover:underline text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}

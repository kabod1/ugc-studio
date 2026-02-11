"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { BarChart3, Users, Megaphone, DollarSign } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({ users: 0, brands: 0, creators: 0, campaigns: 0, revenue: 0, content: 0 })

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const [u, b, c, ca, p, co] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("brands").select("*", { count: "exact", head: true }),
        supabase.from("creator_profiles").select("*", { count: "exact", head: true }),
        supabase.from("campaigns").select("*", { count: "exact", head: true }),
        supabase.from("payments").select("platform_fee_cents").eq("status", "released"),
        supabase.from("content_submissions").select("*", { count: "exact", head: true }),
      ])
      setStats({
        users: u.count || 0, brands: b.count || 0, creators: c.count || 0,
        campaigns: ca.count || 0,
        revenue: p.data?.reduce((s, x) => s + (x.platform_fee_cents || 0), 0) || 0,
        content: co.count || 0,
      })
    }
    fetch()
  }, [])

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Platform Analytics</h1><p className="text-muted-foreground">Key platform metrics and insights</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: formatNumber(stats.users), icon: Users, color: "text-blue-600 bg-blue-100" },
          { label: "Brands", value: formatNumber(stats.brands), icon: Users, color: "text-purple-600 bg-purple-100" },
          { label: "Creators", value: formatNumber(stats.creators), icon: Users, color: "text-pink-600 bg-pink-100" },
          { label: "Campaigns", value: formatNumber(stats.campaigns), icon: Megaphone, color: "text-green-600 bg-green-100" },
          { label: "Platform Revenue", value: formatCurrency(stats.revenue), icon: DollarSign, color: "text-orange-600 bg-orange-100" },
          { label: "Content Pieces", value: formatNumber(stats.content), icon: BarChart3, color: "text-teal-600 bg-teal-100" },
        ].map((s) => (
          <div key={s.label} className="bg-card border rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
              <div className={`p-3 rounded-lg ${s.color}`}><s.icon className="h-5 w-5" /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">Advanced analytics charts coming soon</p>
        <p className="text-sm">Revenue trends, user growth, and campaign performance charts will appear here</p>
      </div>
    </div>
  )
}

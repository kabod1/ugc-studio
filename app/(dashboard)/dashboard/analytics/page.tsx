"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Megaphone, FileVideo, DollarSign, TrendingUp, Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface AnalyticsData {
  summary: {
    totalCampaigns: number
    activeCampaigns: number
    totalContent: number
    totalSpendCents: number
  }
  monthlyData: { month: string; campaigns: number; spendCents: number }[]
  contentBreakdown: { status: string; count: number }[]
}

const PIE_COLORS: Record<string, string> = {
  approved: "#22c55e",
  pending: "#eab308",
  rejected: "#ef4444",
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error("Failed to load analytics:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load analytics data.
      </div>
    )
  }

  const { summary, monthlyData, contentBreakdown } = data

  // Format spend data for the line chart (cents -> EUR display value)
  const spendChartData = monthlyData.map((d) => ({
    month: d.month,
    spend: d.spendCents / 100,
  }))

  // Filter out zero-count statuses for pie chart
  const pieData = contentBreakdown.filter((d) => d.count > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your campaign performance and ROI</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Megaphone className="h-4 w-4" /> Total Campaigns
          </div>
          <p className="text-2xl font-bold mt-1">{summary.totalCampaigns}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendingUp className="h-4 w-4" /> Active Campaigns
          </div>
          <p className="text-2xl font-bold mt-1">{summary.activeCampaigns}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <FileVideo className="h-4 w-4" /> Content Pieces
          </div>
          <p className="text-2xl font-bold mt-1">{summary.totalContent}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <DollarSign className="h-4 w-4" /> Total Spend
          </div>
          <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalSpendCents)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Campaigns per Month */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Campaigns per Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="campaigns" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Monthly Spend */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Monthly Spend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v: number) => formatCurrency(v * 100)} />
              <Tooltip formatter={(value: number) => formatCurrency(value * 100)} />
              <Line
                type="monotone"
                dataKey="spend"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Content Status Breakdown */}
        <div className="bg-card border rounded-lg p-6 lg:col-span-2">
          <h3 className="font-semibold text-lg mb-4">Content Status Breakdown</h3>
          {pieData.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No content submissions yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ status, count }: { status: string; count: number }) =>
                    `${status}: ${count}`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[entry.status] || "#7c3aed"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

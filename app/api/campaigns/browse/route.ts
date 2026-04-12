import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const svc = createServiceClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search") || ""
    const contentType = searchParams.get("content_type") || ""
    const platform = searchParams.get("platform") || ""
    const minBudget = searchParams.get("min_budget") ? parseInt(searchParams.get("min_budget")!) : null
    const maxBudget = searchParams.get("max_budget") ? parseInt(searchParams.get("max_budget")!) : null
    const sort = searchParams.get("sort") || "newest"
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)

    let query = svc
      .from("campaigns")
      .select(`
        id, title, description, budget_cents, content_types, required_platforms,
        content_deadline, max_creators, created_at,
        brands ( id, company_name, logo_url )
      `)
      .eq("status", "active")
      .limit(limit)

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (contentType) {
      query = query.contains("content_types", [contentType])
    }

    if (platform) {
      query = query.contains("required_platforms", [platform])
    }

    if (minBudget !== null) {
      query = query.gte("budget_cents", minBudget)
    }

    if (maxBudget !== null) {
      query = query.lte("budget_cents", maxBudget)
    }

    // Apply sort
    switch (sort) {
      case "budget_high":
        query = query.order("budget_cents", { ascending: false })
        break
      case "budget_low":
        query = query.order("budget_cents", { ascending: true })
        break
      case "deadline":
        query = query.order("content_deadline", { ascending: true, nullsFirst: false })
        break
      default: // newest
        query = query.order("created_at", { ascending: false })
    }

    const { data: campaigns, error } = await query

    if (error) {
      console.error("Browse campaigns error:", error)
      return NextResponse.json({ campaigns: [] })
    }

    return NextResponse.json({ campaigns: campaigns || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { scrapeCreators } from "@/lib/n8n/workflows"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const result = await scrapeCreators(body)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scraping failed" },
      { status: 500 }
    )
  }
}

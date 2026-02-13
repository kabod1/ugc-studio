import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } catch {
    // Continue even if sign out fails
  }
  return NextResponse.json({ success: true })
}

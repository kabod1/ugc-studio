import { NextResponse } from "next/server"

export async function GET() {
  const sk = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""

  // Test direct fetch with the trimmed key
  let fetchResult = "not_tested"
  try {
    const r = await fetch(`${url.trim()}/rest/v1/profiles?select=id,role&limit=1`, {
      headers: { apikey: sk.trim(), Authorization: `Bearer ${sk.trim()}` }
    })
    const data = await r.json()
    fetchResult = `status=${r.status} data=${JSON.stringify(data).substring(0, 100)}`
  } catch (e: any) {
    fetchResult = `error: ${e.message}`
  }

  return NextResponse.json({
    sk_length: sk.length,
    sk_last_char_code: sk.charCodeAt(sk.length - 1),
    sk_trimmed_length: sk.trim().length,
    fetch_result: fetchResult,
  })
}

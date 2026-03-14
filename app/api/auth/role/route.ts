import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ role: "brand" })
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=role&limit=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        cache: "no-store",
      }
    )
    const profiles = await res.json()
    const role = profiles?.[0]?.role ?? "brand"
    return NextResponse.json({ role })
  } catch {
    return NextResponse.json({ role: "brand" })
  }
}

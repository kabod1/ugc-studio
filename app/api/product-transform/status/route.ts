import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const N8N_API_URL = "https://admin17257.n8n-wsk.com/api/v1"
const N8N_API_KEY = process.env.N8N_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const job_id = searchParams.get("job_id")

    if (!job_id) {
      return NextResponse.json({ error: "job_id required" }, { status: 400 })
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({
        error: "Server configuration error",
        has_url: !!SUPABASE_URL,
        has_key: !!SUPABASE_KEY,
      }, { status: 500 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    const { data: jobs, error: jobError } = await supabase
      .from("product_transform_jobs")
      .select("*")
      .eq("id", job_id)

    if (jobError || !jobs || jobs.length === 0) {
      console.log("Job lookup failed", { job_id, jobError: jobError?.message, jobs_count: jobs?.length })
      return NextResponse.json({
        error: "Job not found",
        db_error: jobError?.message
      }, { status: 404 })
    }

    const job = jobs[0]

    // Return current status
    if (job.status === "completed" || job.status === "failed") {
      return NextResponse.json({
        status: job.status,
        output_url: job.output_url,
        error_message: job.error_message
      })
    }

    // For processing jobs, check n8n if we have API key
    if (job.status === "processing" && N8N_API_KEY) {
      try {
        const execResp = await fetch(
          `${N8N_API_URL}/executions?workflowId=jNLxeTapxUIvTSva&limit=50`,
          { headers: { "X-N8N-API-KEY": N8N_API_KEY } }
        )

        if (execResp.ok) {
          const execData = await execResp.json()
          const jobCreatedAt = new Date(job.created_at).getTime()

          const relevantExec = execData.data?.find((exec: any) => {
            const startedAt = new Date(exec.startedAt).getTime()
            return startedAt >= jobCreatedAt && startedAt < jobCreatedAt + 600000
          })

          if (relevantExec?.status === "success") {
            // Fetch execution details to get callback data
            const detailResp = await fetch(
              `${N8N_API_URL}/executions/${relevantExec.id}?includeData=true`,
              { headers: { "X-N8N-API-KEY": N8N_API_KEY } }
            )

            if (detailResp.ok) {
              const detailData = await detailResp.json()
              const callbackNode = detailData.data?.resultData?.runData?.["Callback to App"]

              if (callbackNode?.[0]?.data?.json?.video_url) {
                // Update job in database
                const videoUrl = callbackNode[0].data.json.video_url
                await supabase
                  .from("product_transform_jobs")
                  .update({
                    status: "completed",
                    output_url: videoUrl,
                    completed_at: new Date().toISOString(),
                  })
                  .eq("id", job_id)

                return NextResponse.json({
                  status: "completed",
                  output_url: videoUrl,
                })
              }
            }
          }
        }
      } catch {
        // Silently fail n8n check, return current status
      }
    }

    return NextResponse.json({ status: job.status })
  } catch (error) {
    console.error("Status endpoint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const N8N_WEBHOOK_BASE_URL = process.env.N8N_WEBHOOK_BASE_URL

export class N8nError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "N8nError"
    this.statusCode = statusCode
  }
}

export async function callN8nWebhook<T = any>(
  path: string,
  payload: Record<string, any>
): Promise<T> {
  if (!N8N_WEBHOOK_BASE_URL) {
    throw new N8nError("N8N_WEBHOOK_BASE_URL is not configured", 500)
  }

  const url = `${N8N_WEBHOOK_BASE_URL}${path}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error")
      throw new N8nError(
        `n8n webhook failed: ${response.status} - ${errorBody}`,
        response.status
      )
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof N8nError) throw error

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new N8nError("n8n webhook timed out after 30 seconds", 504)
    }

    throw new N8nError(
      `Failed to call n8n webhook: ${error instanceof Error ? error.message : "Unknown error"}`,
      500
    )
  } finally {
    clearTimeout(timeout)
  }
}

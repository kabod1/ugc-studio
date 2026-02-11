import { openai } from "./openai"

export interface QualityAnalysis {
  score: number
  feedback: {
    technical: string
    compliance: string
    brand_safety: string
  }
  recommendations: string[]
}

export async function analyzeContentQuality(
  fileUrl: string,
  contentType: string,
  brief?: string
): Promise<QualityAnalysis> {
  const isVisual = ["image", "video", "reel", "tiktok", "story"].includes(
    contentType
  )

  const systemPrompt = `You are a professional UGC content quality analyst.
Evaluate the submitted content and provide detailed feedback.

Scoring (0-100):
- Technical quality (lighting, audio, framing, resolution)
- Brief compliance (does the content meet the campaign requirements?)
- Brand safety (no inappropriate content, correct messaging)

${brief ? `Campaign Brief: ${brief}` : "No specific brief provided - evaluate general quality."}

Return a JSON object with:
- "score": number 0-100
- "feedback": { "technical": string, "compliance": string, "brand_safety": string }
- "recommendations": array of 2-5 actionable improvement suggestions`

  const messages: any[] = [{ role: "system", content: systemPrompt }]

  if (isVisual) {
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: `Please analyze this ${contentType} content for quality. The file is at: ${fileUrl}`,
        },
        {
          type: "image_url",
          image_url: { url: fileUrl, detail: "high" },
        },
      ],
    })
  } else {
    messages.push({
      role: "user",
      content: `Please analyze this ${contentType} content for quality. The content URL is: ${fileUrl}. Since this is a non-visual content type, focus on the metadata and brief compliance aspects.`,
    })
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1500,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error("No response from OpenAI")
  }

  const result = JSON.parse(content) as QualityAnalysis

  return {
    score: Math.min(100, Math.max(0, Math.round(result.score))),
    feedback: {
      technical: result.feedback?.technical ?? "No technical feedback available",
      compliance:
        result.feedback?.compliance ?? "No compliance feedback available",
      brand_safety:
        result.feedback?.brand_safety ?? "No brand safety feedback available",
    },
    recommendations: result.recommendations ?? [],
  }
}

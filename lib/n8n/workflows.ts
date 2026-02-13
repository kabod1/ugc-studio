import { callN8nWebhook } from "./client"
import type {
  ScrapeParams,
  ScrapeResult,
  MatchParams,
  MatchResult,
  OutreachParams,
  OutreachResult,
  QualityCheckParams,
  QualityCheckResult,
  PaymentTriggerParams,
  PaymentTriggerResult,
  UGCVideoParams,
  UGCVideoResult,
  AnalyticsParams,
  AnalyticsResult,
} from "./types"

export async function scrapeCreators(params: ScrapeParams) {
  return callN8nWebhook<ScrapeResult>("/scrape-creators", params)
}

export async function matchCreators(campaignId: string, brief?: string) {
  const params: MatchParams = { campaign_id: campaignId, brief }
  return callN8nWebhook<MatchResult>("/match-creators", params)
}

export async function sendOutreach(
  campaignId: string,
  creatorIds: string[],
  template: string
) {
  const params: OutreachParams = {
    campaign_id: campaignId,
    creator_ids: creatorIds,
    template,
  }
  return callN8nWebhook<OutreachResult>("/outreach", params)
}

export async function checkContentQuality(
  submissionId: string,
  fileUrl: string,
  brief?: string
) {
  const params: QualityCheckParams = {
    submission_id: submissionId,
    file_url: fileUrl,
    brief,
  }
  return callN8nWebhook<QualityCheckResult>(
    "/quality-check",
    params
  )
}

export async function triggerPayment(event: string, contractId: string) {
  const params: PaymentTriggerParams = { event, contract_id: contractId }
  return callN8nWebhook<PaymentTriggerResult>(
    "/trigger-payment",
    params
  )
}

export async function generateUGCVideo(
  productImageUrl: string,
  jobId: string,
  callbackUrl: string,
  campaignId?: string,
  brandId?: string
) {
  const params: UGCVideoParams = {
    product_image_url: productImageUrl,
    job_id: jobId,
    callback_url: callbackUrl,
    campaign_id: campaignId,
    brand_id: brandId,
  }
  return callN8nWebhook<UGCVideoResult>(
    "/ugc-generate-video",
    params
  )
}

export async function triggerAnalytics(params: AnalyticsParams) {
  return callN8nWebhook<AnalyticsResult>("/analytics", params)
}

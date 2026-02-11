import { stripe } from "./client"

export async function createConnectAccount(
  email: string,
  creatorId: string
) {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    metadata: {
      creator_id: creatorId,
    },
    capabilities: {
      transfers: { requested: true },
    },
  })

  return account
}

export async function createAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: "account_onboarding",
  })

  return accountLink
}

export async function getAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId)

  return {
    id: account.id,
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled,
    details_submitted: account.details_submitted,
    onboarded:
      account.charges_enabled &&
      account.payouts_enabled &&
      account.details_submitted,
  }
}

export async function createTransfer(
  amount: number,
  currency: string,
  destinationAccountId: string,
  metadata?: Record<string, string>
) {
  const transfer = await stripe.transfers.create({
    amount,
    currency: currency.toLowerCase(),
    destination: destinationAccountId,
    metadata: metadata ?? {},
  })

  return transfer
}

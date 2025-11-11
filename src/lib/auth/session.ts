import { env, getCustomerAccountRedirectUri } from '@/lib/env'
import { CustomerSession, clearCustomerSession, getCustomerSession, setCustomerSession } from '@/lib/auth/cookies'
import { postJson } from '@/lib/auth/transport'

type TokenResponse = {
  access_token: string
  expires_in?: number
  refresh_token?: string
  refresh_token_expires_in?: number
}

async function refreshSession(session: CustomerSession | null) {
  if (!session?.refreshToken) {
    clearCustomerSession()
    return null
  }
  try {
    const body = {
      grant_type: 'refresh_token',
      client_id: env.customerAccount.clientId,
      refresh_token: session.refreshToken,
    }
    const data = await postJson<TokenResponse>(env.customerAccount.tokenUrl, body)
    if (!data?.access_token) {
      clearCustomerSession()
      return null
    }
    const now = Date.now()
    const expiresAt = data.expires_in ? now + data.expires_in * 1000 : undefined
    const refreshExpiresAt = data.refresh_token_expires_in ? now + data.refresh_token_expires_in * 1000 : session.refreshExpiresAt
    const nextSession: CustomerSession = {
      token: data.access_token,
      expiresAt,
      refreshToken: data.refresh_token || session.refreshToken,
      refreshExpiresAt,
    }
    setCustomerSession(nextSession, Math.max(60, data.expires_in ?? 3600))
    return nextSession
  } catch {
    clearCustomerSession()
    return null
  }
}

export async function getCustomerAccessToken() {
  if (!env.customerAccountsEnabled) return null
  let session = getCustomerSession()
  if (!session?.token) return null
  const now = Date.now()
  if (session.expiresAt && session.expiresAt - now < 60 * 1000) {
    session = await refreshSession(session)
  }
  return session?.token ?? null
}

export function buildRedirectUri() {
  return getCustomerAccountRedirectUri()
}

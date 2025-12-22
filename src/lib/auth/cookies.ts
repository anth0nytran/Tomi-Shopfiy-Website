import { cookies } from 'next/headers'

type CookieDeleter = { delete: (name: string) => void }

const baseCookie = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
}

const SESSION_COOKIE = 'shopify.customer_session'
const RETURN_TO_COOKIE = 'shopify.return_to'
const VERIFIER_COOKIE = 'shopify.code_verifier'
const STATE_COOKIE = 'shopify.oauth_state'

export type CustomerSession = {
  token: string
  expiresAt?: number
  refreshToken?: string
  refreshExpiresAt?: number
}

function encodeSession(session: CustomerSession) {
  return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url')
}

function decodeSession(value?: string | null): CustomerSession | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
    if (!parsed?.token) return null
    return parsed
  } catch {
    return null
  }
}

export function setCustomerSession(session: CustomerSession, maxAgeSeconds = 60 * 60 * 24 * 7) {
  cookies().set(SESSION_COOKIE, encodeSession(session), { ...baseCookie, maxAge: maxAgeSeconds })
}

export function getCustomerSession(): CustomerSession | null {
  const value = cookies().get(SESSION_COOKIE)?.value
  return decodeSession(value)
}

export function clearCustomerSession() {
  cookies().delete(SESSION_COOKIE)
}

/**
 * Clears all cookies used by the Customer Accounts OAuth flow + stored session.
 *
 * Important: In Route Handlers, prefer passing `res.cookies` so the deletions are
 * guaranteed to be included on the outgoing response.
 */
export function clearCustomerAuthCookies(store: CookieDeleter = cookies()) {
  store.delete(SESSION_COOKIE)
  store.delete(RETURN_TO_COOKIE)
  store.delete(VERIFIER_COOKIE)
  store.delete(STATE_COOKIE)
}

export function setReturnTo(value: string, maxAgeSeconds = 300) {
  cookies().set(RETURN_TO_COOKIE, value, { ...baseCookie, maxAge: maxAgeSeconds })
}

export function consumeReturnTo() {
  const store = cookies()
  const value = store.get(RETURN_TO_COOKIE)?.value
  if (value) store.delete(RETURN_TO_COOKIE)
  return value
}

export function setCodeVerifier(verifier: string, maxAgeSeconds = 300) {
  cookies().set(VERIFIER_COOKIE, verifier, { ...baseCookie, maxAge: maxAgeSeconds })
}

export function consumeCodeVerifier() {
  const store = cookies()
  const value = store.get(VERIFIER_COOKIE)?.value
  if (value) store.delete(VERIFIER_COOKIE)
  return value
}

export function setOAuthState(signature: string, maxAgeSeconds = 300) {
  cookies().set(STATE_COOKIE, signature, { ...baseCookie, maxAge: maxAgeSeconds })
}

export function consumeOAuthState() {
  const store = cookies()
  const value = store.get(STATE_COOKIE)?.value
  if (value) store.delete(STATE_COOKIE)
  return value
}

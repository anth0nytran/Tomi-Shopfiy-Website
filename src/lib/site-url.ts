function stripProtocol(value: string) {
  return value.replace(/^https?:\/\//i, '')
}

function toAbsoluteUrl(value: string) {
  // Accept https://example.com or example.com
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${stripProtocol(trimmed)}`
}

/**
 * Derive a production-safe site origin on Vercel.
 *
 * Precedence:
 * - NEXTAUTH_URL (recommended, includes protocol)
 * - VERCEL_URL (host only)
 * - fallback localhost for dev
 */
export function getPublicSiteOrigin() {
  const nextAuthUrl = process.env.NEXTAUTH_URL
  const vercelUrl = process.env.VERCEL_URL

  const fromNextAuth = typeof nextAuthUrl === 'string' ? toAbsoluteUrl(nextAuthUrl) : null
  if (fromNextAuth) return fromNextAuth

  const fromVercel = typeof vercelUrl === 'string' ? toAbsoluteUrl(vercelUrl) : null
  if (fromVercel) return fromVercel

  return 'http://localhost:3000'
}



import type { NextRequest } from 'next/server'

function normalizeProtocol(protocol: string | null | undefined) {
  if (!protocol) return null
  return protocol.endsWith(':') ? protocol.slice(0, -1) : protocol
}

export function getRequestOrigin(req: NextRequest) {
  const host =
    req.headers.get('x-forwarded-host') ??
    req.headers.get('host') ??
    req.nextUrl.host

  const protocol =
    normalizeProtocol(req.headers.get('x-forwarded-proto')) ??
    normalizeProtocol(req.nextUrl.protocol) ??
    'http'

  return `${protocol}://${host}`
}

export function buildAbsoluteUrl(req: NextRequest, value: string | URL) {
  const origin = getRequestOrigin(req)
  return new URL(value, origin)
}


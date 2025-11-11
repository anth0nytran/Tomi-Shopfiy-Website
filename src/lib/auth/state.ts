import crypto from 'crypto'
import { env } from '@/lib/env'

const secret = env.sessionSecret || 'fallback-secret'

function base64Url(buffer: Buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function generateState() {
  const state = base64Url(crypto.randomBytes(24))
  const signature = signState(state)
  return { state, signature }
}

function signState(value: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64')
}

export function verifyState(value: string | null, signature: string | undefined) {
  if (!value || !signature) return false
  const expected = signState(value)
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

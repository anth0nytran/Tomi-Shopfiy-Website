import { NextRequest, NextResponse } from 'next/server'
import { env, getCustomerAccountRedirectUri } from '@/lib/env'
import { consumeCodeVerifier, consumeOAuthState, consumeReturnTo, setCustomerSession } from '@/lib/auth/cookies'
import { verifyState } from '@/lib/auth/state'
import { postJson } from '@/lib/auth/transport'

type TokenPayload = {
  access_token: string
  expires_in?: number
  refresh_token?: string
  refresh_token_expires_in?: number
}

export async function GET(req: NextRequest) {
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = consumeOAuthState()
  const verifier = consumeCodeVerifier()
  const returnTo = consumeReturnTo() || '/account'

  if (!code || !state || !storedState || !verifier || !verifyState(state, storedState)) {
    return NextResponse.redirect(new URL('/account?error=auth', req.url))
  }

  try {
    const payload = await postJson<TokenPayload>(env.customerAccount.tokenUrl, {
      grant_type: 'authorization_code',
      client_id: env.customerAccount.clientId,
      code,
      code_verifier: verifier,
      redirect_uri: getCustomerAccountRedirectUri(),
    })
    if (!payload?.access_token) throw new Error('Missing token')
    const now = Date.now()
    const session = {
      token: payload.access_token,
      expiresAt: payload.expires_in ? now + payload.expires_in * 1000 : undefined,
      refreshToken: payload.refresh_token,
      refreshExpiresAt: payload.refresh_token_expires_in ? now + payload.refresh_token_expires_in * 1000 : undefined,
    }
    setCustomerSession(session, Math.max(60, payload.expires_in ?? 3600))
    return NextResponse.redirect(new URL(returnTo, req.url))
  } catch {
    return NextResponse.redirect(new URL('/account?error=token', req.url))
  }
}

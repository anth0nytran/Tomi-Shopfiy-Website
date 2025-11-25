import { NextRequest, NextResponse } from 'next/server'
import { env, getCustomerAccountRedirectUri } from '@/lib/env'
import {
  consumeCodeVerifier,
  consumeOAuthState,
  consumeReturnTo,
  setCustomerSession,
} from '@/lib/auth/cookies'
import { verifyState } from '@/lib/auth/state'

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
    const redirectUri = getCustomerAccountRedirectUri()

    // Build x-www-form-urlencoded body as Shopify expects
    const body = new URLSearchParams()
    body.set('grant_type', 'authorization_code')
    body.set('client_id', env.customerAccount.clientId)
    body.set('redirect_uri', redirectUri)
    body.set('code', code)
    body.set('code_verifier', verifier)

    const response = await fetch(env.customerAccount.tokenUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('Shopify token exchange failed:', response.status, text)
      return NextResponse.redirect(new URL('/account?error=token', req.url))
    }

    const payload = (await response.json()) as TokenPayload
    if (!payload?.access_token) {
      console.error('Shopify token response missing access_token:', payload)
      return NextResponse.redirect(new URL('/account?error=token', req.url))
    }

    const now = Date.now()
    const session = {
      token: payload.access_token,
      expiresAt: payload.expires_in ? now + payload.expires_in * 1000 : undefined,
      refreshToken: payload.refresh_token,
      refreshExpiresAt: payload.refresh_token_expires_in
        ? now + payload.refresh_token_expires_in * 1000
        : undefined,
    }

    setCustomerSession(session, Math.max(60, payload.expires_in ?? 3600))

    return NextResponse.redirect(new URL(returnTo, req.url))
  } catch (err) {
    console.error('Customer Account callback error:', err)
    return NextResponse.redirect(new URL('/account?error=token', req.url))
  }
}

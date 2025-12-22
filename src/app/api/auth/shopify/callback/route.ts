import { NextRequest, NextResponse } from 'next/server'
import { env, getCustomerAccountRedirectUri } from '@/lib/env'
import { buildAbsoluteUrl } from '@/lib/http'
import {
  consumeCodeVerifier,
  consumeOAuthState,
  consumeReturnTo,
  setAccountNotice,
  clearAccountNotice,
  setCustomerSession,
} from '@/lib/auth/cookies'
import { verifyState } from '@/lib/auth/state'

type TokenPayload = {
  access_token: string
  customer_access_token?: string
  expires_in?: number
  refresh_token?: string
  customer_refresh_token?: string
  refresh_token_expires_in?: number
}

export async function GET(req: NextRequest) {
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(buildAbsoluteUrl(req, '/'))
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = consumeOAuthState()
  const verifier = consumeCodeVerifier()
  const returnTo = consumeReturnTo() || '/account'

  if (!code || !state || !storedState || !verifier || !verifyState(state, storedState)) {
    setAccountNotice('authError')
    return NextResponse.redirect(buildAbsoluteUrl(req, '/account'))
  }

  try {
    const redirectUri = getCustomerAccountRedirectUri(req)

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
      setAccountNotice('tokenError')
      return NextResponse.redirect(buildAbsoluteUrl(req, '/account'))
    }

    const payload = (await response.json()) as TokenPayload
    const accessToken = payload.customer_access_token ?? payload.access_token
    const refreshToken = payload.customer_refresh_token ?? payload.refresh_token

    if (!accessToken) {
      console.error('Shopify token response missing usable access token', payload)
      setAccountNotice('tokenError')
      return NextResponse.redirect(buildAbsoluteUrl(req, '/account'))
    }

    const now = Date.now()
    const session = {
      token: accessToken,
      expiresAt: payload.expires_in ? now + payload.expires_in * 1000 : undefined,
      refreshToken,
      refreshExpiresAt: payload.refresh_token_expires_in
        ? now + payload.refresh_token_expires_in * 1000
        : undefined,
    }

    setCustomerSession(session, Math.max(60, payload.expires_in ?? 3600))
    clearAccountNotice()

    return NextResponse.redirect(buildAbsoluteUrl(req, returnTo))
  } catch (err) {
    console.error('Customer Account callback error:', err)
    setAccountNotice('tokenError')
    return NextResponse.redirect(buildAbsoluteUrl(req, '/account'))
  }
}

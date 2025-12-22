import { NextRequest, NextResponse } from 'next/server'
import { env, getCustomerAccountRedirectUri } from '@/lib/env'
import { buildAbsoluteUrl } from '@/lib/http'
import { generateCodeVerifier, challengeFromVerifier } from '@/lib/auth/pkce'
import { generateState } from '@/lib/auth/state'
import { setCodeVerifier, setOAuthState, setReturnTo } from '@/lib/auth/cookies'

export async function GET(req: NextRequest) {
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(buildAbsoluteUrl(req, '/'))
  }
  const verifier = generateCodeVerifier()
  const challenge = await challengeFromVerifier(verifier)
  const { state, signature } = generateState()
  const returnTo = req.nextUrl.searchParams.get('returnTo') || '/account'

  setCodeVerifier(verifier)
  setOAuthState(signature)
  setReturnTo(returnTo)

  const redirectUri = getCustomerAccountRedirectUri()
  const authUrl = new URL(env.customerAccount.authUrl)
  const configuredScope =
    env.customerAccount.scopes ?? 'openid email customer-account-api:full'
  const scopeParts = configuredScope.split(/\s+/).filter(Boolean)
  const scope = scopeParts.includes('openid') ? configuredScope : `openid ${configuredScope}`
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', env.customerAccount.clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('code_challenge', challenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('state', state)

  return NextResponse.redirect(authUrl)
}

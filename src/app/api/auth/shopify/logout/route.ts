import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { buildAbsoluteUrl } from '@/lib/http'

function toHttpsOrigin(domainOrUrl: string) {
  const trimmed = domainOrUrl.trim()
  if (!trimmed) return null
  try {
    // full URL already
    return new URL(trimmed).origin
  } catch {
    // assume it's a bare domain like "foo.myshopify.com"
    try {
      return new URL(`https://${trimmed}`).origin
    } catch {
      return null
    }
  }
}

function getShopOrigin() {
  // Prefer explicit store domain if present (most reliable).
  const fromStoreDomain = toHttpsOrigin(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '')
  if (fromStoreDomain) return fromStoreDomain

  // Fall back to the auth URL origin (should be https://{shop}.myshopify.com/account/oauth/authorize).
  try {
    const authUrl = new URL(env.customerAccount.authUrl)
    return authUrl.origin
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  // If customer accounts are disabled, just go home
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(buildAbsoluteUrl(req, '/'))
  }

  // 1) Clear any local cookies we store for customer accounts
  // Do it directly on the redirect response so the browser reliably applies the deletion.
  const origin = new URL(req.url).origin
  const postLogoutUrl = new URL('/api/auth/shopify/post-logout', origin)

  // 2) Bounce through Shopify logout to fully end the customer session there as well
  // Some Shopify/OIDC logout endpoints require an `id_token_hint` and will error ("Invalid id_token").
  // For Customer Accounts (OAuth + PKCE), the correct logout endpoint is `/account/logout`.
  const configured = new URL(env.customerAccount.logoutUrl)
  const shopOrigin = getShopOrigin()
  if (!shopOrigin) {
    // Fail-safe: if config is broken, at least complete local logout.
    return NextResponse.redirect(buildAbsoluteUrl(req, '/account?loggedOut=1'))
  }
  const shouldForceAccountLogout =
    configured.origin !== shopOrigin ||
    configured.pathname !== '/account/logout' ||
    configured.searchParams.has('id_token_hint') ||
    configured.search.includes('id_token') ||
    configured.pathname.includes('end_session') ||
    configured.pathname.includes('endsession')

  const shopifyLogoutUrl = shouldForceAccountLogout
    ? new URL('/account/logout', shopOrigin)
    : configured

  // Shopify Customer Accounts docs use `return_to`. Some storefront logout flows use `return_url`.
  // Setting both makes this resilient across variations.
  shopifyLogoutUrl.searchParams.set('return_to', postLogoutUrl.toString())
  shopifyLogoutUrl.searchParams.set('return_url', postLogoutUrl.toString())

  // 303 converts POST -> GET on redirect targets (avoid resubmitting POST)
  const res = NextResponse.redirect(shopifyLogoutUrl, { status: 303 })

  // Local cookie names (see `src/lib/auth/cookies.ts`)
  res.cookies.delete('shopify.customer_session')
  res.cookies.delete('shopify.return_to')
  res.cookies.delete('shopify.code_verifier')
  res.cookies.delete('shopify.oauth_state')

  return res
}

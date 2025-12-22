import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { clearCustomerAuthCookies, getCustomerSession } from '@/lib/auth/cookies'
import { buildAbsoluteUrl } from '@/lib/http'

function buildShopifyLogoutUrl(req: NextRequest) {
  // IMPORTANT: this must match the "Logout URI" configured in Shopify Admin.
  // After Shopify completes logout it will redirect here, and we then bounce
  // the user back to the signed-out account page.
  const postLogoutRedirect = buildAbsoluteUrl(req, '/api/auth/shopify/post-logout').toString()

  const configured = new URL(env.customerAccount.logoutUrl)
  const session = getCustomerSession()

  const looksLikeOidcEndSession =
    configured.hostname === 'shopify.com' ||
    configured.hostname.endsWith('.shopify.com') ||
    configured.pathname.includes('/authentication/')

  if (looksLikeOidcEndSession) {
    // OIDC end-session: requires id_token_hint, and usually expects post_logout_redirect_uri
    if (session?.idToken) {
      configured.searchParams.set('id_token_hint', session.idToken)
      configured.searchParams.set('post_logout_redirect_uri', postLogoutRedirect)
      configured.searchParams.set('client_id', env.customerAccount.clientId)
      return configured
    }

    // Fallback: if we don't have an ID token (older sessions), try the shop-domain logout.
    // This avoids the hard Shopify error screen and still clears the user in most setups.
    const shopOrigin = new URL(env.customerAccount.tokenUrl).origin
    const fallback = new URL('/account/logout', shopOrigin)
    fallback.searchParams.set('return_to', postLogoutRedirect)
    fallback.searchParams.set('return_url', postLogoutRedirect)
    return fallback
  }

  // Shop-domain logout endpoint
  configured.searchParams.set('return_to', postLogoutRedirect)
  configured.searchParams.set('return_url', postLogoutRedirect)
  return configured
}

export async function POST(req: NextRequest) {
  // If customer accounts are disabled, just go home
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(buildAbsoluteUrl(req, '/').toString())
  }

  // IMPORTANT:
  // - Use a 303 so a POST logout becomes a GET navigation in the browser.
  // - Clear cookies on the *response* to guarantee they are actually removed.
  const res = NextResponse.redirect(buildShopifyLogoutUrl(req).toString(), { status: 303 })
  clearCustomerAuthCookies(res.cookies)
  return res
}

// Allow GET as well (useful if any UI uses a plain link).
export async function GET(req: NextRequest) {
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(buildAbsoluteUrl(req, '/').toString())
  }
  const res = NextResponse.redirect(buildShopifyLogoutUrl(req).toString(), { status: 303 })
  clearCustomerAuthCookies(res.cookies)
  return res
}

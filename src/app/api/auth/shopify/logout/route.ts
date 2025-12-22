import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { clearCustomerAuthCookies } from '@/lib/auth/cookies'
import { buildAbsoluteUrl } from '@/lib/http'

function buildShopifyLogoutUrl(req: NextRequest) {
  const postLogoutRedirect = buildAbsoluteUrl(req, '/account?loggedOut=1').toString()
  const url = new URL(env.customerAccount.logoutUrl)

  // Shopify's Customer Accounts logout URL can be either:
  // - a simple /account/logout endpoint (supports return_url / return_to), OR
  // - an OIDC end-session endpoint (requires id_token_hint).
  //
  // We do NOT have an ID token stored in this app, so avoid OIDC params like
  // post_logout_redirect_uri/client_id which can trigger "Invalid id_token".
  url.searchParams.set('return_to', postLogoutRedirect)
  url.searchParams.set('return_url', postLogoutRedirect)

  return url
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

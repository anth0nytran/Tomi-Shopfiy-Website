import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { clearCustomerAuthCookies } from '@/lib/auth/cookies'
import { buildAbsoluteUrl } from '@/lib/http'

function buildShopifyLogoutUrl(req: NextRequest) {
  const postLogoutRedirect = buildAbsoluteUrl(req, '/account?loggedOut=1').toString()
  const url = new URL(env.customerAccount.logoutUrl)

  // Shopify endpoints vary in which redirect param they accept; set the common ones.
  url.searchParams.set('return_to', postLogoutRedirect)
  url.searchParams.set('return_url', postLogoutRedirect)
  url.searchParams.set('post_logout_redirect_uri', postLogoutRedirect)
  url.searchParams.set('client_id', env.customerAccount.clientId)

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

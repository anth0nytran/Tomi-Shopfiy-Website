import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { clearCustomerAuthCookies } from '@/lib/auth/cookies'
import { buildAbsoluteUrl } from '@/lib/http'

export async function GET(req: NextRequest) {
  // If customer accounts are disabled, just go home
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(buildAbsoluteUrl(req, '/').toString())
  }

  // Shopify redirects here after it clears its own session. We clear local cookies
  // again (defense-in-depth) and send the customer to the signed-out account screen.
  const res = NextResponse.redirect(buildAbsoluteUrl(req, '/account?loggedOut=1').toString(), {
    status: 303,
  })
  clearCustomerAuthCookies(res.cookies)
  return res
}

export async function POST(req: NextRequest) {
  return GET(req)
}

import { NextRequest, NextResponse } from 'next/server'
import { buildAbsoluteUrl } from '@/lib/http'

export async function GET(req: NextRequest) {
  return NextResponse.redirect(buildAbsoluteUrl(req, '/'))
}

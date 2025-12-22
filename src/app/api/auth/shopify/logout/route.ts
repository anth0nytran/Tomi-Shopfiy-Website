import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { buildAbsoluteUrl } from '@/lib/http'

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
  const shopifyLogoutUrl = new URL(env.customerAccount.logoutUrl)
  shopifyLogoutUrl.searchParams.set('return_to', postLogoutUrl.toString())

  // 303 converts POST -> GET on redirect targets (avoid resubmitting POST)
  const res = NextResponse.redirect(shopifyLogoutUrl, { status: 303 })

  // Local cookie names (see `src/lib/auth/cookies.ts`)
  res.cookies.delete('shopify.customer_session')
  res.cookies.delete('shopify.return_to')
  res.cookies.delete('shopify.code_verifier')
  res.cookies.delete('shopify.oauth_state')

  return res
}

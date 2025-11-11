import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { clearCustomerSession } from '@/lib/auth/cookies'

export async function POST(req: NextRequest) {
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  clearCustomerSession()
  const origin = new URL(req.url).origin
  const logoutUrl = new URL(env.customerAccount.logoutUrl)
  logoutUrl.searchParams.set('return_to', `${origin}/api/auth/shopify/post-logout`)
  return NextResponse.redirect(logoutUrl)
}

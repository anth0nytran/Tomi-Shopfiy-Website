import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { clearCustomerSession } from '@/lib/auth/cookies'
import { buildAbsoluteUrl } from '@/lib/http'

export async function POST(req: NextRequest) {
  // If customer accounts are disabled, just go home
  if (!env.customerAccountsEnabled) {
    return NextResponse.redirect(buildAbsoluteUrl(req, '/'))
  }

  // 1) Clear the customer account session we store in cookies
  clearCustomerSession()

  // 2) Send them back to the account page (or home, if you prefer)
  //    Add a small flag so we could show a "You’ve been signed out" message if we want.
  const redirectUrl = buildAbsoluteUrl(req, '/account?loggedOut=1')

  return NextResponse.redirect(redirectUrl)
}

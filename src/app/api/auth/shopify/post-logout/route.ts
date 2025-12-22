import { NextRequest, NextResponse } from 'next/server'
import { buildAbsoluteUrl } from '@/lib/http'

export async function GET(req: NextRequest) {
  const returnTo = req.nextUrl.searchParams.get('returnTo') || '/account?loggedOut=1'
  return NextResponse.redirect(buildAbsoluteUrl(req, returnTo))
}

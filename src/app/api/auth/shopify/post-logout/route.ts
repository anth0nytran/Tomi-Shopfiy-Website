import { NextRequest, NextResponse } from 'next/server'
import { buildAbsoluteUrl } from '@/lib/http'

export async function GET(req: NextRequest) {
  // Always land back on a clean account URL (no query params).
  return NextResponse.redirect(buildAbsoluteUrl(req, '/account'))
}

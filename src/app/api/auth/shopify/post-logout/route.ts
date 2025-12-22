import { NextRequest, NextResponse } from 'next/server'
import { buildAbsoluteUrl } from '@/lib/http'

export async function GET(req: NextRequest) {
  return NextResponse.redirect(buildAbsoluteUrl(req, '/'))
}

import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/shopify'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = (searchParams.get('q') || '').trim()
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.min(20, Math.max(1, parseInt(limitParam, 10) || 8)) : 8

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchProducts(query, limit)
  return NextResponse.json({ results })
}

import { fetchProductByHandle } from '@/lib/shopify'

/**
 * GET /api/jade-bar/variants
 *
 * Resolves Shopify product handles → variant GIDs for the Jade Bar Builder.
 * Returns a map of `{ [handle]: { [variantTitle]: variantGid } }`.
 *
 * Query param `handles` is a comma-separated list of product handles.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const raw = url.searchParams.get('handles') ?? ''
  const handles = Array.from(new Set(raw.split(',').map((h) => h.trim()).filter(Boolean)))

  if (!handles.length) {
    return Response.json({ error: 'No handles provided' }, { status: 400 })
  }

  const result: Record<string, Record<string, string>> = {}

  // Fetch all products in parallel
  const products = await Promise.all(handles.map((h) => fetchProductByHandle(h)))

  for (let i = 0; i < handles.length; i++) {
    const handle = handles[i]
    const product = products[i]
    if (!product) continue

    const variants: Record<string, string> = {}
    for (const v of product.variants?.nodes ?? []) {
      // Use variant title as the key (e.g. "Green", "Lavender")
      // For single-variant products, title is usually "Default Title"
      variants[v.title] = v.id
    }
    result[handle] = variants
  }

  return Response.json(result, {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
  })
}

import React from 'react'
import Image from 'next/image'
import { fetchProducts } from '@/lib/shopify'

type Price = { amount: string; currencyCode: string }
type Variant = { id: string; price: Price }
type ProductNode = {
  id: string
  title: string
  description?: string
  handle: string
  productType?: string | null
  tags?: string[]
  collections?: { edges: Array<{ node: { id: string; title: string; handle: string } }> }
  images?: { edges: Array<{ node: { url: string; altText?: string | null } }> }
  variants?: { edges: Array<{ node: Variant }> }
}

function formatPrice(price?: Price | null) {
  if (!price) return ''
  const amount = parseFloat(price.amount)
  if (Number.isNaN(amount)) return ''
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: price.currencyCode }).format(amount)
}

function Summary({ products }: { products: ProductNode[] }) {
  const typeCounts = new Map<string, number>()
  const tagCounts = new Map<string, number>()
  const collectionCounts = new Map<string, number>()

  for (const p of products) {
    const pt = (p.productType || '').trim()
    if (pt) typeCounts.set(pt, (typeCounts.get(pt) || 0) + 1)
    for (const t of p.tags || []) tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
    for (const c of p.collections?.edges || []) {
      const key = `${c.node.handle} — ${c.node.title}`
      collectionCounts.set(key, (collectionCounts.get(key) || 0) + 1)
    }
  }

  const toArray = (m: Map<string, number>) => Array.from(m.entries()).sort((a, b) => b[1] - a[1])

  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Summary</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Product Types</h3>
          <ul>
            {toArray(typeCounts).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Collections</h3>
          <ul>
            {toArray(collectionCounts).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Top Tags</h3>
          <ul>
            {toArray(tagCounts).slice(0, 30).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default async function DebugProductsPage() {
  // Fetch a reasonable number to inspect; adjust as needed
  const products = (await fetchProducts(100)) as ProductNode[]

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Shopify Products Explorer</h1>
      <p style={{ marginBottom: 12 }}>
        This view lists products from your live Shopify store using your .env. Use it to decide how to map categories.
      </p>

      <Summary products={products} />

      <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: 10 }}>Image</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Title</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Handle</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Product Type</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Tags</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Collections</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const imageUrl = p.images?.edges?.[0]?.node?.url
              const price = p.variants?.edges?.[0]?.node?.price
              const tags = (p.tags || []).join(', ')
              const collections = (p.collections?.edges || []).map((e) => e.node.handle).join(', ')
              return (
                <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 10 }}>
                    {imageUrl ? (
                      <Image src={imageUrl} alt="" width={64} height={64} style={{ objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 64, height: 64, background: '#f2f2f2', borderRadius: 8 }} />
                    )}
                  </td>
                  <td style={{ padding: 10 }}>{p.title}</td>
                  <td style={{ padding: 10, color: '#555' }}>{p.handle}</td>
                  <td style={{ padding: 10 }}>{p.productType || ''}</td>
                  <td style={{ padding: 10, maxWidth: 360, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{tags}</td>
                  <td style={{ padding: 10 }}>{collections}</td>
                  <td style={{ padding: 10 }}>{formatPrice(price)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <details style={{ marginTop: 16 }}>
        <summary>Show raw JSON</summary>
        <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(products, null, 2)}</pre>
      </details>
    </main>
  )
}



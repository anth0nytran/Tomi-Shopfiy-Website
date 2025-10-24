import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProductByHandle } from '@/lib/shopify'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

async function addToCart(formData: FormData) {
  'use server'
  const merchandiseId = String(formData.get('merchandiseId') || '')
  const qtyRaw = String(formData.get('quantity') || '1')
  const quantity = Math.max(1, parseInt(qtyRaw, 10) || 1)
  if (!merchandiseId) return
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/cart/lines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines: [{ merchandiseId, quantity }] }),
    cache: 'no-store',
  })
  if (!res.ok) return
  const cart = await res.json()
  if (cart?.checkoutUrl) {
    // Redirect user to Shopify checkout now
    // Server actions cannot redirect to external URLs directly; return the URL and let client handle if needed.
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await fetchProductByHandle(params.handle)
  if (!product) {
    return (
      <main className="shop-main">
        <AnnouncementBar />
        <Header />
        <section className="product-hero">
          <div className="product-hero-inner">
            <p>Product not found.</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const primaryImage = product.images?.edges?.[0]?.node
  const firstVariant = product.variants?.edges?.[0]?.node
  const price = firstVariant?.price

  return (
    <main className="product-main">
      <AnnouncementBar />
      <Header />
      <div className="product-topbar">
        <Link className="back-link" href="/shop">← Back to shop</Link>
      </div>
      <section className="product-layout" aria-label={`${product.title} details`}>
        <div className="product-gallery">
          <div className="product-gallery-main">
            {primaryImage?.url ? (
              <Image src={primaryImage.url} alt={primaryImage.altText || ''} className="product-gallery-img" width={1200} height={1200} />
            ) : (
              <div className="product-gallery-img" style={{ background: '#f3e9e9', height: 560 }} />
            )}
          </div>
          <div className="product-thumbs">
            {product.images?.edges?.slice(0, 3).map((e: any, i: number) => (
              <Image key={i} src={e.node.url} alt={e.node.altText || ''} width={120} height={120} />
            ))}
          </div>
        </div>
        <div className="product-panel">
          <nav className="product-breadcrumbs" aria-label="breadcrumbs">
            <a href="#">Products</a> / <a href="#">All</a>
          </nav>
          <h1 className="product-title-lg">{product.title}</h1>
          <div className="product-price-lg">
            {price ? new Intl.NumberFormat(undefined, { style: 'currency', currency: price.currencyCode }).format(parseFloat(price.amount)) : null}
          </div>
          <div className="product-stock"><span className="dot" />{firstVariant?.availableForSale ? 'In stock' : 'Out of stock'}</div>
          <AddToCartButton merchandiseId={firstVariant?.id || ''} available={!!firstVariant?.availableForSale} />
          <div className="product-tabs">
            <details open>
              <summary>Details & Specs</summary>
              <p>{product.description}</p>
            </details>
          </div>
          <div className="product-benefits" aria-label="policies">
            <div className="benefit"><span className="benefit-ico">●</span> 14k solid gold—Always</div>
            <div className="benefit"><span className="benefit-ico">●</span> Free shipping on all orders</div>
            <div className="benefit"><span className="benefit-ico">●</span> 6‑month warranty</div>
            <div className="benefit"><span className="benefit-ico">●</span> Easy US returns & exchanges</div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}



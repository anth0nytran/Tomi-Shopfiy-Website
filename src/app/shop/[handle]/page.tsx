import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProductByHandle } from '@/lib/shopify'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { CATALOG_BY_SLUG } from '../catalog'

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
  const collections = product.collections?.edges?.map((edge: any) => edge.node) ?? []
  const primaryCollection = collections[0]
  const collectionEntry = primaryCollection?.handle && CATALOG_BY_SLUG[primaryCollection.handle as keyof typeof CATALOG_BY_SLUG]
  const descriptionHtml = product.descriptionHtml || product.description || ''
  const priceLabel = price ? new Intl.NumberFormat(undefined, { style: 'currency', currency: price.currencyCode }).format(parseFloat(price.amount)) : null
  const stockLabel = firstVariant?.availableForSale ? 'In stock' : 'Out of stock'
  const metaEntries = [
    product.productType ? { label: 'Category', value: product.productType } : null,
    collections.length ? { label: 'Collections', value: collections.map((collection: any) => collection.title).join(', ') } : null,
    product.vendor ? { label: 'Maker', value: product.vendor } : null,
    firstVariant?.sku ? { label: 'SKU', value: firstVariant.sku } : null,
    product.tags?.length ? { label: 'Tags', value: product.tags.join(', ') } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <main className="product-main" data-skip-header-offset="true">
      <AnnouncementBar />
      <Header />
      <div className="product-topbar">
        <Link className="back-link" href="/shop">Back to shop</Link>
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
            <Link href="/shop">Shop</Link>
            {primaryCollection ? (
              <>
                <span>/</span>
                <Link href={collectionEntry ? `/shop/category/${collectionEntry.slug}` : '/shop'}>{primaryCollection.title}</Link>
              </>
            ) : null}
          </nav>
          <h1 className="product-title-lg">{product.title}</h1>
          <div className="product-summary">
            <div className="product-summary-top">
              <div>
                <p className="product-price-label">Price</p>
                <p className="product-price-lg">{priceLabel}</p>
              </div>
              <div className={`product-stock ${firstVariant?.availableForSale ? 'product-stock--in' : 'product-stock--out'}`}>
                <span className="dot" />
                {stockLabel}
              </div>
            </div>
            <AddToCartButton merchandiseId={firstVariant?.id || ''} available={!!firstVariant?.availableForSale} />
          </div>
          <div className="product-info-grid">
            <section className="product-info-card product-info-card--details">
              <h2 className="product-info-title">Details &amp; Specs</h2>
              <div className="product-spec-richtext" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            </section>
            <section className="product-info-card product-info-card--notes" aria-label="Product metadata">
              <h2 className="product-info-title">Product Notes</h2>
              {metaEntries.length ? (
                <dl className="product-meta-grid">
                  {metaEntries.map((entry) => (
                    <div className="product-meta-item" key={entry.label}>
                      <dt>{entry.label}</dt>
                      <dd>{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="product-meta-empty">More details coming soon.</p>
              )}
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

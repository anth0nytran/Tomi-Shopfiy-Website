import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProducts } from '@/lib/shopify'

// data now imported from ./mock

function ShopHero({ heroClass = 'shop-hero--all' }: { heroClass?: string }) {
  return (
    <section className={`shop-hero ${heroClass}`} aria-label="Shop hero">
      <div className="shop-hero-media" />
    </section>
  )
}

function FiltersRow() {
  return (
    <div className="filter-row filters-toolbar">
      <div className="filter-chip" aria-pressed="false">New</div>
      <div className="filter-chip" aria-pressed="false">Featured</div>
      <div className="filter-chip" aria-pressed="false">Under $200</div>
      <div className="filter-chip" aria-pressed="false">Gold</div>
      <div className="filter-chip" aria-pressed="false">Silver</div>
      <div className="filter-spacer" />
      <label className="sort" htmlFor="sort-select">
        <span className="sort-label">Sort</span>
        <select id="sort-select" className="sort-select" defaultValue="featured">
          <option value="featured">Featured</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
          <option value="new">Newest</option>
        </select>
      </label>
    </div>
  )
}

function ShopTabs({ active = 'all' }: { active?: string }) {
  return (
    <nav className="shop-tabs" aria-label="Shop categories">
      <Link className={`shop-tab ${active === 'all' ? 'shop-tab--active' : ''}`} href="/shop">All</Link>
      <Link className={`shop-tab ${active === 'rings' ? 'shop-tab--active' : ''}`} href="/shop/category/rings">Rings</Link>
      <Link className={`shop-tab ${active === 'necklaces' ? 'shop-tab--active' : ''}`} href="/shop/category/necklaces">Necklaces</Link>
      <Link className={`shop-tab ${active === 'bracelets' ? 'shop-tab--active' : ''}`} href="/shop/category/bracelets">Bracelets</Link>
      <Link className={`shop-tab ${active === 'earrings' ? 'shop-tab--active' : ''}`} href="/shop/category/earrings">Earrings</Link>
    </nav>
  )
}

function ShopToolbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="shop-toolbar" aria-label="Shop toolbar">
      <div className="toolbar-head">
        <h1 className="shop-title">{title}</h1>
        {subtitle ? <p className="shop-sub">{subtitle}</p> : null}
      </div>
      <div className="toolbar-actions">
        <FiltersRow />
      </div>
    </section>
  )
}

type ShopifyListProduct = {
  id: string
  title: string
  handle: string
  images?: { edges: Array<{ node: { url: string; altText?: string | null } }> }
  variants?: { edges: Array<{ node: { id: string; price: { amount: string; currencyCode: string } } }> }
}

function ProductCard({ product }: { product: ShopifyListProduct }) {
  return (
    <Link href={`/shop/${product.handle}`} className={`product-card`}> 
      <div className="product-media">
        {product.images?.edges?.[0]?.node?.url ? (
          <Image src={product.images.edges[0].node.url} alt={product.images.edges[0].node.altText || ''} className="product-img" width={800} height={800} />
        ) : (
          <div className="product-img" style={{ background: '#f3e9e9', height: 300 }} />
        )}
      </div>
      <div className="product-info">
        <div className="product-title">{product.title}</div>
        <div className="product-price">
          {(() => {
            const v = product.variants?.edges?.[0]?.node
            if (!v) return null
            const amount = parseFloat(v.price.amount)
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: v.price.currencyCode }).format(amount)
          })()}
        </div>
      </div>
    </Link>
  )
}

export default async function ShopPage() {
  const products = await fetchProducts(24)
  return (
    <main className="shop-main">
      <AnnouncementBar />
      <Header />
      <ShopHero heroClass="shop-hero--all" />
      <ShopTabs />
      <ShopToolbar title="Rings" subtitle="A band that doesn’t cost a band." />
      <section className="shop-grid" aria-label="Product grid">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
      <Footer />
    </main>
  )
}



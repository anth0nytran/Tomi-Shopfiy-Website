import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { MOCK_PRODUCTS, Product } from './mock'

// data now imported from ./mock

function ShopHero() {
  return (
    <section className="shop-hero" aria-label="Shop hero">
      <div className="shop-hero-media" />
      <div className="shop-hero-content">
        <h1 className="shop-title">Rings</h1>
        <p className="shop-sub">A band that doesn’t cost a band.</p>
      </div>
    </section>
  )
}

function Filters() {
  return (
    <div className="shop-filters" role="region" aria-label="Filters">
      <div className="filter-row">
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
      <div className="filter-search">
        <input type="text" placeholder="Search products" className="filter-input" />
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} className={`product-card${product.featured ? ' is-featured' : ''}`}> 
      <div className="product-media">
        {/* Placeholder image paths; replace with next/image + Shopify images later */}
        <img src={product.image} alt="" className="product-img" />
      </div>
      <div className="product-info">
        <div className="product-title">{product.title}</div>
        <div className="product-price">{product.price}</div>
      </div>
    </Link>
  )
}

export default function ShopPage() {
  return (
    <main className="shop-main">
      <AnnouncementBar />
      <Header />
      <ShopHero />
      <Filters />
      <section className="shop-grid" aria-label="Product grid">
        {MOCK_PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
      <Footer />
    </main>
  )
}



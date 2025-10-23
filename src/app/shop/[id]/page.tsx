import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MOCK_PRODUCTS } from '../mock'

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS.find(p => p.id === params.id)
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

  return (
    <main className="product-main">
      <AnnouncementBar />
      <Header />
      <div className="product-topbar">
        <a className="back-link" href="/shop">← Back to shop</a>
      </div>
      <section className="product-layout" aria-label={`${product.title} details`}>
        <div className="product-gallery">
          <div className="product-gallery-main">
            <img src={product.image} alt="" className="product-gallery-img" />
          </div>
          <div className="product-thumbs">
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
          </div>
        </div>
        <div className="product-panel">
          <nav className="product-breadcrumbs" aria-label="breadcrumbs">
            <a href="#">Products</a> / <a href="#">{product.category[0].toUpperCase() + product.category.slice(1)}</a>
          </nav>
          <h1 className="product-title-lg">{product.title}</h1>
          <div className="product-price-lg">{product.price}</div>
          <div className="product-finance">From $223.84/mo or 0% APR with <span className="finance-badge">Shop&nbsp;Pay</span> — <a href="#">Check your purchasing power</a></div>
          <div className="option-group">
            <div className="option-group-label">Diamond Type</div>
            <div className="option-row">
              <button className="option active" type="button">Lab Created</button>
              <button className="option" type="button">Natural</button>
            </div>
          </div>
          <div className="product-stock"><span className="dot" />In stock - Ready to ship</div>
          <button className="product-add">Add to cart</button>
          <div className="product-tabs">
            <details open>
              <summary>Details & Specs</summary>
              <ul>
                <li>14k solid gold — always</li>
                <li>Adjustable length and comfortable fit</li>
                <li>Hypoallergenic; safe for daily wear</li>
              </ul>
            </details>
            <details>
              <summary>Description</summary>
              <p>Elegant, minimal, and designed to last. This is placeholder copy for Shopify content later.</p>
            </details>
            <details>
              <summary>Craft & Care</summary>
              <p>Wipe with a soft cloth. Avoid harsh chemicals. Store in a jewelry pouch.</p>
            </details>
            <details>
              <summary>Warranty & Shipping</summary>
              <p>6‑month warranty. Easy US returns and exchanges.</p>
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



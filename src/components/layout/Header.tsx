import React from 'react'
import { AccountLink } from './AccountLink'

export function Header() {
  return (
    <>
      <header className="header" data-section-type="header">
        <nav className="nav">
          <div className="nav-left">
            <div className="nav-item nav-item--dropdown">
              <a href="/shop" className="nav-link nav-link--dropdown" aria-haspopup="true" aria-expanded="false">SHOP</a>
              <div className="nav-dropdown" role="menu" aria-label="Shop menu">
                <div className="nav-dropdown-inner">
                  <div className="nav-dd-group">
                    <h4 className="nav-dd-title">Featured</h4>
                    <a href="/shop/category/new-arrivals" className="nav-dd-link" role="menuitem">New Arrivals</a>
                    <a href="/shop/category/best-sellers" className="nav-dd-link" role="menuitem">Best Sellers</a>
                  </div>
                  <div className="nav-dd-group">
                    <h4 className="nav-dd-title">Categories</h4>
                    <a href="/shop/category/all" className="nav-dd-link" role="menuitem">Shop All</a>
                    <a href="/shop/category/necklaces" className="nav-dd-link" role="menuitem">Necklaces</a>
                    <a href="/shop/category/bracelets" className="nav-dd-link" role="menuitem">Bracelets</a>
                    <a href="/shop" className="nav-dd-link" role="menuitem">Rings</a>
                    <a href="/shop/category/earrings" className="nav-dd-link" role="menuitem">Earrings</a>
                  </div>
                  <div className="nav-dd-group">
                    <h4 className="nav-dd-title">Collections</h4>
                    <a href="/shop/category/flutter" className="nav-dd-link" role="menuitem">Flutter</a>
                    <a href="/shop/category/refined" className="nav-dd-link" role="menuitem">Refined</a>
                  </div>
                  <div className="nav-dd-group">
                    <h4 className="nav-dd-title">Designed by you</h4>
                    <a href="/shop/category/jade-jewelry" className="nav-dd-link" role="menuitem">Jade Jewelry</a>
                  </div>
                </div>
              </div>
            </div>
            <a href="/about" className="nav-link">ABOUT US</a>
            <a href="/visit" className="nav-link">VISIT US</a>
            <a href="/jade-bar" className="nav-link">JADE BAR</a>
          </div>

          <div className="nav-center">
            <a href="/" className="logo-link" aria-label="Tomi home">
              <span className="logo-text">tomi</span>
            </a>
          </div>

          <div className="nav-right">
            <AccountLink />
            <button className="nav-icon" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="nav-icon js-cart-open" aria-label="Shopping Bag" data-cart-trigger type="button" title="Open cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </nav>
      </header>
      <aside className="cart-drawer" aria-hidden="true" role="dialog" aria-label="Shopping cart">
        <div className="cart-drawer-backdrop" data-cart-close></div>
        <div className="cart-drawer-panel" data-cart-panel>
          <header className="cart-drawer-header">
            <h3 className="cart-title">Your bag</h3>
            <button className="cart-close" aria-label="Close cart" data-cart-close>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </header>
          <div className="cart-body" id="cart-body">
            <p className="cart-empty">Your bag is empty.</p>
          </div>
          <footer className="cart-footer" id="cart-footer">
            <div className="cart-summary"><span>Subtotal</span><span>$0.00</span></div>
            <a className="cart-cta" href="#" aria-disabled="true">Checkout</a>
          </footer>
        </div>
      </aside>
    </>
  )
}

"use client"

import React, { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CATALOG_ENTRIES,
  CatalogEntry,
  CatalogSlug,
  ShopifyListProduct,
} from './catalog'

const TAB_ENTRIES = CATALOG_ENTRIES.filter((entry) => entry.tab)

export function ShopHero({ entry }: { entry: CatalogEntry }) {
  return (
    <section className={`shop-hero ${entry.heroClass}`} aria-label={`${entry.title} hero`}>
      <div className="shop-hero-media" />
    </section>
  )
}

export function ShopTabs({ active, onTabSelect }: { active: CatalogSlug; onTabSelect?: (slug: CatalogSlug, href: string) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)

  const updateIndicator = useCallback(() => {
    const track = trackRef.current
    const indicator = indicatorRef.current
    if (!track || !indicator) return
    const activeEl = track.querySelector<HTMLElement>('[data-active="true"]')
    if (!activeEl) return
    const { offsetLeft, offsetWidth } = activeEl
    indicator.style.width = `${offsetWidth}px`
    indicator.style.transform = `translate3d(${offsetLeft}px, -50%, 0)`
    indicator.classList.add('is-visible')
  }, [])

  useEffect(() => {
    updateIndicator()
    const handleResize = () => updateIndicator()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
    return undefined
  }, [active, updateIndicator])

  return (
    <nav className="shop-nav" aria-label="Shop categories">
      <div className="shop-nav-track" ref={trackRef}>
        {TAB_ENTRIES.map((entry) => {
          const isAll = entry.slug === 'all'
          const href = isAll ? '/shop' : `/shop/category/${entry.slug}`
          const isActive = active === entry.slug
          const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (onTabSelect) {
              event.preventDefault()
              onTabSelect(entry.slug, href)
            }
          }
          return (
            <Link
              key={entry.slug}
              className={`shop-nav-pill${isActive ? ' is-active' : ''}`}
              href={href}
              scroll={false}
              onClick={handleClick}
              data-active={isActive ? 'true' : 'false'}
            >
              <span>{entry.navLabel || entry.title}</span>
            </Link>
          )
        })}
        <span ref={indicatorRef} className="shop-nav-indicator" aria-hidden="true" />
      </div>
    </nav>
  )
}

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]

export function ShopToolbar({
  entry,
  count,
  isUpdating,
  sort,
  onSortChange,
}: {
  entry: CatalogEntry
  count: number
  isUpdating?: boolean
  sort: string
  onSortChange?: (value: string) => void
}) {
  const formattedCount = new Intl.NumberFormat().format(count)
  const label = `Total ${count === 1 ? 'item' : 'items'}: ${formattedCount}`
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange?.(event.target.value)
  }
  return (
    <section className="shop-toolbar" aria-label="Shop toolbar">
      <div className="toolbar-head">
        <h1 className="shop-title">{entry.title}</h1>
        {entry.subtitle ? <p className="shop-sub">{entry.subtitle}</p> : null}
      </div>
      <div className="toolbar-actions">
        <div className={`inventory-count${isUpdating ? ' inventory-count--updating' : ''}`} aria-live="polite">
          {isUpdating ? 'Updating…' : label}
        </div>
        <div className="sort" role="group" aria-label="Sort products">
          <span className="sort-label">Sort</span>
          <select id="shop-sort" className="sort-select" value={sort} onChange={handleSortChange}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}

export function ProductCard({ product, index }: { product: ShopifyListProduct; index: number }) {
  const primaryImage = product.images?.edges?.[0]?.node
  const primaryVariant = product.variants?.edges?.[0]?.node
  const priceAmount = primaryVariant?.price?.amount
  const priceCurrency = primaryVariant?.price?.currencyCode
  const formattedPrice = priceAmount
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: priceCurrency }).format(parseFloat(priceAmount))
    : null
  const delayIndex = index % 12

  return (
    <Link
      href={`/shop/${product.handle}`}
      className="product-card product-card--animated"
      style={{ animationDelay: `${delayIndex * 45}ms` }}
    >
      <div className="product-media">
        {primaryImage?.url ? (
          <Image src={primaryImage.url} alt={primaryImage.altText || ''} className="product-img" width={800} height={800} />
        ) : (
          <div className="product-img" style={{ background: '#f3e9e9', height: 300 }} />
        )}
      </div>
      <div className="product-info">
        <div className="product-title">{product.title}</div>
        <div className="product-price">{formattedPrice}</div>
      </div>
    </Link>
  )
}

export function LoadMoreButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" className="load-more" onClick={onClick} disabled={disabled}>
      Show more
    </button>
  )
}


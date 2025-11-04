"use client"

import React from 'react'
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
      <div className="shop-hero-content">
        <h1 className="shop-title">{entry.title}</h1>
        {entry.subtitle ? <p className="shop-sub">{entry.subtitle}</p> : null}
      </div>
    </section>
  )
}

export function ShopTabs({ active, onTabSelect }: { active: CatalogSlug; onTabSelect?: (slug: CatalogSlug, href: string) => void }) {
  return (
    <nav className="shop-tabs" aria-label="Shop categories">
      {TAB_ENTRIES.map((entry) => {
        const isAll = entry.slug === 'all'
        const href = isAll ? '/shop' : `/shop/category/${entry.slug}`
        const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
          if (onTabSelect) {
            event.preventDefault()
            onTabSelect(entry.slug, href)
          }
        }
        return (
          <Link
            key={entry.slug}
            className={`shop-tab ${active === entry.slug ? 'shop-tab--active' : ''}`}
            href={href}
            scroll={false}
            onClick={handleClick}
          >
            {entry.navLabel || entry.title}
          </Link>
        )
      })}
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
      <span aria-hidden="true" className="load-more-arrow">↘</span>
    </button>
  )
}



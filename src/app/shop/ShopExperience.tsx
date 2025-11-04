"use client"

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  CATALOG_BY_SLUG,
  CatalogEntry,
  CatalogSlug,
  ShopifyListProduct,
  filterProductsByCatalogEntry,
} from './catalog'
import { ShopHero, ShopTabs, ShopToolbar, ProductCard, LoadMoreButton } from './components'

const INITIAL_VISIBLE = 12

const FALLBACK_ENTRY = CATALOG_BY_SLUG.all

function getSlugFromPath(path: string): CatalogSlug {
  const trimmed = path.replace(/\/$/, '')
  if (trimmed === '' || trimmed === '/shop') return 'all'
  const segments = trimmed.split('/')
  const last = segments[segments.length - 1] as CatalogSlug | undefined
  if (last && CATALOG_BY_SLUG[last]) return last
  return 'all'
}

type ShopExperienceProps = {
  initialSlug: CatalogSlug
  products: ShopifyListProduct[]
}

export function ShopExperience({ initialSlug, products }: ShopExperienceProps) {
  const [activeSlug, setActiveSlug] = useState<CatalogSlug>(initialSlug)
  const [visibleCount, setVisibleCount] = useState(() => Math.min(INITIAL_VISIBLE, products.length))
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [sort, setSort] = useState('featured')

  useEffect(() => {
    setActiveSlug(initialSlug)
  }, [initialSlug])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handlePop = () => {
      const nextSlug = getSlugFromPath(window.location.pathname)
      setActiveSlug(nextSlug)
      setVisibleCount(INITIAL_VISIBLE)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_VISIBLE, products.length))
  }, [products])

  const entry: CatalogEntry = useMemo(() => CATALOG_BY_SLUG[activeSlug] ?? FALLBACK_ENTRY, [activeSlug])

  const filteredProducts = useMemo(() => filterProductsByCatalogEntry(products, entry), [products, entry])

  const sortedProducts = useMemo(() => {
    const list = filteredProducts.slice()
    const getPrice = (product: ShopifyListProduct) => {
      const amount = product.variants?.edges?.[0]?.node?.price?.amount
      return amount ? parseFloat(amount) : null
    }
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => {
          const priceA = getPrice(a)
          const priceB = getPrice(b)
          if (priceA == null) return 1
          if (priceB == null) return -1
          return priceA - priceB
        })
      case 'price-desc':
        return list.sort((a, b) => {
          const priceA = getPrice(a)
          const priceB = getPrice(b)
          if (priceA == null) return 1
          if (priceB == null) return -1
          return priceB - priceA
        })
      case 'newest':
        return list.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
      default:
        return list
    }
  }, [filteredProducts, sort])

  const visibleProducts = useMemo(() => sortedProducts.slice(0, visibleCount), [sortedProducts, visibleCount])
  const hasMore = visibleCount < sortedProducts.length

  useEffect(() => {
    if (!isPending) {
      const timeout = window.setTimeout(() => setIsAnimating(false), 180)
      return () => window.clearTimeout(timeout)
    }
    return undefined
  }, [isPending])

  const handleTabSelect = useCallback(
    (slug: CatalogSlug, href: string) => {
      if (slug === activeSlug) return
      setIsAnimating(true)
      startTransition(() => {
        setActiveSlug(slug)
        setVisibleCount(INITIAL_VISIBLE)
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', href)
        }
      })
    },
    [activeSlug, startTransition],
  )

  const handleLoadMore = useCallback(() => {
    setVisibleCount((current) => Math.min(current + 12, sortedProducts.length))
  }, [sortedProducts.length])

  const handleSortChange = useCallback((value: string) => {
    setSort(value)
    setVisibleCount(INITIAL_VISIBLE)
  }, [])

  const inventoryCount = filteredProducts.length

  if (entry.instoreOnly) {
    return (
      <div className="shop-experience">
        <ShopHero entry={entry} />
        <ShopTabs active={entry.slug} onTabSelect={handleTabSelect} />
        <section className="jade-instore" aria-label="Jade Jewelry notice">
          <div className="jade-instore-inner">
            <div className="jade-instore-card">
              <h3 className="jade-instore-title">This is currently an in-store experience only.</h3>
              <p className="jade-instore-copy">
                Visit our store <a href="/visit">here</a> and learn more about the process before you go.
              </p>
              <a href="/jade-bar" className="jade-instore-btn">Learn the Jade Bar process</a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={`shop-experience${isAnimating || isPending ? ' is-transitioning' : ''}`}>
      <ShopHero entry={entry} />
      <ShopTabs active={entry.slug} onTabSelect={handleTabSelect} />
      <ShopToolbar
        entry={entry}
        count={inventoryCount}
        isUpdating={isAnimating || isPending}
        sort={sort}
        onSortChange={handleSortChange}
      />
      {inventoryCount === 0 ? (
        <section className="shop-empty" aria-label="No products">
          <div className="shop-empty-inner">
            <h2>No products available yet</h2>
            <p>
              We don’t have any {entry.navLabel?.toLowerCase() || entry.title.toLowerCase()} listed right now. Check back soon or explore other
              collections.
            </p>
            <Link className="btn btn--primary" href="/shop">
              Shop all pieces
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="shop-grid" aria-label="Product grid">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id ?? `${product.handle}-${index}`} product={product} index={index} />
            ))}
          </section>
          {hasMore ? (
            <div className="shop-load-more">
              <LoadMoreButton onClick={handleLoadMore} disabled={isAnimating || isPending} />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}



"use client"

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CATALOG_BY_SLUG,
  CatalogEntry,
  CatalogSlug,
  ShopifyListProduct,
  filterProductsByCatalogEntry,
} from './catalog'
import { ShopHero, ShopTabs, ShopToolbar, ProductCard, LoadMoreButton } from './components'
import { JadeBuilder } from './JadeBuilder'

const INITIAL_VISIBLE = 12

const FALLBACK_ENTRY = CATALOG_BY_SLUG.all

type ShopExperienceProps = {
  initialSlug: CatalogSlug
  products: ShopifyListProduct[]
}

export function ShopExperience({ initialSlug, products }: ShopExperienceProps) {
  const router = useRouter()
  // Trust the slug provided by the server route to avoid any client-side path desyncs.
  const activeSlug = initialSlug
  const [visibleCount, setVisibleCount] = useState(() => Math.min(INITIAL_VISIBLE, products.length))
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [sort, setSort] = useState('featured')
  const [subFilter, setSubFilter] = useState('all')

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_VISIBLE, products.length))
    setSubFilter('all') // Reset subfilter when switching categories
  }, [products, activeSlug])

  const entry: CatalogEntry = useMemo(() => CATALOG_BY_SLUG[activeSlug] ?? FALLBACK_ENTRY, [activeSlug])

  const filteredProducts = useMemo(() => {
    const base = filterProductsByCatalogEntry(products, entry)
    if (activeSlug === 'earrings' && subFilter !== 'all') {
      return base.filter((p) => {
        // Reuse the logic from catalog.ts if possible, or do a simple check
        // Ideally export matchesProductType or just check simple string inclusion/normalization
        const type = (p.productType || '').toLowerCase()
        return type.includes(subFilter.toLowerCase())
      })
    }
    return base
  }, [products, entry, activeSlug, subFilter])

  const sortedProducts = useMemo(() => {
    const list = filteredProducts.slice()
    const getPrice = (product: ShopifyListProduct) => {
      const amount = product.variants?.nodes?.[0]?.price?.amount
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
        setVisibleCount(INITIAL_VISIBLE)
        router.push(href)
      })
    },
    [activeSlug, startTransition, router],
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
    if (entry.slug === 'jade-jewelry') {
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <ShopHero entry={entry} />
          <ShopTabs active={entry.slug} onTabSelect={handleTabSelect} />
          <section className="flex-1 py-12 px-4 md:px-8">
            <JadeBuilder />
          </section>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <ShopHero entry={entry} />
        <ShopTabs active={entry.slug} onTabSelect={handleTabSelect} />
        <section className="flex-1 flex items-center justify-center py-20 px-6" aria-label="Jade Jewelry notice">
          <div className="max-w-2xl w-full bg-white p-12 border border-stone-100 shadow-sm text-center">
             <div className="flex justify-center mb-8">
                <span className="inline-block px-4 py-1.5 bg-[#efdada] text-stone-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                  In-Store Only
                </span>
             </div>
            <h3 className="font-heading text-3xl md:text-4xl text-stone-900 mb-6">
              This is currently an in-store experience only.
            </h3>
            <p className="text-stone-600 text-lg font-light mb-10 leading-relaxed">
              Visit our store <Link href="/visit" className="underline hover:text-stone-900">here</Link> and learn more about the process before you go.
            </p>
            <Link 
              href="/jade-bar" 
              className="inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
            >
              Learn the Jade Bar process
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white flex flex-col transition-opacity duration-300 ${isAnimating || isPending ? 'opacity-70' : 'opacity-100'}`}>
      <ShopHero entry={entry} />
      <ShopTabs active={entry.slug} onTabSelect={handleTabSelect} />
      <ShopToolbar
        entry={entry}
        count={inventoryCount}
        isUpdating={isAnimating || isPending}
        sort={sort}
        onSortChange={handleSortChange}
        subFilter={subFilter}
        onSubFilterChange={(val) => {
          setSubFilter(val)
          setVisibleCount(INITIAL_VISIBLE)
        }}
      />
      
      {inventoryCount === 0 ? (
        <section className="flex-1 flex items-center justify-center py-32 px-6" aria-label="No products">
          <div className="text-center max-w-md">
            <h2 className="font-heading text-2xl text-stone-900 mb-4">No products available yet</h2>
            <p className="text-stone-600 font-light mb-8">
              We don’t have any {entry.navLabel?.toLowerCase() || entry.title.toLowerCase()} listed right now. Check back soon or explore other
              collections.
            </p>
            <Link href="/shop" className="inline-block border-b border-stone-900 pb-1 text-xs font-bold uppercase tracking-[0.2em] text-stone-900 hover:opacity-70 transition-opacity">
              Shop all pieces
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="container mx-auto px-4 md:px-8 pb-20" aria-label="Product grid">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-10 md:gap-x-5 md:gap-y-14">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id ?? `${product.handle}-${index}`} product={product} index={index} />
              ))}
            </div>
          </section>
          {hasMore ? (
            <LoadMoreButton onClick={handleLoadMore} disabled={isAnimating || isPending} />
          ) : null}
        </>
      )}
    </div>
  )
}

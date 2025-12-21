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
import { ChevronDown } from 'lucide-react'

const TAB_ENTRIES = CATALOG_ENTRIES.filter((entry) => entry.tab)

// Shop heading images - map slug to image file name
// Map headings to files. Prefer the upscaled set in /public/new_shop_headings when available.
// Slugs without a new file keep their original /public/assets/shop headings art.
const SHOP_HEADING_IMAGES: Partial<Record<CatalogSlug, string>> = {
  'new-arrivals': '/assets/shop headings/new arrivals.png',
  'best-sellers': '/new_shop_headings/BESTSELLERS.jpg',
  all: '/new_shop_headings/SHOP%20ALL.jpg',
  rings: '/assets/shop headings/rings.png',
  necklaces: '/new_shop_headings/NECKLACES.jpg',
  bracelets: '/assets/shop headings/bracelets.png',
  anklets: '/new_shop_headings/ANKLETS.jpg',
  earrings: '/new_shop_headings/EARRINGS.jpg',
  jade: '/new_shop_headings/PREMADE_JADE.png',
  flutter: '/assets/shop headings/flutter.png',
  refined: '/assets/shop headings/refined.png',
  embellish: '/new_shop_headings/EMBELLISH.jpg',
  moonlight: '/new_shop_headings/MOONLIGHT.jpg',
  'jade-jewelry': '/new_shop_headings/JADE%20JEWELRY.jpg',
  'one-of-a-kind-vintage': '/assets/shop headings/one of a kind.png',
}

const DEFAULT_HERO_IMAGE = '/assets/events.JPG'

export function ShopHero({ entry }: { entry: CatalogEntry }) {
  const heroImage = SHOP_HEADING_IMAGES[entry.slug] ?? DEFAULT_HERO_IMAGE

  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] bg-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={`${entry.title} hero`}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1536px) 1400px, (min-width: 1280px) 1200px, (min-width: 1024px) 1000px, 100vw"
          priority
          quality={90}
        />
        {/* Subtle overlay to ensure text contrast if we ever add text over it, keeping it light for now */}
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </section>
  )
}

export function ShopTabs({ active, onTabSelect }: { active: CatalogSlug; onTabSelect?: (slug: CatalogSlug, href: string) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)

  // Scroll active tab into view on mount/change
  useEffect(() => {
    if (trackRef.current) {
      const activeEl = trackRef.current.querySelector<HTMLElement>('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
    }
  }, [active])

  // Guard: during fast navigation, the fixed header (z-index: 1810) can briefly overlap the tabs,
  // causing clicks to land on the logo (home). Capture clicks and resolve the tab under the pointer.
  useEffect(() => {
    if (!onTabSelect) return
    if (typeof document === 'undefined') return

    const handler = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return

      const elements = document.elementsFromPoint(event.clientX, event.clientY)
      const tabAnchor = elements
        .map((el) => (el as HTMLElement | null)?.closest?.('a[data-shop-tab="true"]') as HTMLAnchorElement | null)
        .find(Boolean)

      if (!tabAnchor) return

      // Always force the tab click behavior (and prevent underlying elements like the logo from receiving it).
      event.preventDefault()
      event.stopPropagation()

      const slug = tabAnchor.dataset.shopTabSlug as CatalogSlug | undefined
      const href = tabAnchor.getAttribute('href') ?? tabAnchor.dataset.shopTabHref
      if (!slug || !href) return

      onTabSelect(slug, href)
    }

    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [onTabSelect])

  return (
    <nav className="sticky top-[var(--header-offset,60px)] z-30 bg-white border-b border-stone-100 w-full">
      <div className="container mx-auto px-6">
        <div 
          className="flex overflow-x-auto scrollbar-hide gap-8 md:gap-12 py-4 md:py-5 items-center justify-start md:justify-center"
          ref={trackRef}
        >
        {TAB_ENTRIES.map((entry) => {
          const isAll = entry.slug === 'all'
          const href = isAll ? '/shop' : `/shop/category/${entry.slug}`
          const isActive = active === entry.slug
          const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (onTabSelect) {
              event.preventDefault()
              event.stopPropagation()
              onTabSelect(entry.slug, href)
            }
          }
          return (
            <Link
              key={entry.slug}
              href={href}
              onClick={handleClick}
              data-shop-tab="true"
              data-shop-tab-slug={entry.slug}
              data-shop-tab-href={href}
              data-active={isActive ? 'true' : 'false'}
                className={`whitespace-nowrap text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative pb-1 ${
                  isActive ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {entry.navLabel || entry.title}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-[1px] bg-stone-900 transform transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`} 
                />
            </Link>
          )
        })}
        </div>
      </div>
    </nav>
  )
}

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
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
  const label = `${formattedCount} ${count === 1 ? 'Item' : 'Items'}`
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange?.(event.target.value)
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="font-heading text-4xl md:text-6xl text-stone-900 mb-4 leading-tight capitalize">
            {entry.title}
          </h1>
          {entry.subtitle && (
            <p className="text-stone-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
              {entry.subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-stone-200 pt-6 gap-4">
          <div className={`text-xs font-bold uppercase tracking-widest text-stone-500 transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
            {isUpdating ? 'Updating...' : label}
          </div>
          
          <div className="relative group flex items-center gap-3">
             <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Sort By</span>
             <div className="relative">
               <select 
                 id="shop-sort" 
                 className="bg-transparent border-b border-stone-300 pr-8 pl-2 py-1 text-sm font-medium text-stone-900 focus:outline-none focus:border-stone-900 cursor-pointer"
                 style={{ 
                   appearance: 'none', 
                   WebkitAppearance: 'none', 
                   MozAppearance: 'none',
                   backgroundImage: 'none'
                 }}
                 value={sort} 
                 onChange={handleSortChange}
               >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
               <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProductCard({ product, index }: { product: ShopifyListProduct; index: number }) {
  const primaryImage = product.images?.edges?.[0]?.node
  const secondaryImage = product.images?.edges?.[1]?.node
  const primaryVariant = product.variants?.nodes?.[0]
  const priceAmount = primaryVariant?.price?.amount
  const priceCurrency = primaryVariant?.price?.currencyCode
  const formattedPrice = priceAmount
    ? new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: priceCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(priceAmount))
    : null
  const inStock = product.variants?.nodes?.some((v) => v?.availableForSale) ?? false
  
  // Stagger animation delay
  const delay = (index % 12) * 50

  return (
    <Link
      href={`/shop/${product.handle}`}
      className="group block animate-fade-in-up fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-white mb-3">
        {primaryImage?.url ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              fill
              className={`object-cover object-center transition-all duration-700 ease-out ${
                secondaryImage?.url ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'
              } group-hover:scale-105`}
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={90}
            />
            {secondaryImage?.url ? (
              <Image
                src={secondaryImage.url}
                alt={secondaryImage.altText || product.title}
                fill
                className="object-cover object-center transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={90}
              />
            ) : null}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <span className="text-xs uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {/* Quick Add / Hover Action could go here */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
      
      <div className="text-center space-y-1">
        <h3 className="text-sm text-stone-900 font-medium group-hover:text-stone-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-stone-500 tracking-wide">{formattedPrice}</p>
        {!inStock ? (
          <p className="text-[11px] text-red-500 tracking-wide font-medium">Sold out</p>
        ) : null}
      </div>
    </Link>
  )
}

export function LoadMoreButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <div className="flex justify-center pt-12 pb-20">
      <button 
        type="button" 
        onClick={onClick} 
        disabled={disabled}
        className="inline-flex items-center justify-center px-10 py-4 border border-stone-900 text-stone-900 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Loading...' : 'Load More'}
    </button>
    </div>
  )
}

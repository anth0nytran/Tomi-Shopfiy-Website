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
// Files are in /public/assets/shop headings/
const SHOP_HEADING_IMAGES: Partial<Record<CatalogSlug, string>> = {
  'new-arrivals': '/assets/shop headings/new arrivals.png',
  'best-sellers': '/assets/shop headings/best sellers.png',
  all: '/assets/shop headings/shop all.png',
  rings: '/assets/shop headings/rings.png',
  necklaces: '/assets/shop headings/necklaces.png',
  bracelets: '/assets/shop headings/bracelets.png',
  earrings: '/assets/shop headings/earrings.png',
  flutter: '/assets/shop headings/flutter.png',
  refined: '/assets/shop headings/refined.png',
  embellish: '/assets/shop headings/embellish.png',
  'one-of-a-kind-vintage': '/assets/shop headings/one of a kind.png',
}

const DEFAULT_HERO_IMAGE = '/assets/events.JPG'

export function ShopHero({ entry }: { entry: CatalogEntry }) {
  const heroImage = SHOP_HEADING_IMAGES[entry.slug] ?? DEFAULT_HERO_IMAGE

  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] bg-[#F9F8F6] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={`${entry.title} hero`}
          fill
          className="object-cover object-center"
          sizes="100vw"
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

  return (
    <nav className="sticky top-[var(--header-height,60px)] z-30 bg-white border-b border-stone-100 w-full">
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
              onTabSelect(entry.slug, href)
            }
          }
          return (
            <Link
              key={entry.slug}
              href={href}
              onClick={handleClick}
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
    <section className="py-12 md:py-16 bg-[#F9F8F6]">
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
  const primaryVariant = product.variants?.edges?.[0]?.node
  const priceAmount = primaryVariant?.price?.amount
  const priceCurrency = primaryVariant?.price?.currencyCode
  const formattedPrice = priceAmount
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: priceCurrency }).format(parseFloat(priceAmount))
    : null
  
  // Stagger animation delay
  const delay = (index % 12) * 50

  return (
    <Link
      href={`/shop/${product.handle}`}
      className="group block animate-fade-in-up fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100 mb-3">
        {primaryImage?.url ? (
          <Image  
            src={primaryImage.url} 
            alt={primaryImage.altText || product.title} 
            className="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-105"
            width={800} 
            height={800}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
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
        <p className="text-xs text-stone-500 tracking-wide">
          {formattedPrice}
        </p>
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

import React from 'react'
import { notFound } from 'next/navigation'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  CATALOG_BY_SLUG,
  CATALOG_ENTRIES,
  CatalogSlug,
  ShopifyListProduct,
} from '../../catalog'
import { ShopExperience } from '../../ShopExperience'
import { getCatalogProducts } from '../../productLoader'

export const revalidate = 300
export const dynamicParams = false

export function generateStaticParams() {
  return CATALOG_ENTRIES.map((entry) => ({ slug: entry.slug }))
}

export default async function CategoryPage({ params }: { params: { slug: CatalogSlug } }) {
  const entry = CATALOG_BY_SLUG[params.slug]
  if (!entry) {
    notFound()
  }

  const products = (await getCatalogProducts()) as ShopifyListProduct[]

  return (
    <main className="shop-main flex flex-col">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        <ShopExperience key={`shop-${entry.slug}`} initialSlug={entry.slug} products={products} />
      </div>
      <Footer />
    </main>
  )
}

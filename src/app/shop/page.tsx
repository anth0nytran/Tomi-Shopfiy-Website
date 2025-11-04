import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { fetchProducts } from '@/lib/shopify'
import { ShopifyListProduct } from './catalog'
import { ShopExperience } from './ShopExperience'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ShopPage() {
  const products = (await fetchProducts(150)) as ShopifyListProduct[]
  return (
    <main className="shop-main">
      <AnnouncementBar />
      <Header />
      <ShopExperience initialSlug="all" products={products} />
      <Footer />
    </main>
  )
}



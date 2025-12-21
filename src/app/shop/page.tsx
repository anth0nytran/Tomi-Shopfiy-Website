import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ShopifyListProduct } from './catalog'
import { ShopExperience } from './ShopExperience'
import { getCatalogProducts } from './productLoader'

export const revalidate = 300

export default async function ShopPage() {
  const products = (await getCatalogProducts()) as ShopifyListProduct[]
  return (
    <main className="shop-main flex flex-col">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        <ShopExperience key="shop-all" initialSlug="all" products={products} />
      </div>
      <Footer />
    </main>
  )
}


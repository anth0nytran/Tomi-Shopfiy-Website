import React from 'react'
import { notFound } from 'next/navigation'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { fetchProducts } from '@/lib/shopify'
import {
	CATALOG_BY_SLUG,
	CatalogSlug,
	ShopifyListProduct,
} from '../../catalog'
import { ShopExperience } from '../../ShopExperience'

export default async function CategoryPage({ params }: { params: { slug: CatalogSlug } }) {
	const entry = CATALOG_BY_SLUG[params.slug]
	if (!entry) {
		notFound()
	}

	const products = (await fetchProducts(150)) as ShopifyListProduct[]

	return (
		<main className="shop-main">
			<AnnouncementBar />
			<Header />
			<ShopExperience initialSlug={entry.slug} products={products} />
			<Footer />
		</main>
	)
}


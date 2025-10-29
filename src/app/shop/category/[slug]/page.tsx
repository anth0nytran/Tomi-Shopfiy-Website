import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MOCK_PRODUCTS, Product } from '../../mock'

type CategoryKey =
	| 'new-arrivals'
	| 'best-sellers'
	| 'all'
	| 'rings'
	| 'necklaces'
	| 'bracelets'
	| 'earrings'
	| 'flutter'
	| 'refined'
	| 'jade-jewelry'

const CATEGORY_META: Record<
	CategoryKey,
	{ title: string; subtitle?: string; heroClass: string; isJade?: boolean }
> = {
	'new-arrivals': {
		title: 'NEW ARRIVALS',
		subtitle: 'Discover your new forever favorites',
		heroClass: 'shop-hero--new',
	},
	'best-sellers': {
		title: 'BEST SELLERS',
		subtitle: 'Timeless, tested, and adored',
		heroClass: 'shop-hero--best',
	},
	all: {
		title: 'SHOP ALL',
		subtitle: 'Explore the complete collection of our timeless solid gold pieces',
		heroClass: 'shop-hero--all',
	},
	necklaces: {
		title: 'NECKLACES',
		subtitle: 'Curated gold pieces to adorn and elevate',
		heroClass: 'shop-hero--necklaces',
	},
	bracelets: {
		title: 'BRACELETS',
		subtitle: 'A touch of gold for every gesture',
		heroClass: 'shop-hero--bracelets',
	},
	earrings: {
		title: 'EARRINGS',
		subtitle: 'From dainty studs to timeless hoops',
		heroClass: 'shop-hero--earrings',
	},
	flutter: {
		title: 'FLUTTER',
		subtitle: 'Light, airy, butterfly-inspired pieces that make you float',
		heroClass: 'shop-hero--flutter',
	},
	refined: {
		title: 'REFINED',
		subtitle: 'The essence of minimalism, crafted in solid gold',
		heroClass: 'shop-hero--refined',
	},
	// Map Rings to the same background as Shop All until a dedicated image is available
	rings: {
		title: 'RINGS',
		subtitle: 'A band that doesn’t cost a band.',
		heroClass: 'shop-hero--all',
	},
	'jade-jewelry': {
		title: 'JADE JEWELRY',
		subtitle: '',
		heroClass: 'shop-hero--jade',
		isJade: true,
	},
}

function ShopHero({ title, subtitle, heroClass }: { title: string; subtitle?: string; heroClass: string }) {
	return (
		<section className={`shop-hero ${heroClass}`} aria-label={`${title} hero`}>
			<div className="shop-hero-media" />
			<div className="shop-hero-content">
				<h1 className="shop-title">{title}</h1>
				{subtitle ? <p className="shop-sub">{subtitle}</p> : null}
			</div>
		</section>
	)
}

function Filters() {
	return (
		<div className="shop-filters" role="region" aria-label="Filters">
			<div className="filter-row">
				<div className="filter-chip" aria-pressed="false">New</div>
				<div className="filter-chip" aria-pressed="false">Featured</div>
				<div className="filter-chip" aria-pressed="false">Under $200</div>
				<div className="filter-chip" aria-pressed="false">Gold</div>
				<div className="filter-chip" aria-pressed="false">Silver</div>
				<div className="filter-spacer" />
				<label className="sort" htmlFor="sort-select">
					<span className="sort-label">Sort</span>
					<select id="sort-select" className="sort-select" defaultValue="featured">
						<option value="featured">Featured</option>
						<option value="low">Price: Low → High</option>
						<option value="high">Price: High → Low</option>
						<option value="new">Newest</option>
					</select>
				</label>
			</div>
			<div className="filter-search">
				<input type="text" placeholder="Search products" className="filter-input" />
			</div>
		</div>
	)
}

function ProductCard({ product }: { product: Product }) {
	return (
		<Link href={`/shop/${product.id}`} className={`product-card${product.featured ? ' is-featured' : ''}`}>
			<div className="product-media">
				<Image src={product.image} alt="" className="product-img" width={800} height={800} />
			</div>
			<div className="product-info">
				<div className="product-title">{product.title}</div>
				<div className="product-price">{product.price}</div>
			</div>
		</Link>
	)
}

export default function CategoryPage({ params }: { params: { slug: CategoryKey } }) {
	const meta = CATEGORY_META[params.slug]
	const isJade = meta?.isJade

	return (
		<main className="shop-main">
			<AnnouncementBar />
			<Header />
			<ShopHero title={meta?.title || ''} subtitle={meta?.subtitle} heroClass={meta?.heroClass || 'shop-hero--all'} />
			{isJade ? (
				<section className="jade-instore" aria-label="Jade Jewelry notice">
					<div className="jade-instore-inner">
						<div className="jade-instore-card">
							<h3 className="jade-instore-title">This is currently an in-store experience only.</h3>
							<p className="jade-instore-copy">
								Visit our store <Link href="/visit">here</Link> and learn more about the process before you go.
							</p>
							<Link href="/jade-bar" className="jade-instore-btn">Learn the Jade Bar process</Link>
						</div>
					</div>
				</section>
			) : (
				<>
					<Filters />
					<section className="shop-grid" aria-label="Product grid">
						{MOCK_PRODUCTS.map((p) => (
							<ProductCard key={p.id} product={p} />
						))}
					</section>
				</>
			)}
			<Footer />
		</main>
	)
}



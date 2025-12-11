import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { fetchProductByHandle } from '@/lib/shopify'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { CATALOG_BY_SLUG } from '../catalog'
import { ChevronLeft } from 'lucide-react'
import { ProductGallery } from '../ProductGallery'

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await fetchProductByHandle(params.handle)
  if (!product) {
    return (
      <main className="bg-white flex flex-col">
        <AnnouncementBar />
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-stone-500 mb-4">Product not found.</p>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-[0.2em] border-b border-stone-900 pb-1">
              Back to Shop
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const galleryImages = product.images?.edges?.map((edge: any) => edge.node) ?? []
  const firstVariant = product.variants?.edges?.[0]?.node
  const price = firstVariant?.price
  const collections = product.collections?.edges?.map((edge: any) => edge.node) ?? []
  const primaryCollection = collections[0]
  const collectionEntry = primaryCollection?.handle && CATALOG_BY_SLUG[primaryCollection.handle as keyof typeof CATALOG_BY_SLUG]
  const descriptionHtml = product.descriptionHtml || product.description || ''
  const priceLabel = price ? new Intl.NumberFormat(undefined, { style: 'currency', currency: price.currencyCode }).format(parseFloat(price.amount)) : null
  const stockLabel = firstVariant?.availableForSale ? 'In stock' : 'Out of stock'
  
  const metaEntries = [
    product.productType ? { label: 'Category', value: product.productType } : null,
    collections.length ? { label: 'Collections', value: collections.map((collection: any) => collection.title).join(', ') } : null,
    product.vendor ? { label: 'Maker', value: product.vendor } : null,
    firstVariant?.sku ? { label: 'SKU', value: firstVariant.sku } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <main className="bg-white flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="pt-44 pb-24 px-6 md:px-12 container mx-auto max-w-7xl flex-1">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 transition-colors mb-12"
        >
          <ChevronLeft className="w-3 h-3" />
          Back to shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Product Gallery - Large & Clean */}
          <div className="lg:col-span-7">
            <ProductGallery images={galleryImages} title={product.title} />
          </div>

          {/* Product Details - Sticky & Editorial */}
          <div className="lg:col-span-5 lg:sticky lg:top-40">
             
             {/* Breadcrumbs */}
             <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-6">
               <Link href="/shop" className="hover:text-stone-600">Shop</Link>
               <span>/</span>
            {primaryCollection ? (
                 <Link href={collectionEntry ? `/shop/category/${collectionEntry.slug}` : '/shop'} className="text-stone-900 hover:text-stone-600">
                   {primaryCollection.title}
                 </Link>
               ) : (
                 <span className="text-stone-900">Product</span>
               )}
          </nav>

             <h1 className="font-heading text-4xl md:text-5xl text-stone-900 mb-8 leading-tight">
               {product.title}
             </h1>

             {/* Purchase Card - Clean & Minimal */}
             <div className="bg-white border border-stone-100 p-8 mb-10 shadow-sm">
               <div className="flex justify-between items-start mb-8">
              <div>
                   <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">Price</span>
                   <span className="text-3xl md:text-4xl text-stone-900 font-light">{priceLabel}</span>
              </div>
                 
                 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${firstVariant?.availableForSale ? 'bg-[#efdada] text-stone-900' : 'bg-stone-200 text-stone-500'}`}>
                   <span className={`w-1.5 h-1.5 rounded-full ${firstVariant?.availableForSale ? 'bg-stone-900' : 'bg-stone-400'}`} />
                {stockLabel}
              </div>
            </div>

            <AddToCartButton merchandiseId={firstVariant?.id || ''} available={!!firstVariant?.availableForSale} />
          </div>

             {/* Details Accordion / Sections */}
             <div className="space-y-8">
               
               {/* Description */}
               <div className="border-t border-stone-200 pt-6">
                 <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">
                   Details &amp; Specs
                 </h3>
                 <div 
                   className="prose prose-stone prose-sm max-w-none text-stone-600 font-light leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: descriptionHtml }} 
                 />
               </div>

               {/* Product Notes */}
               <div className="border-t border-stone-200 pt-6">
                 <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">
                   Product Notes
                 </h3>
                 {metaEntries.length > 0 ? (
                   <dl className="grid grid-cols-1 gap-4">
                  {metaEntries.map((entry) => (
                       <div key={entry.label} className="flex justify-between items-baseline border-b border-stone-100 pb-2 last:border-0">
                         <dt className="text-xs font-bold uppercase tracking-widest text-stone-500">{entry.label}</dt>
                         <dd className="text-sm text-stone-900 text-right font-medium">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                   <p className="text-sm text-stone-500 italic">No additional notes available.</p>
              )}
               </div>

             </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}

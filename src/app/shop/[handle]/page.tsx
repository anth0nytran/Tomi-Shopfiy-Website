import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { fetchProductByHandle } from '@/lib/shopify'
import { CATALOG_BY_SLUG } from '../catalog'
import { ChevronLeft } from 'lucide-react'
import { ProductGallery } from '../ProductGallery'
import { VariantPurchase } from './VariantPurchase'
import { BackToShop } from '@/components/shop/BackToShop'

function parseRingSizesFromMetafield(value: unknown): string[] {
  if (typeof value !== 'string') return []
  const trimmed = value.trim()
  if (!trimmed) return []
  // Shopify list metafields come back as JSON in a string, but we also accept comma-separated strings.
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed.map((v) => `${v}`.trim()).filter(Boolean)
    } catch {
      // fall through
    }
  }
  return trimmed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

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
  const variants = product.variants?.nodes ?? []
  const firstVariant = variants?.[0]
  const collections = product.collections?.edges?.map((edge: any) => edge.node) ?? []
  const primaryCollection = collections[0]
  const collectionEntry = primaryCollection?.handle && CATALOG_BY_SLUG[primaryCollection.handle as keyof typeof CATALOG_BY_SLUG]
  const descriptionHtml = product.descriptionHtml || product.description || ''
  const stockLabel = firstVariant?.availableForSale ? 'In stock' : 'Out of stock'
  const isRing =
    `${product.productType || ''}`.toLowerCase().includes('ring') ||
    collections.some((c: any) => `${c?.handle || ''}`.toLowerCase() === 'rings' || `${c?.title || ''}`.toLowerCase().includes('ring'))

  const sizeOption = product.options?.find((opt: any) => `${opt?.name || ''}`.toLowerCase().includes('size'))
  const sizeValues: string[] =
    sizeOption?.values?.map((v: any) => `${v}`.trim()).filter(Boolean) ||
    sizeOption?.optionValues?.map((v: any) => `${v?.name || ''}`.trim()).filter(Boolean) ||
    []

  // If size variants exist, we render those above; use metafield-only sizes as a request helper when no size option is present.
  const ringSizes = sizeValues.length ? [] : parseRingSizesFromMetafield(product?.availableRingSizes?.value)
  
  const normalizeMeta = (value: string) => value.trim().toLowerCase().replace(/s$/, '')
  const seenMeta = new Set<string>()
  const metaEntries: { label: string; value: string }[] = []

  const categoryValue = `${product.productType || ''}`.trim()
  if (categoryValue) {
    const key = normalizeMeta(categoryValue)
    if (key) {
      seenMeta.add(key)
      metaEntries.push({ label: 'Category', value: categoryValue })
    }
  }

  const uniqueCollections: string[] = []
  for (const collection of collections) {
    const title = `${collection?.title || ''}`.trim()
    const key = normalizeMeta(title)
    if (!title || !key) continue
    const already = seenMeta.has(key) || uniqueCollections.some((v) => normalizeMeta(v) === key)
    if (!already) {
      uniqueCollections.push(title)
    }
  }
  if (uniqueCollections.length) {
    uniqueCollections.forEach((value) => seenMeta.add(normalizeMeta(value)))
    metaEntries.push({ label: 'Collections', value: uniqueCollections.join(', ') })
  }

  const vendorValue = `${product.vendor || ''}`.trim()
  if (vendorValue && vendorValue.toLowerCase() !== 'tomi') {
    const key = normalizeMeta(vendorValue)
    if (key && !seenMeta.has(key)) {
      metaEntries.push({ label: 'Maker', value: vendorValue })
    }
  }

  return (
    <main className="bg-white flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="pt-44 pb-24 px-6 md:px-12 container mx-auto max-w-7xl flex-1">
        <BackToShop />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Product Gallery - Large & Clean */}
          <div className="lg:col-span-7">
            <ProductGallery images={galleryImages} title={product.title} />
          </div>

          {/* Product Details - Sticky & Editorial */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
             
             {/* Breadcrumbs */}
             <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-8">
               <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
               <span className="text-stone-300">/</span>
               <Link href="/shop" className="hover:text-stone-900 transition-colors">Shop</Link>
               <span className="text-stone-300">/</span>
            {primaryCollection ? (
                 <Link href={collectionEntry ? `/shop/category/${collectionEntry.slug}` : '/shop'} className="text-stone-900 hover:text-stone-600 transition-colors">
                   {primaryCollection.title}
                 </Link>
               ) : (
                 <span className="text-stone-900">Product</span>
               )}
          </nav>

             <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-10 leading-none">
               {product.title}
             </h1>
            
             {/* Purchase Card - Clean & Minimal */}
             <VariantPurchase
               productTitle={product.title}
               options={product.options ?? []}
               variants={variants}
               isRing={isRing}
               ringSizes={ringSizes}
             />

             {/* Details Accordion / Sections */}
             <div className="space-y-10 mt-12">
               
               {/* Description */}
               <div className="border-t border-stone-100 pt-8">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">
                   Description
                 </h3>
                 <div 
                   className="prose prose-stone prose-sm max-w-none text-stone-600 font-light leading-loose"
                   dangerouslySetInnerHTML={{ __html: descriptionHtml }} 
                 />
               </div>

               {/* Product Notes */}
               <div className="border-t border-stone-100 pt-8">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">
                   Specifications
                 </h3>
                 {metaEntries.length > 0 ? (
                   <dl className="grid grid-cols-1 gap-y-3">
                  {metaEntries.map((entry) => (
                       <div key={entry.label} className="flex justify-between items-baseline pb-3 border-b border-stone-50 last:border-0">
                         <dt className="text-[11px] font-medium uppercase tracking-widest text-stone-500">{entry.label}</dt>
                         <dd className="text-sm text-stone-900 text-right font-light">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                   <p className="text-sm text-stone-400 italic font-light">No additional notes available.</p>
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

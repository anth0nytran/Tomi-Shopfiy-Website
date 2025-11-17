import { cache } from 'react'
import { fetchProducts } from '@/lib/shopify'
import { ShopifyListProduct } from './catalog'

const PRODUCT_COUNT = 150

export const getCatalogProducts = cache(async (): Promise<ShopifyListProduct[]> => {
  return (await fetchProducts(PRODUCT_COUNT)) as ShopifyListProduct[]
})

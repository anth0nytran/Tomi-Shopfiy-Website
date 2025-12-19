import { cache } from 'react'
import { fetchAllProducts } from '@/lib/shopify'
import { ShopifyListProduct } from './catalog'

// Note: categories are filtered client-side from a single product list; keep this high enough
// that new product types (e.g. Anklet) aren’t accidentally excluded as the catalog grows.
const PRODUCT_COUNT = 1000

export const getCatalogProducts = cache(async (): Promise<ShopifyListProduct[]> => {
  return (await fetchAllProducts({ limit: PRODUCT_COUNT, pageSize: 250 })) as ShopifyListProduct[]
})

// TypeScript type definitions for the Tomi Jewelry website

export interface Product {
  id: string
  title: string
  description: string
  handle: string
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface ProductImage {
  url: string
  altText?: string
}

export interface ProductVariant {
  id: string
  price: Money
}

export interface Money {
  amount: string
  currencyCode: string
}

export interface Collection {
  id: string
  title: string
  handle: string
  description?: string
  image?: ProductImage
}

export interface CartItem {
  id: string
  quantity: number
  product: Product
  variant: ProductVariant
}

export interface Cart {
  id?: string
  items: CartItem[]
  totalQuantity: number
  totalPrice: Money
}

export interface Customer {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

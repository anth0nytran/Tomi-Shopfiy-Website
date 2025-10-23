export type Product = {
  id: string
  title: string
  price: string
  image: string
  featured?: boolean
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets'
}

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'Vintage Italian Ring', price: '$498', image: '/assets/6.png', category: 'rings' },
  { id: '2', title: 'Classic Ring', price: '$178', image: '/assets/5.png', featured: true, category: 'rings' },
  { id: '3', title: 'Jennie Ring', price: '$110', image: '/assets/4.png', category: 'rings' },
  { id: '4', title: 'Fine Necklace', price: '$320', image: '/assets/gold_necklace.png', category: 'necklaces' },
  { id: '5', title: 'Huggie Earrings', price: '$140', image: '/assets/gold_ear.png', category: 'earrings' },
  { id: '6', title: 'Cable Bracelet', price: '$210', image: '/assets/diamond_bracelet.png', category: 'bracelets' },
]



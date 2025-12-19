export type CatalogFilter =
  | { kind: 'all' }
  | { kind: 'productType'; productTypes: string[] }
  | { kind: 'collection'; handles: string[] }

export type CatalogSlug =
  | 'all'
  | 'new-arrivals'
  | 'best-sellers'
  | 'rings'
  | 'necklaces'
  | 'bracelets'
  | 'anklets'
  | 'earrings'
  | 'studs'
  | 'hoops'
  | 'flat-backs'
  | 'flutter'
  | 'refined'
  | 'embellish'
  | 'moonlight'
  | 'one-of-a-kind-vintage'
  | 'jade-jewelry'

export type CatalogEntry = {
  slug: CatalogSlug
  title: string
  subtitle?: string
  heroClass: string
  navLabel?: string
  navGroup: 'featured' | 'categories' | 'collections' | 'custom'
  filter: CatalogFilter
  instoreOnly?: boolean
  tab?: boolean
}

export type ShopifyListProduct = {
  id: string
  title: string
  handle: string
  productType?: string | null
  createdAt?: string
  tags?: string[]
  collections?: { edges: Array<{ node: { handle: string } }> }
  images?: { edges: Array<{ node: { url: string; altText?: string | null } }> }
  variants?: {
    edges: Array<{
      node: {
        id: string
        price: { amount: string; currencyCode: string }
      }
    }>
  }
}

const productType = (value: string): CatalogFilter => ({ kind: 'productType', productTypes: [value] })
const productTypes = (values: string[]): CatalogFilter => ({ kind: 'productType', productTypes: values })
const collection = (handle: string): CatalogFilter => ({ kind: 'collection', handles: [handle] })

function canonicalizeTypeToken(token: string) {
  const t = token.toLowerCase().trim()
  if (!t) return ''

  // Simple singularization for common plural forms used in productType values:
  // anklets -> anklet, hoops -> hoop, studs -> stud, etc.
  // Avoid breaking words like "glass" by skipping "ss".
  if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1)
  return t
}

function tokenizeProductType(value: string | null | undefined) {
  const raw = (value ?? '').trim()
  if (!raw) return []
  return raw
    .toLowerCase()
    // Treat any separators/punctuation as breaks so values like:
    // "Anklets / Chains", "Anklets&Chains", "Flat-Back", "Studs, Hoops"
    // tokenize predictably.
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/g)
    .map(canonicalizeTypeToken)
    .filter(Boolean)
}

function matchesProductType(filterType: string, actualType: string | null | undefined) {
  const expectedTokens = tokenizeProductType(filterType)
  if (!expectedTokens.length) return true
  const actualTokens = new Set(tokenizeProductType(actualType))
  // Require token inclusion (prevents false positives like ring matching earring).
  return expectedTokens.every((t) => actualTokens.has(t))
}

export const CATALOG_ENTRIES: CatalogEntry[] = [
  {
    slug: 'new-arrivals',
    title: 'NEW ARRIVALS',
    subtitle: 'Discover your new forever favorites',
    heroClass: 'shop-hero--new',
    navLabel: 'New Arrivals',
    navGroup: 'featured',
    filter: collection('new-arrivals'),
  },
  {
    slug: 'best-sellers',
    title: 'BEST SELLERS',
    subtitle: 'Timeless, tested, and adored',
    heroClass: 'shop-hero--best',
    navLabel: 'Best Sellers',
    navGroup: 'featured',
    filter: collection('best-sellers'),
  },
  {
    slug: 'all',
    title: 'SHOP ALL',
    subtitle: 'Explore the complete collection of our timeless solid gold pieces',
    heroClass: 'shop-hero--all',
    navLabel: 'Shop All',
    navGroup: 'categories',
    filter: { kind: 'all' },
    tab: true,
  },
  {
    slug: 'rings',
    title: 'RINGS',
    subtitle: 'A band that doesn’t cost a band.',
    heroClass: 'shop-hero--all',
    navLabel: 'Rings',
    navGroup: 'categories',
    filter: productType('Ring'),
    tab: true,
  },
  {
    slug: 'necklaces',
    title: 'NECKLACES',
    subtitle: 'Curated gold pieces to adorn and elevate',
    heroClass: 'shop-hero--necklaces',
    navLabel: 'Necklaces',
    navGroup: 'categories',
    filter: productType('Necklace'),
    tab: true,
  },
  {
    slug: 'bracelets',
    title: 'BRACELETS',
    subtitle: 'A touch of gold for every gesture',
    heroClass: 'shop-hero--bracelets',
    navLabel: 'Bracelets',
    navGroup: 'categories',
    filter: productType('Bracelet'),
    tab: true,
  },
  {
    slug: 'anklets',
    title: 'ANKLETS',
    subtitle: 'Effortless gold accents for every step',
    heroClass: 'shop-hero--all',
    navLabel: 'Anklets',
    navGroup: 'categories',
    filter: productType('Anklet'),
    tab: true,
  },
  {
    slug: 'earrings',
    title: 'EARRINGS',
    subtitle: 'From dainty studs to timeless hoops',
    heroClass: 'shop-hero--earrings',
    navLabel: 'Earrings',
    navGroup: 'categories',
    filter: productTypes(['Stud', 'Hoop', 'Flat Back']),
    tab: true,
  },
  {
    slug: 'studs',
    title: 'STUDS',
    subtitle: 'Everyday shine, crafted in 14k solid gold',
    heroClass: 'shop-hero--earrings',
    navLabel: 'Studs',
    navGroup: 'categories',
    filter: productType('Stud'),
  },
  {
    slug: 'hoops',
    title: 'HOOPS',
    subtitle: 'Arc-shaped statements, feather-light comfort',
    heroClass: 'shop-hero--earrings',
    navLabel: 'Hoops',
    navGroup: 'categories',
    filter: productType('Hoop'),
  },
  {
    slug: 'flat-backs',
    title: 'FLAT BACKS',
    subtitle: 'Secure backs with all-day ease',
    heroClass: 'shop-hero--earrings',
    navLabel: 'Flat Backs',
    navGroup: 'categories',
    filter: productType('Flat Back'),
  },
  {
    slug: 'flutter',
    title: 'FLUTTER',
    subtitle: 'Light, airy, butterfly-inspired pieces that make you float',
    heroClass: 'shop-hero--flutter',
    navLabel: 'Flutter',
    navGroup: 'collections',
    filter: collection('flutter'),
  },
  {
    slug: 'refined',
    title: 'REFINE',
    subtitle: 'The essence of minimalism, crafted in solid gold',
    heroClass: 'shop-hero--refined',
    navLabel: 'Refine',
    navGroup: 'collections',
    filter: collection('refine-collection'),
  },
  {
    slug: 'embellish',
    title: 'EMBELLISH',
    subtitle: 'Statement pieces with gemstone sparkle',
    heroClass: 'shop-hero--all',
    navLabel: 'Embellish',
    navGroup: 'collections',
    filter: collection('embellish'),
  },
  {
    slug: 'moonlight',
    title: 'MOONLIGHT',
    subtitle: 'Luminous silhouettes inspired by the night sky',
    heroClass: 'shop-hero--all',
    navLabel: 'Moonlight',
    navGroup: 'collections',
    filter: collection('moonlight'),
  },
  {
    slug: 'one-of-a-kind-vintage',
    title: 'ONE OF A KIND VINTAGE',
    subtitle: 'Vintage treasures sourced and restored by hand',
    heroClass: 'shop-hero--all',
    navLabel: 'One of a Kind',
    navGroup: 'collections',
    filter: collection('one-of-a-kind-vintage'),
  },
  {
    slug: 'jade-jewelry',
    title: 'JADE JEWELRY',
    subtitle: '',
    heroClass: 'shop-hero--jade',
    navLabel: 'Jade Jewelry',
    navGroup: 'custom',
    filter: { kind: 'all' },
    instoreOnly: true,
  },
]

export const CATALOG_BY_SLUG: Record<CatalogSlug, CatalogEntry> = CATALOG_ENTRIES.reduce((acc, entry) => {
  acc[entry.slug] = entry
  return acc
}, {} as Record<CatalogSlug, CatalogEntry>)

export function filterProductsByCatalogEntry(products: ShopifyListProduct[], entry: CatalogEntry) {
  const filter = entry.filter
  switch (filter.kind) {
    case 'all':
      return products
    case 'productType':
      return products.filter((product) => {
        return filter.productTypes.some((pt) => matchesProductType(pt, product.productType))
      })
    case 'collection':
      return products.filter((product) => {
        const handles = product.collections?.edges?.map((edge) => edge.node.handle) || []
        return handles.some((handle) => filter.handles.includes(handle))
      })
    default:
      return products
  }
}

export const NAV_GROUPS_ORDER = ['featured', 'categories', 'collections', 'custom'] as const



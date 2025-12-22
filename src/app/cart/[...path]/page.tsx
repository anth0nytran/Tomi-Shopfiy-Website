import { redirect } from 'next/navigation'

function getShopifyStoreDomain() {
  const raw = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || ''
  return raw.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
}

type PageProps = {
  params: { path: string[] }
  searchParams?: Record<string, string | string[] | undefined>
}

export default function CartCatchAllRedirectPage({ params, searchParams }: PageProps) {
  const storeDomain = getShopifyStoreDomain()
  if (!storeDomain) redirect('/shop')

  const pathname = `/cart/${(params.path || []).map(encodeURIComponent).join('/')}`
  const url = new URL(`https://${storeDomain}${pathname}`)

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === 'string') url.searchParams.set(key, value)
      else if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, v))
    }
  }

  redirect(url.toString())
}



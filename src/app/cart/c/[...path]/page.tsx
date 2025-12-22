import Link from 'next/link'

function getShopifyStoreDomain() {
  const raw = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || ''
  return raw.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
}

type PageProps = {
  params: { path: string[] }
  searchParams?: Record<string, string | string[] | undefined>
}

function buildQueryString(searchParams?: PageProps['searchParams']) {
  if (!searchParams) return ''
  const usp = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') usp.set(key, value)
    else if (Array.isArray(value)) value.forEach((v) => usp.append(key, v))
  }
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

export default function ShopifyCheckoutRelay({ params, searchParams }: PageProps) {
  const storeDomain = getShopifyStoreDomain()
  const suffix = (params.path || []).map(encodeURIComponent).join('/')
  const qs = buildQueryString(searchParams)

  const target = storeDomain ? `https://${storeDomain}/cart/c/${suffix}${qs}` : null

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-medium tracking-tight text-stone-900">Redirecting to checkout…</h1>
      <p className="mt-4 text-stone-700">
        We’re preparing your Shopify checkout.
      </p>

      {!target ? (
        <p className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
          Checkout can’t start because <code className="font-mono">NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN</code> isn’t configured.
        </p>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={target}
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium tracking-wide text-white"
              rel="noreferrer"
            >
              Continue to Shopify checkout
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-medium tracking-wide text-stone-900"
            >
              Return to shop
            </Link>
          </div>

          <p className="mt-8 text-sm text-stone-600">
            If you see “too many redirects”, Shopify is likely set to force <span className="font-medium">myshopify → primary domain</span>,
            but your primary domain is pointing at this headless site. In Shopify Admin → <span className="font-medium">Settings → Domains</span>,
            disable “Redirect all traffic to this domain” (or change the primary domain) so checkout can stay on Shopify.
          </p>
        </>
      )}
    </main>
  )
}



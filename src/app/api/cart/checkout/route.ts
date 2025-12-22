import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getCart, attachBuyerIdentity, shopifyConfig } from '@/lib/shopify'
import { getCustomerAccessToken } from '@/lib/auth/session'
import { buildAbsoluteUrl } from '@/lib/http'

const CART_COOKIE = 'cartId'

function normalizeCheckoutRedirect(req: NextRequest, checkoutUrl: string) {
  // Shopify's `checkoutUrl` is often based on the store's "primary domain".
  // In headless setups the primary domain can point at this Next.js app,
  // which causes `/cart/c/...` to 404 on our side.
  // Fix by forcing the checkout host to the configured Shopify store domain
  // when the returned URL points back at the current request host.
  if (!checkoutUrl || !shopifyConfig.storeDomain) return checkoutUrl

  try {
    const configuredStoreDomain = shopifyConfig.storeDomain
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')

    // If Shopify returns a relative path (e.g. "/cart/c/..."), force it onto Shopify's domain.
    if (checkoutUrl.startsWith('/')) {
      return `https://${configuredStoreDomain}${checkoutUrl}`
    }

    // Protocol-relative URL (e.g. //domain/path)
    if (checkoutUrl.startsWith('//')) {
      return `https:${checkoutUrl}`
    }

    const url = new URL(checkoutUrl)

    const forwardedHost = req.headers.get('x-forwarded-host')
    const hostHeader = req.headers.get('host')
    const requestHost = (forwardedHost || hostHeader || req.nextUrl.host || '').toLowerCase()
    const requestHostname = requestHost.split(',')[0]?.trim().split(':')[0] // handle proxies + ports

    const current = requestHostname?.replace(/^www\./, '')
    const checkoutHost = url.hostname.toLowerCase().replace(/^www\./, '')

    // Only rewrite if checkout is pointing back at THIS site.
    if (current && checkoutHost === current) {
      url.protocol = 'https:'
      url.hostname = configuredStoreDomain
      return url.toString()
    }

    return checkoutUrl
  } catch {
    return checkoutUrl
  }
}

export async function GET(req: NextRequest) {
  const store = cookies()
  const cartId = store.get(CART_COOKIE)?.value
  const fallback = NextResponse.redirect(buildAbsoluteUrl(req, '/shop'))
  if (!cartId) return fallback
  const cart = await getCart(cartId)
  if (!cart?.checkoutUrl) return fallback

  const token = await getCustomerAccessToken()
  if (token) {
    try {
      await attachBuyerIdentity(cart.id, token)
    } catch (error) {
      console.error('Failed to attach buyer identity', error)
    }
  }

  return NextResponse.redirect(normalizeCheckoutRedirect(req, cart.checkoutUrl))
}

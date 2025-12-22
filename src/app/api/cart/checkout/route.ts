import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getCart, attachBuyerIdentity, shopifyConfig } from '@/lib/shopify'
import { getCustomerAccessToken } from '@/lib/auth/session'
import { buildAbsoluteUrl } from '@/lib/http'

const CART_COOKIE = 'cartId'

/**
 * TEMP FIX: Normalize checkout URL to ALWAYS go to Shopify-owned host.
 * - If relative ("/cart/c/..."), prefix with https://<STORE>.myshopify.com
 * - If protocol-relative ("//domain/..."), add https:
 * - Otherwise return unchanged (do NOT rewrite based on request host)
 *
 * This avoids the redirect loop caused by myshopify <-> primary domain bouncing.
 */
function normalizeCheckoutRedirect(checkoutUrl: string) {
  if (!checkoutUrl) return checkoutUrl

  const shopifyHost = (shopifyConfig.storeDomain || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '') // hostname only

  // Shopify can return a relative path like "/cart/c/..."
  if (checkoutUrl.startsWith('/')) {
    return `https://${shopifyHost}${checkoutUrl}`
  }

  // Protocol-relative URL like "//domain/path"
  if (checkoutUrl.startsWith('//')) {
    return `https:${checkoutUrl}`
  }

  // Otherwise do NOT rewrite hosts — let Shopify's returned URL stand as-is.
  // This prevents us from accidentally rewriting to our storefront domain.
  return checkoutUrl
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

  return NextResponse.redirect(normalizeCheckoutRedirect(cart.checkoutUrl))
}

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getCart, attachBuyerIdentity } from '@/lib/shopify'
import { getCustomerAccessToken } from '@/lib/auth/session'

const CART_COOKIE = 'cartId'

export async function GET(req: NextRequest) {
  const store = cookies()
  const cartId = store.get(CART_COOKIE)?.value
  const fallback = NextResponse.redirect(new URL('/shop', req.url))
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

  return NextResponse.redirect(cart.checkoutUrl)
}

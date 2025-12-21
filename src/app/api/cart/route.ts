import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { addLinesToCart, createCart, getCart } from '@/lib/shopify'

const CART_COOKIE = 'cartId'

export async function GET() {
  try {
    const jar = cookies()
    const id = jar.get(CART_COOKIE)?.value
    if (!id) {
      const cart = await createCart()
      jar.set(CART_COOKIE, cart.id, { httpOnly: true, sameSite: 'lax', path: '/' })
      return new Response(JSON.stringify(cart), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    const cart = await getCart(id)
    if (!cart) {
      const fresh = await createCart()
      jar.set(CART_COOKIE, fresh.id, { httpOnly: true, sameSite: 'lax', path: '/' })
      return new Response(JSON.stringify(fresh), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify(cart), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Cart GET failed', error)
    return new Response(JSON.stringify({ error: 'Cart unavailable. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function POST(req: NextRequest) {
  try {
    const jar = cookies()
    let id = jar.get(CART_COOKIE)?.value
    if (!id) {
      const cart = await createCart()
      id = cart.id
      jar.set(CART_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/' })
    }
    const body = await req.json().catch(() => ({}))
    const lines = Array.isArray(body?.lines) ? body.lines : []
    if (!lines.length) return new Response(JSON.stringify({ error: 'No lines' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    const cart = await addLinesToCart(id!, lines)
    return new Response(JSON.stringify(cart), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Cart POST failed', error)
    return new Response(JSON.stringify({ error: 'Cart unavailable. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

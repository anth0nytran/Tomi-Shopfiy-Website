import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { addLinesToCart, createCart, removeLinesFromCart } from '@/lib/shopify'

const CART_COOKIE = 'cartId'

export async function POST(req: NextRequest) {
  const jar = cookies()
  let id = jar.get(CART_COOKIE)?.value
  if (!id) {
    const cart = await createCart()
    id = cart.id
    jar.set(CART_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/' })
  }
  const body = await req.json().catch(() => ({}))
  const lines = Array.isArray(body?.lines) ? body.lines : []
  if (!lines.length) return new Response(JSON.stringify({ error: 'No lines' }), { status: 400 })
  const cart = await addLinesToCart(id!, lines)
  return new Response(JSON.stringify(cart), { status: 200, headers: { 'Content-Type': 'application/json' } })
}


export async function DELETE(req: NextRequest) {
  const jar = cookies()
  const id = jar.get(CART_COOKIE)?.value
  if (!id) return new Response(JSON.stringify({ error: 'No cart' }), { status: 400 })
  const body = await req.json().catch(() => ({}))
  const lineIds = Array.isArray(body?.lineIds) ? body.lineIds : []
  if (!lineIds.length) return new Response(JSON.stringify({ error: 'No lineIds' }), { status: 400 })
  const cart = await removeLinesFromCart(id, lineIds)
  return new Response(JSON.stringify(cart), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

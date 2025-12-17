import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { addLinesToCart, createCart, removeLinesFromCart } from '@/lib/shopify'

const CART_COOKIE = 'cartId'

function sanitizeAttributes(input: unknown): Array<{ key: string; value: string }> | undefined {
  if (!Array.isArray(input)) return undefined
  const cleaned = input
    .map((a) => {
      const key = typeof a?.key === 'string' ? a.key.trim() : ''
      const value = typeof a?.value === 'string' ? a.value.trim() : ''
      if (!key || !value) return null
      // Shopify line attribute keys/values should be reasonable length; keep it defensive.
      return { key: key.slice(0, 64), value: value.slice(0, 255) }
    })
    .filter(Boolean) as Array<{ key: string; value: string }>
  return cleaned.length ? cleaned : undefined
}

export async function POST(req: NextRequest) {
  const jar = cookies()
  let id = jar.get(CART_COOKIE)?.value
  if (!id) {
    const cart = await createCart()
    id = cart.id
    jar.set(CART_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/' })
  }
  const body = await req.json().catch(() => ({}))
  const rawLines = Array.isArray(body?.lines) ? body.lines : []
  const lines = rawLines
    .map((l: any) => {
      const merchandiseId = typeof l?.merchandiseId === 'string' ? l.merchandiseId : ''
      const quantity = typeof l?.quantity === 'number' ? l.quantity : parseInt(`${l?.quantity ?? ''}`, 10)
      if (!merchandiseId || !Number.isFinite(quantity) || quantity < 1) return null
      const attributes = sanitizeAttributes(l?.attributes)
      return { merchandiseId, quantity: Math.max(1, quantity), attributes }
    })
    .filter(Boolean) as Array<{ merchandiseId: string; quantity: number; attributes?: Array<{ key: string; value: string }> }>

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

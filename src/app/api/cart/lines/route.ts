import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { addLinesToCart, createCart, removeLinesFromCart } from '@/lib/shopify'

const CART_COOKIE = 'cartId'

function sanitizeAttributes(input: unknown): Array<{ key: string; value: string }> | undefined {
  if (!Array.isArray(input)) return undefined
  const cleaned = input
    .slice(0, 10) // cap number of attributes
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
  try {
    const jar = cookies()
    let id = jar.get(CART_COOKIE)?.value
    if (!id) {
      const cart = await createCart()
      id = cart.id
      jar.set(CART_COOKIE, id, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })
    }
    const body = await req.json().catch(() => ({}))
    const rawLines = Array.isArray(body?.lines) ? body.lines : []
    const lines = rawLines
      .map((l: any) => {
        const merchandiseId = typeof l?.merchandiseId === 'string' ? l.merchandiseId : ''
        const quantityRaw = typeof l?.quantity === 'number' ? l.quantity : parseInt(`${l?.quantity ?? ''}`, 10)
        const quantity = Number.isFinite(quantityRaw) ? quantityRaw : NaN
        if (!merchandiseId || !Number.isFinite(quantity) || quantity < 1) return null
        const attributes = sanitizeAttributes(l?.attributes)
        // Clamp quantity to avoid abuse or accidental huge adds.
        return { merchandiseId, quantity: Math.min(Math.max(1, quantity), 20), attributes }
      })
      .filter(Boolean) as Array<{ merchandiseId: string; quantity: number; attributes?: Array<{ key: string; value: string }> }>

    if (!lines.length) return new Response(JSON.stringify({ error: 'No lines' }), { status: 400 })
    if (lines.length > 20) return new Response(JSON.stringify({ error: 'Too many lines' }), { status: 400 })

    const cart = await addLinesToCart(id!, lines)
    return new Response(JSON.stringify(cart), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('cart lines add failed', error)
    return new Response(JSON.stringify({ error: 'Cart unavailable. Please try again.' }), { status: 500 })
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const jar = cookies()
    const id = jar.get(CART_COOKIE)?.value
    if (!id) return new Response(JSON.stringify({ error: 'No cart' }), { status: 400 })
    const body = await req.json().catch(() => ({}))
    const lineIds = Array.isArray(body?.lineIds) ? body.lineIds : []
    if (!lineIds.length) return new Response(JSON.stringify({ error: 'No lineIds' }), { status: 400 })
    const cart = await removeLinesFromCart(id, lineIds)
    return new Response(JSON.stringify(cart), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('cart lines remove failed', error)
    return new Response(JSON.stringify({ error: 'Cart unavailable. Please try again.' }), { status: 500 })
  }
}

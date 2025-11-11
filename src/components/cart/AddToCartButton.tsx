"use client"
import React, { useId, useState, useTransition } from 'react'

type Props = {
  merchandiseId: string
  available?: boolean
  className?: string
}

export function AddToCartButton({ merchandiseId, available = true, className = '' }: Props) {
  const [qty, setQty] = useState<number>(1)
  const [pending, startTransition] = useTransition()
  const qtyInputId = useId()
  const disabled = !available || !merchandiseId || qty < 1 || pending

  async function add() {
    if (disabled) return
    try {
      await fetch('/api/cart/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: [{ merchandiseId, quantity: Math.max(1, qty) }] }),
        cache: 'no-store',
      })
      // Ask the drawer to open and re-render
      document.dispatchEvent(new CustomEvent('tomi:cart:open'))
    } catch {}
  }

  return (
    <div className={['product-action', className].filter(Boolean).join(' ').trim()}>
      <label className="product-qty" htmlFor={qtyInputId}>
        <span className="product-qty-label">Quantity</span>
        <input
          id={qtyInputId}
          className="product-qty-input"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10) || 1))}
        />
      </label>
      <button className="product-add" type="button" onClick={() => startTransition(add)} disabled={disabled}>
        {pending ? 'Adding…' : 'Add to cart'}
      </button>
    </div>
  )
}


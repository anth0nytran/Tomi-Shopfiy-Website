"use client"
import React, { useState, useTransition } from 'react'

type Props = {
  merchandiseId: string
  available?: boolean
}

export function AddToCartButton({ merchandiseId, available = true }: Props) {
  const [qty, setQty] = useState<number>(1)
  const [pending, startTransition] = useTransition()
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
    <div style={{ display: 'grid', gap: 8, alignItems: 'center', gridTemplateColumns: 'auto 1fr' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Qty</span>
        <input
          className="contact-input"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10) || 1))}
          style={{ width: 80 }}
        />
      </label>
      <button className="product-add" type="button" onClick={() => startTransition(add)} disabled={disabled}>
        {pending ? 'Adding…' : 'Add to cart'}
      </button>
    </div>
  )
}



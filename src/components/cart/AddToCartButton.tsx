"use client"
import React, { useEffect, useId, useState } from 'react'

type Props = {
  merchandiseId: string
  available?: boolean
  className?: string
}

type FeedbackState = { type: 'success' | 'error'; message: string } | null

const FEEDBACK_RESET_MS = 4000

export function AddToCartButton({ merchandiseId, available = true, className = '' }: Props) {
  const [qty, setQty] = useState<number>(1)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const qtyInputId = useId()
  const disabled = !available || !merchandiseId || qty < 1 || submitting

  useEffect(() => {
    if (!feedback) return
    const timeout = window.setTimeout(() => setFeedback(null), FEEDBACK_RESET_MS)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  async function add() {
    if (disabled) return
    setSubmitting(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/cart/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: [{ merchandiseId, quantity: Math.max(1, qty) }] }),
        cache: 'no-store',
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.error || 'Failed to add item')
      }
      document.dispatchEvent(new CustomEvent('tomi:cart:open'))
      setFeedback({ type: 'success', message: 'Added to your bag.' })
    } catch (error) {
      console.error('Add to cart failed', error)
      setFeedback({ type: 'error', message: "We couldn't add this item. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  const buttonLabel = !available ? 'Sold out' : submitting ? 'Adding...' : 'Add to cart'

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
      <div>
        <button className="product-add" type="button" onClick={add} disabled={disabled}>
          {buttonLabel}
        </button>
        <p
          className={[
            'product-add-status',
            feedback ? `product-add-status--${feedback.type}` : '',
          ].join(' ')}
          role="status"
          aria-live="polite"
        >
          {feedback?.message || (!available ? 'Temporarily unavailable.' : '')}
        </p>
      </div>
    </div>
  )
}

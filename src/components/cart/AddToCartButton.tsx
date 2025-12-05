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
    <div className={['flex flex-col gap-4', className].filter(Boolean).join(' ').trim()}>
      <div className="flex items-end gap-4">
        <div className="w-1/3">
           <label htmlFor={qtyInputId} className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
             Quantity
           </label>
           <div className="relative">
        <input
          id={qtyInputId}
               className="w-full bg-[#F9F8F6] border-b border-stone-300 py-4 text-center text-stone-900 font-medium focus:outline-none focus:border-stone-900 transition-colors"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10) || 1))}
        />
           </div>
        </div>

        <button 
          className="w-2/3 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[54px]"
          type="button" 
          onClick={add} 
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      </div>
      
      <div className="min-h-[20px]">
        <span
          className={`block text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
            feedback?.type === 'error' ? 'text-red-500' : 'text-stone-500'
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback?.message || (!available ? 'Temporarily unavailable.' : '')}
        </span>
      </div>
    </div>
  )
}

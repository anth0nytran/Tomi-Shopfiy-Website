"use client"

import React, { useEffect, useId, useMemo, useState } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

type Props = {
  merchandiseId: string
  available?: boolean
  ringSizes: string[]
}

const STORAGE_KEY = 'tomi:ring:sizeRequest'

function normalizeSizeList(sizes: string[]) {
  return Array.from(
    new Set(
      sizes
        .map((s) => `${s}`.trim())
        .filter(Boolean),
    ),
  )
}

export function RingPurchaseCard({ merchandiseId, available = true, ringSizes }: Props) {
  const selectId = useId()
  const textareaId = useId()
  const sizes = useMemo(() => normalizeSizeList(ringSizes), [ringSizes])

  const [selectedSize, setSelectedSize] = useState('')
  const [showRequest, setShowRequest] = useState(false)
  const [requestDraft, setRequestDraft] = useState('')
  const [requestSaved, setRequestSaved] = useState('')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) || ''
      if (saved) {
        setRequestDraft(saved)
        setRequestSaved(saved)
      }
    } catch {
      // ignore
    }
  }, [])

  const canAdd = available && Boolean(merchandiseId) && (Boolean(selectedSize) || Boolean(requestSaved))

  const attributes = useMemo(() => {
    const out: Array<{ key: string; value: string }> = []
    if (selectedSize) out.push({ key: 'Ring size', value: selectedSize })
    if (!selectedSize && requestSaved) out.push({ key: 'Requested ring size', value: requestSaved })
    return out
  }, [requestSaved, selectedSize])

  function saveRequest() {
    const value = requestDraft.trim()
    setRequestSaved(value)
    try {
      if (value) window.localStorage.setItem(STORAGE_KEY, value)
      else window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  function clearRequest() {
    setRequestDraft('')
    setRequestSaved('')
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      {sizes.length > 0 ? (
        <div>
          <label htmlFor={selectId} className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
            Ring size
          </label>
          <select
            id={selectId}
            value={selectedSize}
            onChange={(e) => {
              const next = e.target.value
              setSelectedSize(next)
              if (next) {
                // If they picked a valid size, we don't want to send a custom request too.
                setRequestSaved('')
              }
            }}
            className="w-full bg-[#F9F8F6] border-b border-stone-300 py-4 px-3 text-stone-900 font-medium focus:outline-none focus:border-stone-900 transition-colors"
          >
            <option value="">Select a size</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="border-t border-stone-200 pt-5">
        <button
          type="button"
          className="w-full flex items-center justify-between text-left"
          onClick={() => setShowRequest((v) => !v)}
          aria-expanded={showRequest ? 'true' : 'false'}
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-stone-900">Not seeing your size?</span>
          <span className="text-stone-500 text-sm">{showRequest ? '−' : '+'}</span>
        </button>

        {showRequest ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-stone-600 leading-relaxed">
              You&apos;re in luck! Our rings are made-to-order, which means we can absolutely place an order for you with your
              true, desired size.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Please use the text box below to indicate the desired size you would like to order, and we will use this
              information to package your order accordingly. You may proceed to your cart after saving.{' '}
              <span className="text-red-500">Your information will not be saved if you do not click SAVE.</span>
            </p>

            <textarea
              id={textareaId}
              value={requestDraft}
              onChange={(e) => setRequestDraft(e.target.value)}
              placeholder="EX: Size 6 for the white gold ring, and size 9 for the yellow gold"
              rows={3}
              className="w-full rounded-xl border border-stone-300 bg-white p-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={saveRequest}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={clearRequest}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-stone-300 text-stone-900 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-50 transition-colors"
              >
                Clear
              </button>

              {requestSaved ? (
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Saved</span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <AddToCartButton
        merchandiseId={merchandiseId}
        available={available}
        attributes={attributes}
        canSubmit={canAdd}
        cannotSubmitMessage={!available ? 'Temporarily unavailable.' : 'Select a size or save a size request to add to bag.'}
      />
    </div>
  )
}



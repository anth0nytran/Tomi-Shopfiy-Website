"use client"

import React, { useEffect, useId, useMemo, useState } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

type Props = {
  merchandiseId: string
  available?: boolean
  ringSizes: string[]
  sizeOptionName?: string | null
  selectedSize?: string
  attributesFromParent?: Array<{ key: string; value: string }>
  onRequestChange?: (value: string) => void
  onSizeSelect?: (value: string) => void
  canSubmit?: boolean
  onRequestSaved?: () => void
}

function normalizeSizeList(sizes: string[]) {
  return Array.from(
    new Set(
      sizes
        .map((s) => `${s}`.trim())
        .filter(Boolean),
    ),
  )
}

export function RingPurchaseCard({
  merchandiseId,
  available = true,
  ringSizes,
  sizeOptionName,
  selectedSize: selectedSizeProp,
  attributesFromParent,
  onRequestChange,
  onSizeSelect,
  canSubmit,
  onRequestSaved,
}: Props) {
  const selectId = useId()
  const textareaId = useId()
  const sizes = useMemo(() => normalizeSizeList(ringSizes), [ringSizes])

  const [selectedSize, setSelectedSize] = useState(selectedSizeProp || '')
  const [showRequest, setShowRequest] = useState(false)
  const [requestDraft, setRequestDraft] = useState('')
  const [requestSaved, setRequestSaved] = useState('')

  // Keep local selection in sync with parent-controlled value (variant selection).
  useEffect(() => {
    setSelectedSize(selectedSizeProp || '')
  }, [selectedSizeProp])

  const canAdd = available && Boolean(merchandiseId) && (Boolean(selectedSize) || Boolean(requestSaved)) && (canSubmit !== false)

  const attributes = useMemo(() => {
    const out: Array<{ key: string; value: string }> = []
    if (Array.isArray(attributesFromParent)) out.push(...attributesFromParent)
    if (selectedSize) out.push({ key: 'Ring size', value: selectedSize })
    if (!selectedSize && requestSaved) out.push({ key: 'Requested ring size', value: requestSaved })
    return out
  }, [attributesFromParent, requestSaved, selectedSize])

  function saveRequest() {
    const value = requestDraft.trim()
    setRequestSaved(value)
    onRequestChange?.(value)
    if (value) {
      setSelectedSize('')
      onSizeSelect?.('')
      onRequestSaved?.()
      setShowRequest(false)
    }
  }

  function clearRequest() {
    setRequestDraft('')
    setRequestSaved('')
    onRequestChange?.('')
    onRequestSaved?.()
  }

  return (
    <div className="space-y-6">
      {sizes.length > 0 ? (
        <div>
          <label htmlFor={selectId} className="block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-900 mb-3">
            Ring size
          </label>
          <div className="relative">
             <select
              id={selectId}
              value={selectedSize}
              onChange={(e) => {
                const next = e.target.value
                setSelectedSize(next)
                onSizeSelect?.(next)
                if (next) {
                  // If they picked a valid size, we don't want to send a custom request too.
                  setRequestSaved('')
                  onRequestChange?.('')
                } else if (!next && sizeOptionName) {
                  onSizeSelect?.('')
                }
              }}
              className="w-full appearance-none rounded-none border border-stone-200 bg-transparent py-3 px-4 text-sm text-stone-900 font-medium focus:border-stone-900 focus:outline-none transition-colors cursor-pointer hover:border-stone-400"
            >
              <option value="">Select a size</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
               <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
               </svg>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pt-2">
        <button
          type="button"
          className="group flex items-center gap-2 text-left"
          onClick={() => setShowRequest((v) => !v)}
          aria-expanded={showRequest ? 'true' : 'false'}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 group-hover:text-stone-900 transition-colors border-b border-transparent group-hover:border-stone-900 pb-0.5">
            Can&apos;t find your size?
          </span>
        </button>

        {showRequest ? (
          <div className="mt-4 bg-stone-50 p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              We make our rings to order, so we can craft your exact size. 
              Enter your desired size below and click save.
            </p>
            
            <div className="space-y-3">
              <textarea
                id={textareaId}
                value={requestDraft}
                onChange={(e) => setRequestDraft(e.target.value)}
                placeholder="e.g. Size 6.5"
                rows={2}
                className="w-full rounded-none border border-stone-200 bg-white p-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-0 transition-colors"
              />

              <div className="flex items-center justify-between">
                 <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={saveRequest}
                      className="inline-flex items-center justify-center px-6 py-2 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={clearRequest}
                      className="inline-flex items-center justify-center px-4 py-2 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-stone-900 transition-colors"
                    >
                      Clear
                    </button>
                 </div>
                 {requestSaved ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Saved</span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <AddToCartButton
        merchandiseId={merchandiseId}
        available={available}
        attributes={attributes}
        canSubmit={canSubmit}
        cannotSubmitMessage={!available ? 'Temporarily unavailable.' : 'Select a size or save a size request to add to bag.'}
      />
    </div>
  )
}



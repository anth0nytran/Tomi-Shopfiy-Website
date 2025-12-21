"use client"

import React, { useMemo, useState } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { RingPurchaseCard } from './RingPurchaseCard'

type PdpOption = { name: string; values?: string[]; optionValues?: Array<{ name: string | null }> }
type PdpVariant = {
  id: string
  title?: string | null
  sku?: string | null
  availableForSale?: boolean | null
  selectedOptions?: Array<{ name: string; value: string }>
  price?: { amount: string; currencyCode: string } | null
  compareAtPrice?: { amount: string; currencyCode: string } | null
}

type Props = {
  productTitle: string
  options: PdpOption[]
  variants: PdpVariant[]
  isRing: boolean
  ringSizes: string[]
}

const normalizeName = (name: string | null | undefined) => (name ?? '').trim().toLowerCase()

function findVariantRelaxed(
  variants: PdpVariant[],
  selected: Record<string, string>,
  optionNames: string[],
): PdpVariant | null {
  if (optionNames.length === 0) return variants[0] ?? null
  const missing = optionNames.some((name) => !selected[name])
  if (missing) return null

  // Prefer name+value match.
  const exact = variants.find((variant) => {
    const opts = variant.selectedOptions ?? []
    return optionNames.every((name) =>
      opts.some((o) => normalizeName(o.name) === normalizeName(name) && o.value === selected[name]),
    )
  })
  if (exact) return exact

  // Fallback: match by values set (helps when option labels differ, e.g., "Size" vs "Ring Size").
  const selectedValues = new Set(Object.values(selected))
  const valueMatch = variants.find((variant) => {
    const values = (variant.selectedOptions ?? []).map((o) => o.value)
    return values.length === optionNames.length && values.every((v) => selectedValues.has(v))
  })
  if (valueMatch) return valueMatch

  return variants[0] ?? null
}

function findVariant(
  variants: PdpVariant[],
  selected: Record<string, string>,
  optionNames: string[],
): PdpVariant | null {
  if (optionNames.length === 0) return variants[0] ?? null

  const missing = optionNames.some((name) => !selected[name])
  if (missing) {
    if (variants.length === 1) return variants[0] ?? null
    return null
  }

  // First: exact match on normalized option names.
  const exact = variants.find((variant) => {
    const opts = variant.selectedOptions ?? []
    return optionNames.every((name) =>
      opts.some((o) => normalizeName(o.name) === normalizeName(name) && o.value === selected[name]),
    )
  })
  if (exact) return exact

  // Fallback: match by values only (helps when Shopify option names differ, e.g., "Size" vs "Ring Size").
  const selectedValues = new Set(Object.values(selected))
  const valueMatch = variants.find((variant) => {
    const opts = variant.selectedOptions ?? []
    const values = opts.map((o) => o.value)
    return values.length === optionNames.length && values.every((v) => selectedValues.has(v))
  })
  if (valueMatch) return valueMatch

  return variants[0] ?? null
}

function formatMoney(price?: { amount: string; currencyCode: string } | null) {
  if (!price?.amount) return null
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: price.currencyCode }).format(
    parseFloat(price.amount),
  )
}

export function VariantPurchase({ productTitle, options, variants, isRing, ringSizes }: Props) {
  const normalizedOptions = useMemo(() => {
    return (options || [])
      .map((opt) => {
        const values =
          opt.values?.map((v) => `${v}`.trim()).filter(Boolean) ||
          opt.optionValues?.map((v) => `${v?.name || ''}`.trim()).filter(Boolean) ||
          []
        const name = opt.name
        // Hide Shopify's default "Title" option if it's the only value.
        if (name && name.toLowerCase() === 'title' && values.length === 1 && values[0].toLowerCase() === 'default title') {
          return null
        }
        return { name, values }
      })
      .filter((opt): opt is { name: string; values: string[] } => Boolean(opt?.name && opt?.values.length))
  }, [options])

  const optionNames = useMemo(() => normalizedOptions.map((o) => o.name!), [normalizedOptions])

  // Seed selection from the first variant if present; skip auto-selecting size options so users must choose or request.
  const initialSelected = useMemo(() => {
    const fromVariant =
      variants[0]?.selectedOptions?.reduce<Record<string, string>>((acc, opt) => {
        if (opt?.name && opt?.value) acc[opt.name] = opt.value
        return acc
      }, {}) ?? {}
    if (Object.keys(fromVariant).length) {
      const out: Record<string, string> = {}
      for (const [name, value] of Object.entries(fromVariant)) {
        if (name.toLowerCase().includes('size')) continue
        out[name] = value
      }
      return out
    }

    const seed: Record<string, string> = {}
    normalizedOptions.forEach((opt) => {
      if (opt.values.length === 1 && !opt.name.toLowerCase().includes('size')) seed[opt.name] = opt.values[0]
    })
    return seed
  }, [normalizedOptions, variants])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialSelected)
  const [requestedSizeNote, setRequestedSizeNote] = useState('')
  const [customRequest, setCustomRequest] = useState('')

  const sizeOptionName = optionNames.find((n) => n.toLowerCase().includes('size')) || null
  const colorOptionName = optionNames.find((n) => n.toLowerCase().includes('color')) || null
  const sizeOption =
    sizeOptionName && normalizedOptions.find((opt) => normalizeName(opt.name) === normalizeName(sizeOptionName))
  const optionNamesWithoutSize = sizeOptionName ? optionNames.filter((n) => n !== sizeOptionName) : optionNames
  const displayOptions =
    isRing && sizeOptionName
      ? normalizedOptions.filter((opt) => normalizeName(opt.name) !== normalizeName(sizeOptionName))
      : normalizedOptions
  const ringSizeOptions = useMemo(() => {
    const merged = [...(sizeOption?.values ?? []), ...(ringSizes || [])]
    return Array.from(new Set(merged.map((v) => v.trim()).filter(Boolean)))
  }, [ringSizes, sizeOptionName, sizeOption?.values?.join('|')])
  const currentSelectedSize = sizeOptionName ? selectedOptions[sizeOptionName] || '' : ''

  const selectedVariantStrict = useMemo(
    () => findVariant(variants, selectedOptions, optionNames),
    [variants, selectedOptions, optionNames],
  )

  const selectedVariantPartial = useMemo(() => {
    if (!optionNamesWithoutSize.length) return null
    const entries = Object.entries(selectedOptions).filter(([name]) =>
      optionNamesWithoutSize.some((n) => normalizeName(n) === normalizeName(name)),
    )
    if (!entries.length) return null
    return (
      variants.find((variant) =>
        entries.every(([name, value]) =>
          (variant.selectedOptions ?? []).some(
            (o) => normalizeName(o.name) === normalizeName(name) && o.value === value,
          ),
        ),
      ) ?? null
    )
  }, [optionNamesWithoutSize, selectedOptions, variants])

  const fallbackAvailable = variants.find((v) => v.availableForSale) ?? variants[0] ?? null
  const selectedVariant = selectedVariantStrict ?? selectedVariantPartial ?? fallbackAvailable
  const displayVariant = selectedVariant ?? fallbackAvailable

  const hasOptions = normalizedOptions.length > 0
  const priceLabel = formatMoney(displayVariant?.price)
  const compareLabel = formatMoney(displayVariant?.compareAtPrice)
  const sizeRequirementMet = sizeOptionName ? Boolean(selectedOptions[sizeOptionName] || customRequest) : true
  const nonSizeOptionsMet = optionNamesWithoutSize.every((name) => !!selectedOptions[name])
  const selectionComplete = nonSizeOptionsMet && sizeRequirementMet
  const buttonAvailable = selectionComplete ? selectedVariant?.availableForSale ?? true : true
  const merchandiseId = selectedVariant?.id || fallbackAvailable?.id || ''
  const selectedOptionValues = optionNames
    .map((name) => selectedOptions[name])
    .filter((v): v is string => Boolean(v))
  const selectionPieces = [...selectedOptionValues]
  if (customRequest) selectionPieces.push(customRequest)

  const selectionText =
    selectionPieces.length > 0
      ? selectionPieces.join(' / ')
      : optionNames.length === 0
        ? 'Default'
        : 'Choose options'

  const sizeChosen = sizeOptionName ? Boolean(selectedOptions[sizeOptionName]) : true
  const allowVariantTitle =
    requestedSizeNote ||
    (!sizeOptionName || sizeChosen) ||
    optionNames.length === 0

  const selectionParts = (() => {
    const parts: string[] = []
    const colorValue = colorOptionName ? selectedOptions[colorOptionName] : ''
    const sizeValue = sizeOptionName ? selectedOptions[sizeOptionName] : ''
    if (colorValue) parts.push(`Color: ${colorValue}`)
    if (customRequest) parts.push(`Custom size: ${customRequest}`)
    else if (sizeValue) parts.push(`Ring size: ${sizeValue}`)
    return parts
  })()

  const selectionLabel = (() => {
    if (selectionParts.length) return selectionParts.join(' / ')
    if (allowVariantTitle && selectedVariant?.title && selectedVariant.title.toLowerCase() !== 'default title') {
      return selectedVariant.title
    }
    return selectionText
  })()

  const showSelectionDetails =
    hasOptions ||
    variants.length > 1 ||
    (selectedVariant?.title && selectedVariant.title.toLowerCase() !== 'default title') ||
    Boolean(selectionPieces.length) ||
    Boolean(customRequest)

  const cartAttributes: Array<{ key: string; value: string }> = []
  Object.entries(selectedOptions).forEach(([name, value]) => {
    const normName = normalizeName(name)
    const trimmedVal = (value || '').trim()
    if (!trimmedVal) return
    if (normName === 'title' || trimmedVal.toLowerCase() === 'default title') return
    cartAttributes.push({ key: name, value: trimmedVal })
  })
  if (!selectedOptions[sizeOptionName || ''] && customRequest) {
    cartAttributes.push({ key: 'Requested ring size', value: customRequest.trim() })
  }

  const handleSelect = (name: string, value: string) => {
    if (sizeOptionName && normalizeName(name) === normalizeName(sizeOptionName)) {
      setRequestedSizeNote('')
      setCustomRequest('')
    }
    setSelectedOptions((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequestChange = (value: string) => {
    setRequestedSizeNote(value)
    setCustomRequest(value)
    if (sizeOptionName) {
      setSelectedOptions((prev) => {
        const next = { ...prev }
        if (value) delete next[sizeOptionName]
        return next
      })
    }
  }

  const handleSizeSelect = (value: string) => {
    if (!sizeOptionName) return
    setRequestedSizeNote('')
    setSelectedOptions((prev) => {
      const next = { ...prev }
      if (value) next[sizeOptionName] = value
      else delete next[sizeOptionName]
      return next
    })
  }

  return (
    <div className="bg-white border border-stone-100 p-8 mb-10 shadow-sm space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">Price</span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl text-stone-900 font-light">{priceLabel ?? '—'}</span>
            {compareLabel && compareLabel !== priceLabel ? (
              <span className="text-sm text-stone-400 line-through">{compareLabel}</span>
            ) : null}
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            !selectionComplete
              ? 'bg-stone-200 text-stone-500'
              : buttonAvailable
                ? 'bg-[#efdada] text-stone-900'
                : 'bg-stone-200 text-stone-500'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              !selectionComplete ? 'bg-stone-400' : buttonAvailable ? 'bg-stone-900' : 'bg-stone-400'
            }`}
          />
          {!selectionComplete ? 'Select size or save custom' : buttonAvailable ? 'In stock' : 'Out of stock'}
        </div>
      </div>

      {hasOptions ? (
        <div className="space-y-4">
          {displayOptions.map((opt) => (
            <div key={opt.name} className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">{opt.name}</p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((value) => {
                  const isActive = selectedOptions[opt.name!] === value
                  return (
                    <button
                      key={`${opt.name}-${value}`}
                      type="button"
                      onClick={() => handleSelect(opt.name!, value)}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {isRing ? (
        <RingPurchaseCard
          merchandiseId={merchandiseId}
          available={buttonAvailable}
          ringSizes={ringSizeOptions}
          sizeOptionName={sizeOptionName}
          selectedSize={currentSelectedSize}
          attributesFromParent={cartAttributes}
          onSizeSelect={handleSizeSelect}
          onRequestChange={handleRequestChange}
          onRequestSaved={() => {
            // Once custom size is saved, make sure size selection is cleared so only one path is active.
            if (sizeOptionName) {
              setSelectedOptions((prev) => {
                const next = { ...prev }
                delete next[sizeOptionName]
                return next
              })
            }
          }}
          canSubmit={selectionComplete && !!merchandiseId}
        />
      ) : (
        <AddToCartButton
          merchandiseId={merchandiseId}
          available={buttonAvailable}
          attributes={cartAttributes}
          canSubmit={selectionComplete && !!merchandiseId}
          cannotSubmitMessage="Select a size or save a size request to add to bag."
        />
      )}

      {showSelectionDetails ? (
        <div className="text-xs text-stone-400 leading-relaxed">
          <p className="font-bold uppercase tracking-[0.15em] mb-2">Selection</p>
          {selectionParts.length ? (
            <div className="flex flex-wrap gap-2 text-stone-700">
              {selectionParts.map((part) => (
                <span
                  key={part}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700"
                >
                  {part}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-stone-700 font-medium">{selectionLabel}</p>
          )}
          {requestedSizeNote ? (
            <p className="text-stone-600 mt-1">
              Requested size:{' '}
              <span className="font-medium text-stone-800">
                {requestedSizeNote}
                {sizeOptionName ? ' (custom)' : ''}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

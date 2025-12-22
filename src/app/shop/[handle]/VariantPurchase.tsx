"use client"

import React, { useMemo, useState } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { RingPurchaseCard } from './RingPurchaseCard'
import { sortNumericSizes } from '@/lib/utils'

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
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: price.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(price.amount))
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
        const nextValues = name?.toLowerCase().includes('size') ? sortNumericSizes(values) : values
        return { name, values: nextValues }
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
  const sizeOption = sizeOptionName
    ? normalizedOptions.find((opt) => normalizeName(opt.name) === normalizeName(sizeOptionName))
    : undefined
  const optionNamesWithoutSize = sizeOptionName ? optionNames.filter((n) => n !== sizeOptionName) : optionNames
  const displayOptions =
    isRing && sizeOptionName
      ? normalizedOptions.filter((opt) => normalizeName(opt.name) !== normalizeName(sizeOptionName))
      : normalizedOptions
  const ringSizeOptions = useMemo(() => {
    const merged = [...(sizeOption?.values ?? []), ...(ringSizes || [])]
    const deduped = Array.from(new Set(merged.map((v) => v.trim()).filter(Boolean)))
    return sortNumericSizes(deduped)
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
    <div className="space-y-8">
      <div className="flex justify-between items-start border-b border-stone-100 pb-6">
        <div>
          <h2 className="sr-only">Price</h2>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl text-stone-900 font-light tracking-tight">{priceLabel ?? '—'}</span>
            {compareLabel && compareLabel !== priceLabel ? (
              <span className="text-sm text-stone-400 line-through decoration-stone-300">{compareLabel}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] ${
              !selectionComplete
                ? 'bg-stone-100 text-stone-400'
                : buttonAvailable
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-stone-100 text-stone-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                !selectionComplete ? 'bg-stone-300' : buttonAvailable ? 'bg-emerald-500' : 'bg-stone-300'
              }`}
            />
            {!selectionComplete ? 'Select Options' : buttonAvailable ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
      </div>

      {hasOptions ? (
        <div className="space-y-6">
          {displayOptions.map((opt) => (
            <div key={opt.name} className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-900">{opt.name}</p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((value) => {
                  const isActive = selectedOptions[opt.name!] === value
                  return (
                    <button
                      key={`${opt.name}-${value}`}
                      type="button"
                      onClick={() => handleSelect(opt.name!, value)}
                      className={`min-w-[48px] h-12 px-4 rounded-none border text-xs font-medium transition-all duration-200 uppercase tracking-wider ${
                        isActive
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 bg-transparent text-stone-900 hover:border-stone-900'
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
        <div className="pt-2">
           <AddToCartButton
            merchandiseId={merchandiseId}
            available={buttonAvailable}
            attributes={cartAttributes}
            canSubmit={selectionComplete && !!merchandiseId}
            cannotSubmitMessage="Select a size or save a size request to add to bag."
          />
        </div>
      )}

      {showSelectionDetails ? (
        <div className="text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-6">
          <div className="flex flex-wrap gap-x-1 items-baseline">
            <span className="font-bold uppercase tracking-[0.15em] text-stone-900">Selection:</span>
            {selectionParts.length ? (
              <span className="font-medium text-stone-900">{selectionParts.join(' / ')}</span>
            ) : (
              <span className="italic text-stone-400">None</span>
            )}
          </div>
          {requestedSizeNote ? (
            <p className="text-stone-600 mt-2 bg-stone-50 p-3 text-[11px]">
              <span className="font-bold">Note:</span> Requested size{' '}
              <span className="font-medium text-stone-900">
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

"use client"

import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

type Result = {
  id: string
  title: string
  handle: string
  productType?: string | null
  description?: string | null
  image?: { url: string; altText?: string | null } | null
  price?: { amount: string; currencyCode: string } | null
}

function formatPrice(price?: { amount: string; currencyCode: string } | null) {
  if (!price) return ''
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: price.currencyCode }).format(parseFloat(price.amount))
  } catch {
    return `$${parseFloat(price.amount).toFixed(2)}`
  }
}

export function SearchLauncher() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasTyped, setHasTyped] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const searchLabelId = useId()

  useEffect(() => {
    if (open) {
      document.body.classList.add('search-open')
      const timer = setTimeout(() => inputRef.current?.focus(), 0)
      return () => {
        document.body.classList.remove('search-open')
        clearTimeout(timer)
      }
    }
    document.body.classList.remove('search-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }
    setHasTyped(true)
    setLoading(true)
    setError(null)
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal })
        if (!res.ok) throw new Error('Search failed')
        const data = await res.json()
        setResults(Array.isArray(data?.results) ? data.results : [])
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return
        setError('Unable to search right now.')
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => {
      clearTimeout(handler)
      controller.abort()
    }
  }, [query, open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const toggle = () => {
    setOpen((prev) => !prev)
    setQuery('')
    setResults([])
    setHasTyped(false)
    setError(null)
    setLoading(false)
  }

  const content = open ? (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-labelledby={searchLabelId}>
      <div className="search-backdrop" onClick={toggle} />
      <div className="search-panel" role="document">
        <header className="search-header">
          <label htmlFor="site-search" id={searchLabelId} className="search-label">Search products</label>
          <button type="button" className="search-close" onClick={toggle} aria-label="Close search">×</button>
        </header>
        <div className="search-bar">
          <input
            id="site-search"
            ref={inputRef}
            className="search-input"
            type="search"
            placeholder="Search necklaces, rings, or anything else..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="search-results" aria-live="polite">
          {loading ? (
            <p className="search-status">Searching…</p>
          ) : error ? (
            <p className="search-status">{error}</p>
          ) : !query.trim() ? (
            <p className="search-status">Start typing to find your next piece.</p>
          ) : results.length === 0 && hasTyped ? (
            <p className="search-status">No pieces found for “{query}”.</p>
          ) : (
            <ul className="search-results-list">
              {results.map((result) => (
                <li key={result.id}>
                  <Link href={`/shop/${result.handle}`} className="search-result-item" onClick={() => setOpen(false)}>
                    {result.image?.url ? (
                      <img src={result.image.url} alt={result.image.altText || ''} className="search-result-thumb" loading="lazy" />
                    ) : (
                      <div className="search-result-thumb placeholder" aria-hidden="true" />
                    )}
                    <div className="search-result-copy">
                      <span className="search-result-title">{result.title}</span>
                      <span className="search-result-meta">
                        {result.productType || 'Product'}{result.price ? ` • ${formatPrice(result.price)}` : ''}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="search-footer">
          <span>Press Esc to close</span>
          <Link href="/shop" onClick={() => setOpen(false)}>View all products</Link>
        </footer>
      </div>
    </div>
  ) : null

  return (
    <>
      <button className="nav-icon" aria-label="Search" type="button" onClick={() => setOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && typeof window !== 'undefined' ? createPortal(content, document.body) : null}
    </>
  )
}

export default SearchLauncher

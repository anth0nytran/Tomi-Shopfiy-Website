"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface QAItem { q: string; a: string }

type Category = 'General' | 'Pricing & Payment' | 'Orders & Shipping' | 'Store & Appointments'

function categorize(question: string): Category {
  const q = question.toLowerCase()
  if (q.match(/price|financ|payment|discount|sale|shop pay/)) return 'Pricing & Payment'
  if (q.match(/ship|order|gift|return|exchange|pickup/)) return 'Orders & Shipping'
  if (q.match(/where|located|appointment|parking|store/)) return 'Store & Appointments'
  return 'General'
}

export default function FAQ() {
  const [items, setItems] = useState<QAItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/faq', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const grouped = useMemo(() => {
    const term = query.trim().toLowerCase()
    const result: Record<Category, QAItem[]> = {
      'General': [],
      'Pricing & Payment': [],
      'Orders & Shipping': [],
      'Store & Appointments': [],
    }
    for (const it of items) {
      if (term && !(it.q.toLowerCase().includes(term) || it.a.toLowerCase().includes(term))) continue
      const cat = categorize(it.q)
      result[cat].push(it)
    }
    return result
  }, [items, query])

  const filteredList = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return [] as QAItem[]
    return items.filter((it) => it.q.toLowerCase().includes(term) || it.a.toLowerCase().includes(term))
  }, [items, query])

  const cats: Category[] = ['General', 'Pricing & Payment', 'Orders & Shipping', 'Store & Appointments']

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-container">
        <h2 id="faq-heading" className="faq-title">FAQ</h2>

        <label className="faq-search-label" htmlFor="faq-search">Search this page for help with:</label>
        <input
          id="faq-search"
          className="faq-search"
          placeholder={'Examples: "returns", "warranty", "repairs"'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query.trim() ? (
          <div className="faq-results">
            {loading ? (
              <p className="faq-empty">Loading…</p>
            ) : filteredList.length > 0 ? (
              filteredList.map((it, idx) => (
                <div key={idx} className="faq-result">
                  <div className="faq-q">{it.q}</div>
                  <div className="faq-a">{it.a}</div>
                </div>
              ))
            ) : (
              <p className="faq-empty">No results found</p>
            )}
          </div>
        ) : (
        cats.map((cat) => (
          <Collapsible key={cat} title={cat} className="faq-category" defaultOpen={false}>
            <div className="faq-list">
              {grouped[cat].length === 0 ? (
                <p className="faq-empty">No results.</p>
              ) : (
                grouped[cat].map((it, idx) => (
                  <Collapsible key={idx} title={it.q} className="faq-item" defaultOpen={false}>
                    <div className="faq-a">{it.a}</div>
                  </Collapsible>
                ))
              )}
            </div>
          </Collapsible>
        ))
        )}
      </div>
    </section>
  )
}

function Collapsible({
  title,
  children,
  className,
  defaultOpen = false,
}: {
  title: React.ReactNode
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const update = () => setHeight(open ? el.scrollHeight : 0)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [open])

  return (
    <div className={['faq-collapsible', open ? 'open' : '', className || ''].join(' ')}>
      <button type="button" className="faq-trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="faq-trigger-title">{title}</span>
        <svg className="faq-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="faq-content" style={{ height }}>
        <div ref={innerRef} className="faq-inner">
          {children}
        </div>
      </div>
    </div>
  )
}

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

  const cats: Category[] = ['General', 'Pricing & Payment', 'Orders & Shipping', 'Store & Appointments']

  return (
    <section className="py-20 md:py-32 bg-white border-t border-stone-100">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl text-stone-900 mb-6">Common Questions</h2>
          
          <div className="relative max-w-md mx-auto">
            <input
              className="w-full bg-[#F9F8F6] border border-transparent p-4 pl-12 text-stone-900 focus:outline-none focus:bg-white focus:border-stone-300 transition-all text-sm rounded-sm"
              placeholder='Search "returns", "warranty", "repairs"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="space-y-12">
          {loading ? (
            <p className="text-center text-stone-400 text-sm tracking-widest uppercase">Loading...</p>
          ) : query.trim() ? (
            // Search Results Flat List
            <div className="space-y-4">
               {Object.values(grouped).flat().length > 0 ? (
                 Object.values(grouped).flat().map((it, idx) => (
                   <div key={idx} className="border-b border-stone-100 pb-6 last:border-0">
                     <h4 className="font-medium text-stone-900 mb-2">{it.q}</h4>
                     <p className="text-stone-600 font-light leading-relaxed">{it.a}</p>
                   </div>
                 ))
               ) : (
                 <p className="text-center text-stone-500">No results found.</p>
               )}
            </div>
          ) : (
            // Categorized List
            cats.map((cat) => {
              const catItems = grouped[cat]
              if (catItems.length === 0) return null
              return (
                <div key={cat} className="space-y-6">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400 border-b border-stone-100 pb-2">
                    {cat}
                  </h3>
                  <div className="space-y-4">
                    {catItems.map((it, idx) => (
                      <Collapsible key={idx} title={it.q}>
                        <p className="text-stone-600 font-light leading-relaxed text-sm md:text-base">
                          {it.a}
                        </p>
                      </Collapsible>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

function Collapsible({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!innerRef.current) return
    setHeight(open ? innerRef.current.scrollHeight : 0)
  }, [open])

  return (
    <div className="border-b border-stone-100 last:border-0">
      <button 
        type="button" 
        className="w-full py-4 flex items-center justify-between text-left group" 
        onClick={() => setOpen(!open)}
      >
        <span className="text-stone-900 font-medium group-hover:text-stone-600 transition-colors text-base md:text-lg pr-4">
          {title}
        </span>
        <span className={`text-stone-400 text-xl font-light transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div 
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: `${height}px` }}
      >
        <div ref={innerRef} className="pb-6 pr-8">
          {children}
        </div>
      </div>
    </div>
  )
}

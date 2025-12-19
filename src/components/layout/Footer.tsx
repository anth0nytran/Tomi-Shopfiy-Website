'use client'

import React, { useState } from 'react'

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

type FooterColumn = {
  title: string
  links: FooterLink[]
}

const footerColumns: FooterColumn[] = [
  {
    title: 'INFO',
    links: [
      { label: 'Account', href: '/account' },
      { label: 'Jewelry Care Guide', href: '/guide' },
      { label: 'Terms & Privacy', href: '#' },
    ],
  },
  {
    title: 'SUPPORT',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/contact#faq' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
  {
    title: 'SERVICES',
    links: [
      { label: 'Repairs', href: '/repair' },
      { label: 'Recycle', href: '/recycle' },
      { label: 'Returns', href: '/returns' },
    ],
  },
  {
    title: 'CONNECT',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/tomijewelry', external: true },
      { label: 'Pinterest', href: 'https://pin.it/1hAqAmari', external: true },
      { label: 'TikTok', href: 'https://www.tiktok.com/@tomijewelry', external: true },
    ],
  },
]

export function Footer() {
  const [openColumn, setOpenColumn] = useState<string | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false)
  const [newsletterError, setNewsletterError] = useState<string | null>(null)
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)

  const toggleColumn = (title: string) => {
    setOpenColumn((prev) => (prev === title ? null : title))
  }

  function utmFromLocation() {
    if (typeof window === 'undefined') return {}
    const sp = new URLSearchParams(window.location.search)
    return {
      utmSource: sp.get('utm_source') || '',
      utmMedium: sp.get('utm_medium') || '',
      utmCampaign: sp.get('utm_campaign') || '',
      utmTerm: sp.get('utm_term') || '',
      utmContent: sp.get('utm_content') || '',
    }
  }

  async function submitNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (newsletterSubmitting) return
    setNewsletterError(null)
    setNewsletterSuccess(false)

    const email = newsletterEmail.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterError('Please enter a valid email.')
      return
    }

    setNewsletterSubmitting(true)
    try {
      const sourcePath = typeof window !== 'undefined' ? window.location.pathname : ''
      const payload = {
        formType: 'mailing_list',
        sourcePath,
        sourceFlow: 'footer-newsletter',
        ...utmFromLocation(),
        email,
        optIn: true,
        sourcePlacement: 'footer',
      }

      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const out = await res.json().catch(() => ({}))
        throw new Error(out?.error || 'Failed to subscribe')
      }

      setNewsletterSuccess(true)
      setNewsletterEmail('')
    } catch (err: any) {
      setNewsletterError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setNewsletterSubmitting(false)
    }
  }

  return (
    <footer className="footer mt-auto flex-shrink-0" data-section-type="footer" data-anim="fade-in" data-delay="400">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-newsletter">
            <h3 className="footer-title">Join Our Mailing List</h3>
            <p className="footer-description">Sign up to be the first to know about new arrivals &amp; exclusive offers.</p>
            <form className="newsletter-form" data-newsletter-form onSubmit={submitNewsletter}>
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                className="newsletter-input"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className="newsletter-btn" disabled={newsletterSubmitting} aria-label="Subscribe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            {newsletterError && <div className="mt-2 text-xs text-red-700">{newsletterError}</div>}
            {newsletterSuccess && <div className="mt-2 text-xs text-green-700">You’re on the list.</div>}
          </div>

          <div className="footer-links">
            {footerColumns.map((column) => {
              const isOpen = openColumn === column.title
              return (
                <div key={column.title} className={`footer-column ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="footer-column-title"
                    aria-expanded={isOpen}
                    onClick={() => toggleColumn(column.title)}
                  >
                    {column.title}
                    <span className="footer-column-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
              <ul className="footer-list">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="footer-link"
                          data-link-slot={`footer-${column.title.toLowerCase()}-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
              </ul>
            </div>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

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
      { label: 'Shipping', href: '#' },
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

  const toggleColumn = (title: string) => {
    setOpenColumn((prev) => (prev === title ? null : title))
  }

  return (
    <footer className="footer" data-section-type="footer" data-anim="fade-in" data-delay="400">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-newsletter">
            <h3 className="footer-title">Join Our Mailing List</h3>
            <p className="footer-description">Sign up to be the first to know about new arrivals &amp; exclusive offers.</p>
            <form className="newsletter-form" data-newsletter-form>
              <input type="email" placeholder="ENTER EMAIL ADDRESS" className="newsletter-input" />
              <button type="submit" className="newsletter-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
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

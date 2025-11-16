import React from 'react'
import Image from 'next/image'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function VisitPage() {
  return (
    <main className="visit-main">
      <AnnouncementBar />
      <Header />

      <section className="visit-hero visit-hero--photo" data-anim="fade-in" data-delay="0">
        <Image
          src="/assets/visit us.png"
          alt="Tomi Jewelry showroom"
          fill
          priority
          sizes="100vw"
          className="visit-bg"
          style={{ objectFit: 'cover' }}
        />
        <div className="visit-info">
          <div className="visit-address">
            <h1 className="visit-title">Tomi Jewelry</h1>
            <p>2810 Riverby Rd. STE 104,</p>
            <p>Houston, Texas 77020</p>
          </div>
          <a className="visit-map" href="https://maps.google.com/?q=2810+Riverby+Rd+Suite+104,+Houston,+TX+77020" target="_blank" rel="noopener">
            <span className="visit-map-text">Open in Google Maps</span>
            <svg className="visit-map-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      <section className="visit-map-embed" aria-label="Map and directions">
        <div className="visit-map-inner">
          <div className="visit-map-frame">
            <iframe
              title="Tomi on Google Maps"
              className="visit-iframe"
              src="https://www.google.com/maps?q=2810+Riverby+Rd+Suite+104,+Houston,+TX+77020&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a className="visit-cta-map" href="https://www.google.com/maps?daddr=2810+Riverby+Rd+Suite+104,+Houston,+TX+77020" target="_blank" rel="noopener">Get directions</a>
          </div>
          <div className="visit-hours">
            <h2 className="visit-sub">Hours:</h2>
            <ul className="visit-hours-list">
              <li>Monday: 12–7 PM</li>
              <li>Tuesday: 12–7 PM</li>
              <li>Wednesday: 12–7 PM</li>
              <li>Thursday: 12–7 PM</li>
              <li>Friday: 11 AM–7 PM</li>
              <li>Saturday: 11 AM–7 PM</li>
              <li>Sunday: 11 AM–6 PM</li>
            </ul>
            <div className="visit-hours-actions">
              <a className="visit-cta" href="/contact">Book an appointment</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function RecyclePage() {
  return (
    <main className="service-main recycle-main">
      <AnnouncementBar />
      <Header />

      <section className="service-hero" aria-label="Recycle service notice" data-anim="fade-in" data-delay="0">
        <div className="service-card" data-anim="fade-in" data-delay="160">
          <div className="service-top">
            <p className="service-eyebrow">Recycle &amp; Trade-In</p>
            <span className="service-chip">Service update</span>
          </div>
          <h1 className="service-heading">Bring your pieces to the studio for recycling guidance.</h1>
          <p className="service-copy">We assess gold and heirloom pieces in person so we can verify composition, explore refinishing, or talk through trade-in credit on the spot.</p>
          <div className="service-divider" aria-hidden="true"></div>
          <ul className="service-points">
            <li>Visit us with your jewelry and a valid ID so we can authenticate materials.</li>
            <li>Review options for trade-in value, recycling, or bespoke redesign while you’re here.</li>
          </ul>
          <p className="service-subcopy">Questions about what qualifies? Our <a href="/returns">returns policy</a> outlines timelines, documentation, and the support our team can provide.</p>
          <a href="/returns" className="service-link">View returns policy</a>
        </div>
      </section>

      <Footer />
    </main>
  )
}


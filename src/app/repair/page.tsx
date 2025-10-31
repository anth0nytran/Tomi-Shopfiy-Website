import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function RepairPage() {
  return (
    <main className="service-main repair-main">
      <AnnouncementBar />
      <Header />

      <section className="service-hero" aria-label="Repair service notice" data-anim="fade-in" data-delay="0">
        <div className="service-card" data-anim="fade-in" data-delay="160">
          <div className="service-top">
            <p className="service-eyebrow">Repairs</p>
            <span className="service-chip">In-store only</span>
          </div>
          <h1 className="service-heading">Repairs are handled in our Houston studio.</h1>
          <p className="service-copy">Visit the bench with your Tomi pieces so we can inspect each one together, discuss care options, and keep your jewelry in rotation.</p>
          <div className="service-divider" aria-hidden="true"></div>
          <ul className="service-points">
            <li>Meet one-on-one with our on-site jeweler for an immediate evaluation.</li>
            <li>Bring your original purchase details or service receipt for faster intake.</li>
          </ul>
          <p className="service-subcopy">Need coverage details before you come by? Review our <a href="/returns">returns policy</a> for timelines, eligibility, and what to expect.</p>
          <a href="/returns" className="service-link">View returns policy</a>
        </div>
      </section>

      <Footer />
    </main>
  )
}

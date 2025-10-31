import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ReturnsPage() {
  return (
    <main className="returns-main">
      <AnnouncementBar />
      <Header />

      <section className="returns-hero" data-anim="fade-in" data-delay="0">
        <div className="returns-layout" data-anim="fade-in" data-delay="120">
          <div className="returns-intro" data-anim="fade-in" data-delay="120">
            <h1 className="returns-heading">returns</h1>
            <p className="returns-copy">We stand behind every product that we sell. If you aren&#39;t 100% satisfied, we’re here to help.</p>
            <p className="returns-copy">We try to make the return process as painless as possible.</p>
          </div>
          <span className="returns-divider" aria-hidden="true"></span>
          <div className="returns-details" data-anim="slide-up" data-delay="220">
            <p className="returns-eyebrow">policy overview</p>
            <h2 className="returns-subheading">refund</h2>
            <ul className="returns-list">
              <li>30 days for a full refund, 45 days for store credit.</li>
              <li>Jewelry must be in original condition without signs of damage, with proof of purchase.</li>
              <li>Earrings used during a piercing appointment cannot be returned.</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

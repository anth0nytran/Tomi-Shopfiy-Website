import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function GuidePage() {
  return (
    <main className="guide-main">
      <AnnouncementBar />
      <Header />

      <section className="guide-hero" data-anim="fade-in" data-delay="0">
        <div className="guide-layout">
          <div className="guide-mark">
            <span className="guide-mark-line">to.</span>
            <span className="guide-mark-line">mi</span>
          </div>
          <div className="guide-content">
            <h1 className="guide-heading" data-anim="fade-in" data-delay="160">jewelry care guide</h1>
            <p className="guide-intro" data-anim="fade-in" data-delay="240">
              your jewelry is made with real solid gold. it's made to last and designed for everyday wear,
              but requires a little love to stay looking brand new.
            </p>
            <h2 className="guide-section-title" data-anim="fade-in" data-delay="320">our tips</h2>
            <ul className="guide-list" data-anim="slide-up" data-delay="400">
              <li className="guide-list-item guide-list-item--split">
                <span>to clean: soak in warm water + dish soap,</span>
                <span className="guide-list-continuation">gently brush with a soft toothbrush, and</span>
                <span className="guide-list-continuation">pat dry with a soft cloth</span>
              </li>
              <li className="guide-list-item">wear it often</li>
              <li className="guide-list-item">store in a dry pouch or box</li>
              <li className="guide-list-item">avoid salt water, chlorine, sweat, and harsh chemicals (e.g., perfume or lotion)</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

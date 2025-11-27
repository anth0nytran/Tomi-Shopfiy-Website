import React from 'react'
import Link from 'next/link'

export function MissionBanner() {
  return (
    <section id="mission" className="section section--mission" data-section-type="mission" data-anim="fade-in" data-delay="0">
      <div className="mission-banner" data-anim="fade-in" data-delay="100" style={{ backgroundImage: 'url(/assets/events.JPG)' }}>
        <div className="mission-banner-content" data-anim="slide-up" data-delay="200">
          <h2 className="mission-banner-title">events at tomi</h2>
          <Link href="/events" className="btn mission-banner-cta" data-link-slot="mission-cta">
            be in the know
          </Link>
        </div>
      </div>
    </section>
  )
}

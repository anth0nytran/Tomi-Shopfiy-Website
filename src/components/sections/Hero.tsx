import React from 'react'
import Link from 'next/link'

export function Hero() {
  return (
    <section id="hero" className="section section--hero" data-section-type="hero" data-anim="fade-in" data-delay="0">
      <div className="hero-frame">
        <div className="hero-background" data-anim="scale-in" data-delay="80">
          <video
            className="hero-bg-video"
            src="/tomi landing page update - LNY.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title" data-anim="slide-up" data-delay="200">
            <span className="hero-title-line">gift good fortune</span>
          </h1>
          <p className="hero-subtitle" data-anim="slide-up" data-delay="400">this Lunar New Year with our best-selling jade pieces</p>
          <Link href="/shop/category/new-arrivals" className="btn btn--primary" data-anim="slide-up" data-delay="600">
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  )
}

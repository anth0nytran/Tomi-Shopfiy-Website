import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <main className="about-main">
      <AnnouncementBar />
      <Header />

      <section className="about-hero" data-anim="fade-in" data-delay="0">
        <div className="about-hero-inner">
          <div className="about-hero-top">
            <p className="about-hero-intro about-hero-intro--left" data-anim="slide-left" data-delay="120">We believe in affordable gold jewelry</p>
            <span className="about-hero-divider" aria-hidden="true"></span>
            <p className="about-hero-intro about-hero-intro--right" data-anim="slide-right" data-delay="200">and we are making it happen in Houston.</p>
          </div>

          <div className="about-hero-copy" data-anim="fade-in" data-delay="320">
            <p>At tomi, we believe that fine jewelry should be both timeless and attainable. Our mission is to create gold jewelry that honors sustainable practices, responsible sourcing, and craftsmanship that lasts for generations-all at an accessible price point.</p>
            <p>We don't chase fast-moving trends. Instead, we design pieces that are unique, versatile, and meant to become part of your personal story-treasures you'll cherish today and pass on tomorrow. Each piece is thoughtfully crafted with care for the planet, using responsibly sourced materials and ethical production methods.</p>
            <p>By rethinking what luxury means, we make quality gold jewelry available without the traditional markups. The result? Jewelry that's affordable, meaningful, and enduring-made to shine for this generation and the next.</p>
          </div>

          <p className="about-hero-tagline" data-anim="slide-up" data-delay="480">today's gem, tomorrow's gift</p>
        </div>
      </section>

      <section className="about-photo" aria-label="About tomi">
        <div className="about-photo-frame" data-anim="fade-in" data-delay="200">
          <Image
            src="/assets/about%20us.jpg"
            alt="Inside Tomi studio — craftsmanship and gold jewelry"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 92vw"
            className="about-photo-img"
          />
        </div>
      </section>

      <section className="about-editorial" aria-labelledby="about-editorial-heading">
        <div className="about-editorial-inner">
          <h2 id="about-editorial-heading" className="sr-only">Our philosophy</h2>
          <div className="about-columns">
            <p className="about-lead">
              At tomi, we believe that fine jewelry should be both timeless and attainable. Our mission is to create gold jewelry that honors sustainable practices, responsible sourcing, and craftsmanship that lasts for generations—all at an accessible price point.
            </p>
            <p>
              We don't chase fast‑moving trends. Instead, we design pieces that are unique, versatile, and meant to become part of your personal story—treasures you'll cherish today and pass on tomorrow. Each piece is thoughtfully crafted with care for the planet, using responsibly sourced materials and ethical production methods.
            </p>
            <p>
              By rethinking what luxury means, we make quality gold jewelry available without the traditional markups. The result? Jewelry that's affordable, meaningful, and enduring—made to shine for this generation and the next.
            </p>
          </div>
        </div>
      </section>

      <section className="about-quote" aria-label="brand quote">
        <div className="about-quote-inner">
          <blockquote>
            <p>“Thoughtfully made. Fairly priced. Meant to be worn—and loved—every day.”</p>
          </blockquote>
        </div>
      </section>

      <section className="about-pillars" aria-labelledby="about-pillars-heading">
        <h2 id="about-pillars-heading" className="sr-only">What guides us</h2>
        <div className="about-pillars-grid">
          <div className="pillar">
            <div className="pillar-icon" aria-hidden></div>
            <h3 className="pillar-title">Responsible sourcing</h3>
            <p className="pillar-desc">We partner with trusted suppliers and prioritize transparency across our materials.</p>
          </div>
          <div className="pillar">
            <div className="pillar-icon" aria-hidden></div>
            <h3 className="pillar-title">Ethical production</h3>
            <p className="pillar-desc">Every piece is made with care, respecting the people and processes behind it.</p>
          </div>
          <div className="pillar">
            <div className="pillar-icon" aria-hidden></div>
            <h3 className="pillar-title">Accessible pricing</h3>
            <p className="pillar-desc">No traditional markups—just quality gold jewelry designed to last.</p>
          </div>
        </div>
      </section>

      <section className="about-cta" aria-label="call to action">
        <div className="about-cta-inner">
          <p className="about-cta-text">See it. Feel it. Love it.</p>
          <a href="/visit" className="about-cta-btn">Visit us</a>
        </div>
      </section>

      <Footer />
    </main>
  )
}

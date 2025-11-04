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

      <section className="about-hero" data-anim="fade-in" data-delay="0">
        <div className="about-hero-inner">

          <div className="about-hero-copy" data-anim="fade-in" data-delay="320">
            <p>At tomi, we believe that fine jewelry should be both timeless and attainable. Our mission is to create gold jewelry that honors sustainable practices, responsible sourcing, and craftsmanship that lasts for generations-all at an accessible price point.</p>
            <p>We don&#39;t chase fast-moving trends. Instead, we design pieces that are unique, versatile, and meant to become part of your personal story-treasures you&#39;ll cherish today and pass on tomorrow. Each piece is thoughtfully crafted with care for the planet, using responsibly sourced materials and ethical production methods.</p>
            <p>By rethinking what luxury means, we make quality gold jewelry available without the traditional markups. The result? Jewelry that&#39;s affordable, meaningful, and enduring-made to shine for this generation and the next.</p>
          </div>

          <p className="about-hero-tagline" data-anim="slide-up" data-delay="480">today&#39;s gem, tomorrow&#39;s gift</p>
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

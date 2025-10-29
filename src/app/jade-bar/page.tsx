import React from 'react'
import Image from 'next/image'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function JadeBarPage() {
  return (
    <main className="jade-main">
      <AnnouncementBar />
      <Header />

      <section className="jade-hero" aria-labelledby="jade-heading">
        <div className="jade-hero-inner">
          <div className="jade-hero-head">
            <p className="jade-overline">Houston&#39;s first ever customizable</p>
            <h1 id="jade-heading" className="jade-title">Jade Bar</h1>
            <p className="jade-subtitle">why we wear jade</p>
          </div>
        </div>
        <div className="jade-hero-banner" aria-hidden>
          <Image src="/assets/jade%20bar.jpg" alt="Jade Bar" fill priority sizes="100vw" className="jade-hero-banner-img" />
        </div>
        <div className="jade-hero-strip" aria-label="why we wear jade">
          <div className="jade-strip">
            <div className="jade-strip-item">
              <span className="jade-strip-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" stroke="currentColor" strokeWidth="1.6"/></svg>
              </span>
              <div className="jade-strip-text">
                <span className="jade-strip-title">for protection</span>
                <span className="jade-strip-desc">ward off negativity</span>
              </div>
            </div>
            <div className="jade-strip-item">
              <span className="jade-strip-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21c4-3 7-6 7-10a7 7 0 10-14 0c0 4 3 7 7 10z" stroke="currentColor" strokeWidth="1.6"/></svg>
              </span>
              <div className="jade-strip-text">
                <span className="jade-strip-title">for health</span>
                <span className="jade-strip-desc">balance & vitality</span>
              </div>
            </div>
            <div className="jade-strip-item">
              <span className="jade-strip-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 17l-5 3 2-5-4-3 5-1 2-5 2 5 5 1-4 3 2 5-5-3z" stroke="currentColor" strokeWidth="1.6"/></svg>
              </span>
              <div className="jade-strip-text">
                <span className="jade-strip-title">for good luck</span>
                <span className="jade-strip-desc">invite prosperity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="jade-how" aria-labelledby="how-heading">
        <div className="jade-how-inner">
          <h2 id="how-heading" className="jade-section-title">How it works</h2>
          <ol className="jade-steps">
            <li className="jade-step">
              <div className="jade-step-num">1</div>
              <div className="jade-step-figure" aria-hidden></div>
              <h3 className="jade-step-title">Make an appointment</h3>
              <p className="jade-step-desc">Visit our Jade Bar and create your own piece.</p>
            </li>
            <li className="jade-step">
              <div className="jade-step-num">2</div>
              <div className="jade-step-figure" aria-hidden></div>
              <h3 className="jade-step-title">Show up</h3>
              <p className="jade-step-desc">On-time and ready to customize with our team.</p>
            </li>
            <li className="jade-step">
              <div className="jade-step-num">3</div>
              <div className="jade-step-figure" aria-hidden></div>
              <h3 className="jade-step-title">Customize</h3>
              <p className="jade-step-desc">Choose your grade‑A jade, donut, chain or satin cord.</p>
            </li>
            <li className="jade-step">
              <div className="jade-step-num">4</div>
              <div className="jade-step-figure" aria-hidden></div>
              <h3 className="jade-step-title">Show off</h3>
              <p className="jade-step-desc">Wear your new custom jade piece the same day.</p>
            </li>
          </ol>
        </div>
      </section>

      

      <section className="jade-source" aria-labelledby="source-heading">
        <div className="jade-source-inner">
          <div className="jade-source-grid">
            <div className="jade-source-copy">
              <h2 id="source-heading" className="jade-section-title">Where we source our jade</h2>
              <p className="jade-source-lede">At tomi, we believe jade should be celebrated in its purest and most authentic form. That’s why we carefully source our jade directly from trusted suppliers in Myanmar (Burma) and select regions in Asia renowned for producing the world’s finest jadeite. Every piece is hand‑selected for its natural beauty, durability, and cultural significance.</p>
              <div className="jade-source-chips" aria-label="regions">
                <span className="jade-chip">Myanmar (Burma)</span>
                <span className="jade-chip">Select regions in Asia</span>
                <span className="jade-chip">Trusted suppliers</span>
              </div>
            </div>
            <div className="jade-source-visual" aria-hidden>
              <div className="jade-source-map"></div>
            </div>
          </div>

          <div className="jade-grades" aria-label="jade grades">
            <div className="jade-grade jade-grade--a">
              <div className="jade-grade-head">
                <span className="jade-grade-badge">Grade A</span>
                <span className="jade-grade-only">we only sell this</span>
              </div>
              <p className="jade-grade-desc">100% natural jadeite, untreated and free from chemical enhancements. May be wax‑polished for shine but has no dyes or resin coatings. This is the highest standard of jade available.</p>
            </div>
            <div className="jade-grade jade-grade--b">
              <div className="jade-grade-head">
                <span className="jade-grade-badge">Grade B</span>
              </div>
              <p className="jade-grade-desc">Chemically bleached and polymer‑filled to improve color and translucency. Less durable and considered lower quality.</p>
            </div>
            <div className="jade-grade jade-grade--c">
              <div className="jade-grade-head">
                <span className="jade-grade-badge">Grade C</span>
              </div>
              <p className="jade-grade-desc">Dyed to enhance color. Over time, color can fade and the stone can lose integrity.</p>
            </div>
          </div>

          <p className="jade-promise">Our commitment is simple: we only offer <strong>Grade A Jade</strong>, ensuring each piece you purchase is natural, untreated, and crafted to last for generations.</p>
        </div>
      </section>

      <section className="jade-process" aria-labelledby="process-heading">
        <div className="jade-process-inner">
          <p className="process-eyebrow">Jade to be yours.</p>
          <h2 id="process-heading" className="process-title">The process</h2>
          <p className="process-subtitle">A four‑step journey to your custom jade.</p>

          <div className="jade-process-grid">
            <div className="jade-process-row">
              <span className="process-node" aria-hidden></span>
              <div className="process-step process-step--right" data-anim="slide-right">
                <h3 className="process-step-title">Select your jade</h3>
                <p className="process-step-desc">With colors ranging from green to white, and yellow to lavender.</p>
              </div>
            </div>

            <div className="jade-process-row">
              <span className="process-node" aria-hidden></span>
              <div className="process-step process-step--left" data-anim="slide-left">
                <h3 className="process-step-title">Choose between your own chain, a satin cord, or one of our 14k solid gold chains</h3>
              </div>
            </div>

            <div className="jade-process-row">
              <span className="process-node" aria-hidden></span>
              <div className="process-step process-step--right" data-anim="slide-right">
                <h3 className="process-step-title">To bail or not to bail</h3>
                <p className="process-step-desc">A white‑gold or yellow‑gold bail to hold your jade donut flat and add a bit more shine to your piece.</p>
              </div>
            </div>

            <div className="jade-process-row">
              <span className="process-node" aria-hidden></span>
              <div className="process-step process-step--left" data-anim="slide-left">
                <h3 className="process-step-title">Watch it get made</h3>
                <p className="process-step-desc">We can create your jade piece in‑store in under 15 minutes. Pre‑ordered items are processed separately and are case‑by‑case.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

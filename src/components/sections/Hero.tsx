import React from 'react'

export function Hero() {
  return (
    <section id="hero" className="section section--hero" data-section-type="hero" data-anim="fade-in" data-delay="0">
      <div className="hero-frame">
        <div className="hero-background" data-anim="scale-in" data-delay="80">
          <video
            className="hero-bg-video"
            src="/assets/homepage video.mov"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title" data-anim="slide-up" data-delay="200">
            <span className="hero-title-line">today&#39;s gem,</span>
            <span className="hero-title-line">tomorrow&#39;s gift</span>
          </h1>
          <p className="hero-subtitle" data-anim="slide-up" data-delay="400">solid gold jewelry that shines best on you</p>
          <a href="#categories" className="btn btn--primary" data-anim="slide-up" data-delay="600">SHOP NOW</a>
        </div>
      </div>
    </section>
  )
}

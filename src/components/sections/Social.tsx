import React from 'react'

export function Social() {
  return (
    <section id="social" className="section section--social" data-section-type="social" data-anim="fade-in" data-delay="0">
      <div className="container">
        <div className="social-grid">
          <div className="social-left">
            <div className="social-item" data-anim="slide-left" data-delay="0"><img src="/assets/social_pic1.png" alt="social 1" className="social-img" /></div>
            <div className="social-item" data-anim="slide-left" data-delay="120"><img src="/assets/social_pic2.png" alt="social 2" className="social-img" /></div>
            <div className="social-item" data-anim="slide-left" data-delay="240"><img src="/assets/social_pic3.png" alt="social 3" className="social-img" /></div>
          </div>
          <div className="social-right">
            <div className="social-item" data-anim="slide-right" data-delay="180"><img src="/assets/social_pic1.png" alt="social 4" className="social-img" /></div>
            <div className="social-item" data-anim="slide-right" data-delay="300"><img src="/assets/social_pic2.png" alt="social 5" className="social-img" /></div>
          </div>
        </div>
        <p className="social-cta" aria-label="we love @tomijewelry on you">
          <span className="typing">we love @tomijewelry on you</span>
        </p>
      </div>
    </section>
  )
}

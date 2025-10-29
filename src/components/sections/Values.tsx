import React from 'react'
import Image from 'next/image'

export function Values() {
  return (
    <section id="values" className="section section--values" data-section-type="values" data-anim="fade-in" data-delay="0">
      <div className="container">
        <div className="values-grid">
          <h3 className="values-heading"><span className="values-line">because you deserve luxury</span><span className="values-line">without the high price tag</span></h3>

          <div className="value-item" data-anim="fade-in" data-delay="100">
            <div className="value-icon" aria-hidden="true">
              <Image src="/assets/gem icon background removed.png" alt="Gem icon" className="value-icon-img" width={80} height={80} />
            </div>
            <p className="value-text">we only sell<br/><strong>solid gold</strong></p>
          </div>

          <div className="value-item" data-anim="fade-in" data-delay="200">
            <div className="value-icon" aria-hidden="true">
              <Image src="/assets/repair icon Background Removed.png" alt="Repair icon" className="value-icon-img" width={80} height={80} />
            </div>
            <p className="value-text">we offer <strong>lifetime warranty</strong><br/>for all pieces</p>
          </div>

          <div className="value-item" data-anim="fade-in" data-delay="300">
            <div className="value-icon" aria-hidden="true">
              <Image src="/assets/locket icon Background Removed.png" alt="Gem icon" className="value-icon-img" width={80} height={80} />
            </div>
            <p className="value-text">we focus on <strong>timeless designs</strong>,<br/>not microtrends</p>
          </div>
        </div>
      </div>
    </section>
  )
}

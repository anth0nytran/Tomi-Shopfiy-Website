import React from 'react'

export function Vintage() {
  return (
    <section id="vintage" className="section section--vintage" data-section-type="vintage" data-anim="fade-in" data-delay="0">
      <div className="container vintage-collection">
        <aside className="vintage-aside" data-anim="slide-left" data-delay="80">
          <h2 className="vintage-title">add your story<br/>to a vintage piece</h2>
          <a href="#" className="vintage-link" aria-label="Shop our vintage collection">shop the collection</a>
        </aside>
        <div className="vintage-media" data-anim="fade-in" data-delay="120">
          <figure className="vintage-media-item"><img src="/assets/product_ph1.png" alt="Vintage piece 1" /></figure>
          <figure className="vintage-media-item"><img src="/assets/product_ph1.png" alt="Vintage piece 2" /></figure>
          <figure className="vintage-media-item"><img src="/assets/product_ph3.jpg" alt="Vintage piece 3" /></figure>
          <figure className="vintage-media-item"><img src="/assets/product_ph4.jpeg" alt="Vintage piece 4" /></figure>
        </div>
      </div>
    </section>
  )
}

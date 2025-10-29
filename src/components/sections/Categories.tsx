import React from 'react'
import Image from 'next/image'

export function Categories() {
  return (
    <section id="categories" className="section section--categories" data-section-type="categories" data-anim="fade-in" data-delay="0">
      <div className="container-full">
        <div className="categories-showcase">
          <a href="#" className="category-showcase-item" data-hoverable data-anim="fade-in" data-delay="100" data-link-slot="category-1">
            <div className="category-showcase-image">
              <Image src="/assets/4.png" alt="Gold bracelet with diamonds" className="category-showcase-img" width={1200} height={1200} />
            </div>
            <h3 className="category-showcase-title">BRACELETS</h3>
          </a>
          <a href="#" className="category-showcase-item" data-hoverable data-anim="fade-in" data-delay="200" data-link-slot="category-2">
            <div className="category-showcase-image">
              <Image src="/assets/6.png" alt="Gold sculptural earrings" className="category-showcase-img" width={1200} height={1200} />
            </div>
            <h3 className="category-showcase-title">EARRINGS</h3>
          </a>
          <a href="#" className="category-showcase-item" data-hoverable data-anim="fade-in" data-delay="300" data-link-slot="category-3">
            <div className="category-showcase-image">
              <Image src="/assets/7.png" alt="Gold ring with diamond" className="category-showcase-img" width={1200} height={1200} />
            </div>
            <h3 className="category-showcase-title">RINGS</h3>
          </a>
          <a href="#" className="category-showcase-item" data-hoverable data-anim="fade-in" data-delay="400" data-link-slot="category-4">
            <div className="category-showcase-image">
              <Image src="/assets/5.png" alt="Gold necklace" className="category-showcase-img" width={1200} height={1200} />
            </div>
            <h3 className="category-showcase-title">NECKLACES</h3>
          </a>
        </div>
      </div>
    </section>
  )
}

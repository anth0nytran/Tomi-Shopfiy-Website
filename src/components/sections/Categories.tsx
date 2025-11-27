import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const CATEGORY_LINKS = [
  { label: 'BRACELETS', href: '/shop/category/bracelets', image: '/assets/1.png', alt: 'Gold bracelet with diamonds' },
  { label: 'EARRINGS', href: '/shop/category/earrings', image: '/assets/2.png', alt: 'Gold sculptural earrings' },
  { label: 'RINGS', href: '/shop/category/rings', image: '/assets/3.png', alt: 'Gold ring with diamond' },
  { label: 'NECKLACES', href: '/shop/category/necklaces', image: '/assets/4.png', alt: 'Gold necklace' },
]

export function Categories() {
  return (
    <section id="categories" className="section section--categories" data-section-type="categories" data-anim="fade-in" data-delay="0">
      <div className="container-full">
        <div className="categories-showcase">
          {CATEGORY_LINKS.map((category, index) => (
            <Link
              key={category.label}
              href={category.href}
              className="category-showcase-item"
              data-hoverable
              data-anim="fade-in"
              data-delay={`${(index + 1) * 100}`}
              data-link-slot={`category-${index + 1}`}
            >
              <div className="category-showcase-image">
                <Image src={category.image} alt={category.alt} className="category-showcase-img" width={1200} height={1200} />
              </div>
              <h3 className="category-showcase-title">{category.label}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

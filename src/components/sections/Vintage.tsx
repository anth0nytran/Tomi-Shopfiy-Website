"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function Vintage() {
  const images = [
    { src: '/assets/product_ph1.png', alt: 'Vintage piece 1' },
    { src: '/assets/product_ph1.png', alt: 'Vintage piece 2' },
    { src: '/assets/product_ph3.jpg', alt: 'Vintage piece 3' },
    { src: '/assets/product_ph4.jpeg', alt: 'Vintage piece 4' },
  ]
  const [index, setIndex] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    // Elegant, low-motion cycle
    const tick = () => setIndex((i) => (i + 1) % images.length)
    timer.current = window.setInterval(tick, 3500)
    return () => { if (timer.current) window.clearInterval(timer.current) }
  }, [images.length])

  return (
    <section id="vintage" className="section section--vintage-collage" data-section-type="vintage" data-anim="fade-in" data-delay="0">
      <div className="container vintage-collage">
        <aside className="vintage-aside" data-anim="slide-left" data-delay="80">
          <h2 className="vintage-title">
            <span className="vintage-title-line">add your story</span>
            <span className="vintage-title-line">to a vintage piece</span>
          </h2>
          <Link href="/shop/category/one-of-a-kind-vintage" className="vintage-link" aria-label="Shop our vintage collection">
            shop the collection
          </Link>
        </aside>

        <div className="vintage-canvas" aria-live="polite">
          {images.map((img, i) => (
            <figure key={i} className={`vintage-slide${i === index ? ' is-active' : ''}`} aria-hidden={i !== index}>
              <Image src={img.src} alt={img.alt} width={800} height={800} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

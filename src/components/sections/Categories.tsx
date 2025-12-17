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
    <section id="categories" className="w-full bg-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full border-t border-white">
          {CATEGORY_LINKS.map((category, index) => (
            <Link
              key={category.label}
              href={category.href}
            className={`group relative flex flex-col h-[70vh] min-h-[500px] border-white ${
              index !== CATEGORY_LINKS.length - 1 ? 'md:border-r' : ''
            } border-b md:border-b-0`}
          >
            {/* Image Area - Dark Green Background */}
            <div className="flex-1 relative bg-primary w-full overflow-hidden flex items-center justify-center">
              <div className={`relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${category.label === 'NECKLACES' ? '-mt-12 scale-110' : 'p-6 xl:p-12'}`}>
                <Image 
                  src={category.image} 
                  alt={category.alt} 
                  fill
                  className={`object-contain ${category.label === 'NECKLACES' ? 'object-top' : 'object-center'}`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
              </div>
            </div>
            
            {/* Bottom Label - White Bar */}
            <div className="h-14 bg-white flex items-center justify-center border-t border-white relative z-10">
              <span className="text-sm font-medium tracking-[0.15em] text-stone-900 uppercase border-b border-transparent group-hover:border-stone-900 transition-colors duration-300">
                {category.label}
              </span>
            </div>
            </Link>
          ))}
      </div>
    </section>
  )
}

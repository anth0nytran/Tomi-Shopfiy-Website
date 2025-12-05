import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const CATEGORY_LINKS = [
  { label: 'Bracelets', href: '/shop/category/bracelets', image: '/assets/1.png', alt: 'Gold bracelet with diamonds', count: '12 styles' },
  { label: 'Earrings', href: '/shop/category/earrings', image: '/assets/2.png', alt: 'Gold sculptural earrings', count: '18 styles' },
  { label: 'Rings', href: '/shop/category/rings', image: '/assets/3.png', alt: 'Gold ring with diamond', count: '24 styles' },
  { label: 'Necklaces', href: '/shop/category/necklaces', image: '/assets/4.png', alt: 'Gold necklace', count: '15 styles' },
]

export function Categories() {
  return (
    <section id="categories" className="pt-8 md:pt-12 pb-0 bg-[#F9F8F6] w-full">
      <div className="w-full px-4 md:px-8 mb-12">
        {/* Refined Header - Minimalist Editorial Style */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-stone-200 pb-8">
          <div className="max-w-xl">
            <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-stone-400 mb-4 pl-1">
              Curated Selection
            </span>
            <h2 className="font-heading text-5xl md:text-7xl text-stone-900 leading-[0.9]">
              Categories
            </h2>
          </div>
          <p className="text-stone-500 font-light text-sm tracking-wide max-w-xs leading-relaxed text-right md:text-right md:ml-auto hidden md:block">
            Designed to be cherished.<br/>Made to last forever.
          </p>
        </div>
      </div>
      
      <div className="w-full px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {CATEGORY_LINKS.map((category, index) => (
            <Link
              key={category.label}
              href={category.href}
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              {/* Image with Scale Effect */}
              <div className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-110 will-change-transform">
                <Image 
                  src={category.image} 
                  alt={category.alt} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              
              {/* Subtle Overlay - darkens slightly on hover */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
              
              {/* Content - Clean Minimalist Label */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                {/* Top Number/Index - small nice detail */}
                <span className="text-white/60 text-[10px] font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-y-2 group-hover:translate-y-0">
                  0{index + 1}
                </span>

                <div className="relative">
                  <h3 className="font-heading text-4xl md:text-5xl text-white font-medium tracking-wide drop-shadow-sm translate-y-0 transition-transform duration-500 group-hover:-translate-y-2">
                    {category.label}
                  </h3>
                  
                  {/* Underline Animation - Simple white line expands */}
                  <div className="h-[1px] bg-white/80 w-0 group-hover:w-full transition-all duration-500 ease-out mt-2" />
                  
                  {/* Dynamic Shop Text */}
                  <p className="absolute top-full left-0 mt-3 text-xs text-white/90 tracking-[0.2em] uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75 font-medium">
                    Shop {category.label}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import Image from 'next/image'
import React, { useMemo, useState } from 'react'

type GalleryImage = {
  url: string
  altText?: string | null
}

type Props = {
  images: GalleryImage[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const safeImages = useMemo(
    () => (images && images.length ? images : [{ url: '', altText: title }]),
    [images, title]
  )
  const [selected, setSelected] = useState(0)
  const current = safeImages[selected] || safeImages[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-square bg-stone-100 overflow-hidden">
        {current?.url ? (
          <Image
            src={current.url}
            alt={current.altText || title}
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-flow-col auto-cols-[80px] md:auto-cols-[96px] gap-3 overflow-x-auto pb-2">
          {safeImages.map((img, idx) => {
            const isActive = idx === selected
            return (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => setSelected(idx)}
                className={`relative aspect-square bg-stone-100 overflow-hidden border ${
                  isActive ? 'border-stone-900' : 'border-transparent hover:border-stone-300'
                } transition-colors`}
                aria-label={`View image ${idx + 1}`}
              >
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.altText || title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-stone-300 text-xs">
                    No Image
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}


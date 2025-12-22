"use client"

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export function BackToShop({ defaultHref = '/shop' }: { defaultHref?: string }) {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo')
  
  const href = returnTo || defaultHref

  return (
    <Link 
      href={href} 
      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 transition-colors mb-12"
    >
      <ChevronLeft className="w-3 h-3" />
      Back to shop
    </Link>
  )
}


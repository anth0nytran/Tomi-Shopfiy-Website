'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-[#2f4338]/10 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-[#2f4338]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-light text-stone-800 mb-3">
          Thank You for Your Order
        </h1>

        {orderNumber && (
          <p className="text-stone-600 mb-2">
            Order #{orderNumber}
          </p>
        )}

        <p className="text-stone-500 font-light mb-8 leading-relaxed">
          We&apos;ve received your order and will begin preparing it right away. 
          You&apos;ll receive an email confirmation shortly with tracking details.
        </p>

        <div className="space-y-3">
          <Link
            href="/shop"
            className="inline-block w-full px-6 py-3 bg-[#2f4338] text-white rounded-full text-sm tracking-wider uppercase hover:bg-[#3d5647] transition-colors"
          >
            Continue Shopping
          </Link>
          
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 border border-stone-300 text-stone-600 rounded-full text-sm tracking-wider uppercase hover:border-stone-400 transition-colors"
          >
            Return Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-stone-400">
          Questions? <a href="/contact" className="underline hover:text-stone-600">Contact us</a>
        </p>
      </div>
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-stone-400">Loading...</div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  )
}


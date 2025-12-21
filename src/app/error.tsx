'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="inline-block w-16 h-16 rounded-full bg-[#efdada] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <h1 className="font-heading text-3xl md:text-4xl text-stone-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-stone-500 font-light mb-8">
            We hit an unexpected issue. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-8 py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-4 border border-stone-200 text-stone-900 text-xs font-bold uppercase tracking-[0.2em] hover:border-stone-400 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}


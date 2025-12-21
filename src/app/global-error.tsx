'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#fff' }}>
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1c1917' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#78716c', marginBottom: '2rem' }}>
              We hit an unexpected issue. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#1c1917',
                color: '#fff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}


"use client"
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export function AccountLink() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams?.toString()
  const current = query ? `${pathname}?${query}` : pathname
  const href = `/account?callbackUrl=${encodeURIComponent(current)}`

  return (
    <Link className="nav-icon" aria-label="Account" href={href} prefetch>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  )
}



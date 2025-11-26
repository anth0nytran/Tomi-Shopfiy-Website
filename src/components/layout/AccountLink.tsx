"use client"
import Link from 'next/link'
import React from 'react'

type AccountLinkProps = {
  enabled: boolean
  isLoggedIn: boolean
}

export function AccountLink({ enabled, isLoggedIn }: AccountLinkProps) {
  if (!enabled) {
    return (
      <button
        className="nav-icon nav-icon--disabled"
        aria-label="Account (Unavailable)"
        aria-disabled="true"
        title="Customer accounts are disabled"
        disabled
        style={{ opacity: 0.5, cursor: 'not-allowed' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }

  const label = isLoggedIn ? 'View account' : 'Sign in to your account'
  const href = isLoggedIn ? '/account' : '/api/auth/shopify/login?returnTo=/account'

  return (
    <Link className="nav-icon" href={href} aria-label={label} title={label}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {isLoggedIn ? <span className="sr-only">Account</span> : <span className="sr-only">Sign in</span>}
    </Link>
  )
}

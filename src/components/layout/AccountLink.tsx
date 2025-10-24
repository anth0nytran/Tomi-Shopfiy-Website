"use client"
import React from 'react'

export function AccountLink() {
  return (
    <button className="nav-icon nav-icon--disabled" aria-label="Account (Coming Soon)" aria-disabled="true" title="Accounts coming soon" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}



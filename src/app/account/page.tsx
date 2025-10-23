"use client"
import React, { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await signIn('credentials', { email, password, redirect: false, callbackUrl })
    if (res?.error) setError('Invalid email or password')
    else if (res?.ok) window.location.href = callbackUrl
  }

  if (status === 'loading') return null

  if (session?.shopify?.accessToken) {
    return (
      <main className="about-main">
        <section className="about-hero" aria-label="Account">
          <div className="about-hero-inner">
            <p className="about-hero-intro">Welcome back</p>
            <p className="about-hero-tagline">{(session as any).user?.email}</p>
            <button className="about-cta-btn" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="about-main">
      <section className="about-hero" aria-label="Sign in">
        <div className="about-hero-inner" style={{ maxWidth: 520 }}>
          <p className="about-hero-intro">Sign in to your account</p>
          <form onSubmit={onSubmit} style={{ width: '100%', display: 'grid', gap: '0.75rem' }}>
            <input
              className="contact-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="contact-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: '#b00020', margin: 0 }}>{error}</p>}
            <button className="about-cta-btn" type="submit">Sign in</button>
          </form>
        </div>
      </section>
    </main>
  )
}



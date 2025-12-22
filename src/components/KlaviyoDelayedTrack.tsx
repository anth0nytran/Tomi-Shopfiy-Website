"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackKlaviyoEvent } from '@/lib/klaviyo'

type Props = {
  eventName?: string
  delayMs?: number
  oncePerSession?: boolean
}

export function KlaviyoDelayedTrack({
  eventName = 'Engaged 7 Seconds',
  delayMs = 7000,
  oncePerSession = true,
}: Props) {
  const pathname = usePathname()

  useEffect(() => {
    const key = `klv:delayed-track:${eventName}:${pathname}`

    if (oncePerSession) {
      try {
        if (sessionStorage.getItem(key)) return
      } catch {
        // ignore (storage may be blocked)
      }
    }

    const timer = window.setTimeout(() => {
      if (oncePerSession) {
        try {
          sessionStorage.setItem(key, '1')
        } catch {
          // ignore
        }
      }

      trackKlaviyoEvent(eventName, {
        pathname,
        url: window.location.href,
        referrer: document.referrer || undefined,
        title: document.title || undefined,
        delayMs,
      })
    }, delayMs)

    return () => window.clearTimeout(timer)
  }, [delayMs, eventName, oncePerSession, pathname])

  return null
}



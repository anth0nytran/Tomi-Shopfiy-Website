"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackKlaviyoEvent } from '@/lib/klaviyo'
import { waitForLaunchUnlocked } from '@/lib/launch-unlock'

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

    let cancelled = false
    let timer: number | null = null

    void (async () => {
      // IMPORTANT: do not start the delay timer until the launch countdown is actually unlocked.
      await waitForLaunchUnlocked()
      if (cancelled) return

      timer = window.setTimeout(() => {
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
    })()

    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [delayMs, eventName, oncePerSession, pathname])

  return null
}



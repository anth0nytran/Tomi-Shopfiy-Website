"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { openKlaviyoFormById } from '@/lib/klaviyo'
import { waitForLaunchUnlocked } from '@/lib/launch-unlock'

type Props = {
  formId: string
  delayMs?: number
  suppressDays?: number
  excludePaths?: string[]
}

function hasActiveKlaviyoPopup() {
  return !!document.querySelector(
    '.kl-private-overlay, .kl-private-popup, .klaviyo-popup-overlay, .klaviyo-form-dynamic',
  )
}

function getForceFlag() {
  try {
    const p = new URLSearchParams(window.location.search)
    return p.get('forceKlaviyo') === '1'
  } catch {
    return false
  }
}

export function KlaviyoDelayedOpenForm({
  formId,
  delayMs = 7000,
  suppressDays = 7,
  excludePaths = [],
}: Props) {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    if (excludePaths.includes(pathname)) return

    const force = getForceFlag()
    const key = `klv:fallback-open-form:${formId}`
    const ttlMs = Math.max(0, suppressDays) * 24 * 60 * 60 * 1000

    const now = Date.now()

    if (!force && ttlMs > 0) {
      try {
        const raw = localStorage.getItem(key)
        const last = raw ? Number(raw) : 0
        if (Number.isFinite(last) && last > 0 && now - last < ttlMs) return
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
        // If Klaviyo already opened something (or the user opened it), don't double-open.
        if (hasActiveKlaviyoPopup()) return

        try {
          if (!force && ttlMs > 0) localStorage.setItem(key, String(Date.now()))
        } catch {
          // ignore
        }

        openKlaviyoFormById(formId)
      }, delayMs)
    })()

    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [delayMs, excludePaths, formId, pathname, suppressDays])

  return null
}



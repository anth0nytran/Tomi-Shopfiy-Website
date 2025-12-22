import { launchConfig } from '@/lib/launch-config'

declare global {
  interface Window {
    __tomiLaunchUnlocked?: boolean
  }
}

export const LAUNCH_UNLOCKED_EVENT = 'tomi:launch:unlocked'

export function isLaunchUnlocked() {
  if (!launchConfig.isEnabled) return true
  if (typeof window === 'undefined') return true
  return window.__tomiLaunchUnlocked === true
}

export function markLaunchUnlocked() {
  if (typeof window === 'undefined') return
  if (window.__tomiLaunchUnlocked) return
  window.__tomiLaunchUnlocked = true
  window.dispatchEvent(new Event(LAUNCH_UNLOCKED_EVENT))
}

export function waitForLaunchUnlocked(): Promise<void> {
  if (isLaunchUnlocked()) return Promise.resolve()

  return new Promise((resolve) => {
    const onUnlocked = () => {
      window.removeEventListener(LAUNCH_UNLOCKED_EVENT, onUnlocked)
      resolve()
    }
    window.addEventListener(LAUNCH_UNLOCKED_EVENT, onUnlocked)
  })
}

export {}



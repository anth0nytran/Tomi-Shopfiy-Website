"use client"
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initClientBehaviors } from '@/lib/clientInit'

export function ClientInit() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Re-run init on route change after a microtask to let React finish hydration
    const timer = setTimeout(() => {
      initClientBehaviors()
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname])
  
  return null
}

"use client"
import { useEffect } from 'react'
import { initClientBehaviors } from '@/lib/clientInit'

export function ClientInit() {
  useEffect(() => {
    initClientBehaviors()
  }, [])
  return null
}

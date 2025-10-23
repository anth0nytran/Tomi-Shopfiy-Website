import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function Container({ children, className, fullWidth = false }: ContainerProps) {
  return (
    <div className={cn(
      fullWidth ? 'w-full px-0' : 'container',
      className
    )}>
      {children}
    </div>
  )
}

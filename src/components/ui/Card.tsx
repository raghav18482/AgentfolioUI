import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-surface-800 bg-surface-900/60 backdrop-blur-sm',
        padding && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  height?: number | string
}

/** A pulsing placeholder that holds a chart's or card's space while it loads. */
export function Skeleton({ className, height }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={clsx('animate-pulse rounded-xl bg-surface-800/50', className)}
      style={height !== undefined ? { height } : undefined}
    />
  )
}

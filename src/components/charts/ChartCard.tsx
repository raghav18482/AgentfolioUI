import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

interface ChartCardProps {
  title: string
  /** The small descriptor at the top right, e.g. "Size = Current Value · Color = P&L". */
  tag?: ReactNode
  /** Controls beside the tag, e.g. a symbol picker or a refresh button. */
  actions?: ReactNode
  /** Reserved for every state, so the page does not jump when data arrives. */
  height: number
  loading?: boolean
  /** Replaces the chart with this message, styled as a failure. */
  error?: string | null
  /** Replaces the chart with this message when there is nothing to draw. */
  empty?: string | null
  children?: ReactNode
  className?: string
}

/**
 * The frame every chart sits in. Loading, failure and "nothing to show" all
 * render at the chart's own height, so each surface handles all three states
 * the same way.
 */
export function ChartCard({
  title,
  tag,
  actions,
  height,
  loading,
  error,
  empty,
  children,
  className,
}: ChartCardProps) {
  let body: ReactNode = children
  if (loading) body = <Skeleton height={height} />
  else if (error) body = <ChartMessage height={height} tone="error">{error}</ChartMessage>
  else if (empty) body = <ChartMessage height={height}>{empty}</ChartMessage>

  return (
    <Card className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {(actions || tag) && (
          <div className="flex flex-wrap items-center gap-3">
            {actions}
            {tag && <span className="text-[11px] text-surface-200/45">{tag}</span>}
          </div>
        )}
      </div>
      {body}
    </Card>
  )
}

function ChartMessage({
  height,
  tone,
  children,
}: {
  height: number
  tone?: 'error'
  children: ReactNode
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      style={{ minHeight: Math.min(height, 240) }}
      className={clsx(
        'flex items-center justify-center rounded-xl border border-dashed px-6 text-center text-sm',
        tone === 'error' ? 'border-rose-500/25 text-rose-300/90' : 'border-surface-800 text-surface-200/50',
      )}
    >
      {children}
    </div>
  )
}

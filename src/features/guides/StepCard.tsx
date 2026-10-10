import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

interface StepCardProps {
  /** The circled number. Omit for an unnumbered section. */
  step?: number
  title: string
  children: ReactNode
}

export function StepCard({ step, title, children }: StepCardProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        {step !== undefined && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/15 font-display text-sm font-semibold text-brand-300">
            {step}
          </span>
        )}
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-surface-200/75">{children}</div>
    </Card>
  )
}

/** A sub-heading inside a step, e.g. "Find your config file". */
export function StepHeading({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-sm font-semibold text-white">{children}</h3>
}

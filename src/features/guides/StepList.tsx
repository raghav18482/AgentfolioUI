import type { ReactNode } from 'react'

/** Lettered or bulleted sub-steps inside a `StepCard`. */
export function StepList({ children }: { children: ReactNode }) {
  return <ol className="space-y-2.5">{children}</ol>
}

export function StepItem({ bullet, children }: { bullet: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-800 text-[11px] font-semibold text-surface-200/70"
      >
        {bullet}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  )
}

import type { ReactNode } from 'react'

/** A code fragment inside running text — a path, a key name, a command. */
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-800 px-1.5 py-0.5 text-[0.85em] text-brand-300">{children}</code>
  )
}

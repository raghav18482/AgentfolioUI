import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface GuideNoteProps {
  /** `danger` for an instruction that cannot be undone, like copying a one-time secret. */
  tone?: 'default' | 'danger'
  children: ReactNode
}

/**
 * An aside within a guide. Static content, so unlike `Alert` it carries no live
 * region role — nothing here appears in response to an action.
 */
export function GuideNote({ tone = 'default', children }: GuideNoteProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border px-4 py-3 text-sm leading-relaxed',
        tone === 'danger'
          ? 'border-rose-500/30 bg-rose-500/[0.06] text-rose-100/90'
          : 'border-brand-500/20 bg-brand-500/[0.06] text-surface-200/80',
      )}
    >
      {children}
    </div>
  )
}

/** The "You now have …" chip that closes each credential step. */
export function CredentialResult({ name, example }: { name: string; example: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2.5">
      <span className="text-xs uppercase tracking-wider text-emerald-300/70">You now have</span>
      <span className="font-semibold text-emerald-300">{name}</span>
      <span className="text-xs text-surface-200/50">
        e.g. <code className="rounded bg-surface-800 px-1.5 py-0.5 text-surface-200/80">{example}</code>
      </span>
    </div>
  )
}

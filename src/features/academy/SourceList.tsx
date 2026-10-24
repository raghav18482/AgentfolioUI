import { ExternalLink } from 'lucide-react'
import type { Source } from './content/types'
import { formatAsOf } from './labels'

/** The authoritative references behind a lesson or term, each with when it was checked. */
export function SourceList({ sources, compact }: { sources: Source[]; compact?: boolean }) {
  return (
    <div className={compact ? '' : 'rounded-2xl border border-surface-800 bg-surface-900/40 p-4'}>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-surface-200/50">Sources</p>
      <ul className="space-y-1">
        {sources.map((s) => (
          <li key={s.url} className="text-xs leading-relaxed text-surface-200/65">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1 text-brand-400 hover:text-brand-300 hover:underline"
            >
              {s.label}
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
            </a>{' '}
            · checked {formatAsOf(s.asOf)}
          </li>
        ))}
      </ul>
    </div>
  )
}

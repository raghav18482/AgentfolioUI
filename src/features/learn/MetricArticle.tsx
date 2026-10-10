import { clsx } from 'clsx'
import { Card } from '@/components/ui/Card'
import { bandRange } from '@/lib/glossary'
import type { GlossaryMetric, Verdict } from '@/types'

const PILL: Record<Verdict, string> = {
  good: 'bg-emerald-500/10 text-emerald-400',
  bad: 'bg-rose-500/10 text-rose-400',
  neutral: 'bg-amber-500/10 text-amber-400',
  excluded: 'bg-surface-800 text-surface-200/60',
  unknown: 'bg-surface-800 text-surface-200/60',
}

interface MetricArticleProps {
  metricKey: string
  metric: GlossaryMetric
  /** Briefly outlined when a Research popover linked here. */
  targeted: boolean
}

export function MetricArticle({ metricKey, metric, targeted }: MetricArticleProps) {
  const scored = (metric.weight || 0) > 0
  return (
    <Card
      className={clsx(
        'scroll-mt-24 transition-[border-color,box-shadow] duration-300',
        targeted && 'border-brand-500 shadow-[0_0_0_3px_rgba(99,102,241,0.25)]',
      )}
    >
      <article id={metricKey}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">{metric.label}</h3>
            <p className="text-xs text-surface-200/55">{metric.full_name}</p>
          </div>
          <span
            className={clsx(
              'shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
              scored
                ? 'border-brand-500/30 bg-brand-500/10 text-brand-300'
                : 'border-surface-700 bg-surface-800 text-surface-200/55',
            )}
          >
            {scored ? 'Counts toward the score' : 'Shown for context only'}
          </span>
        </div>

        {metric.formula && (
          <p className="mb-3 rounded-md bg-surface-800/70 px-2.5 py-1.5 font-mono text-[11px] text-surface-200/70">
            {metric.formula}
          </p>
        )}
        <p className="mb-4 text-sm leading-relaxed text-surface-200/80">{metric.plain}</p>

        <div className="space-y-2">
          {metric.ideal && <Fact label="Ideal" tone="ideal">{metric.ideal}</Fact>}
          {metric.caveat && <Fact label="Context">{metric.caveat}</Fact>}
          {metric.watch_out && <Fact label="Watch out" tone="warn">{metric.watch_out}</Fact>}
        </div>

        {scored && metric.bands?.length > 0 && (
          <details className="group mt-4">
            <summary className="cursor-pointer list-none text-xs font-semibold text-brand-400 marker:hidden">
              <span className="inline-block transition-transform group-open:rotate-90" aria-hidden>
                ▸
              </span>{' '}
              How this metric is graded
            </summary>
            <table className="mt-2 w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-surface-200/50">
                  <th className="border-b border-surface-800 px-1.5 py-1.5 font-semibold">Value</th>
                  <th className="border-b border-surface-800 px-1.5 py-1.5 font-semibold">Verdict</th>
                  <th className="border-b border-surface-800 px-1.5 py-1.5 font-semibold">Reading</th>
                </tr>
              </thead>
              <tbody>
                {metric.bands.map((band, i) => (
                  <tr key={i} className="border-b border-surface-800/60 last:border-0">
                    <td className="px-1.5 py-1.5 align-top tabular-nums text-surface-200/80">{bandRange(metric.bands, i)}</td>
                    <td className="px-1.5 py-1.5 align-top">
                      <span className={clsx('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase', PILL[band.verdict])}>
                        {band.verdict}
                      </span>
                    </td>
                    <td className="px-1.5 py-1.5 align-top text-surface-200/75">{band.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        )}
      </article>
    </Card>
  )
}

function Fact({ label, tone, children }: { label: string; tone?: 'ideal' | 'warn'; children: string }) {
  return (
    <div
      className={clsx(
        'rounded-lg border-l-[3px] bg-surface-800/50 px-3 py-2',
        tone === 'ideal' ? 'border-brand-500' : tone === 'warn' ? 'border-orange-400' : 'border-surface-700',
      )}
    >
      <p
        className={clsx(
          'text-[10px] font-bold uppercase tracking-wider',
          tone === 'ideal' ? 'text-brand-300' : tone === 'warn' ? 'text-orange-400' : 'text-surface-200/50',
        )}
      >
        {label}
      </p>
      <p className="mt-0.5 text-xs leading-relaxed text-surface-200/80">{children}</p>
    </div>
  )
}

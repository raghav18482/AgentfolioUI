import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import { InfoPopover, InfoSection } from '@/components/ui/InfoPopover'
import { useGlossary } from '@/hooks/useResearch'
import type { ScoreMetric, Verdict } from '@/types'

export interface MetricItem {
  /** Matches a glossary entry and a score metric, when there is one. */
  key?: string
  label: string
  value: string
  sub?: string
}

const DOT: Record<Verdict, string> = {
  good: 'bg-emerald-500',
  bad: 'bg-rose-500',
  neutral: 'bg-amber-500',
  excluded: 'bg-surface-700',
  unknown: 'bg-surface-700',
}

const VERDICT_TEXT: Record<Verdict, string> = {
  good: 'text-emerald-400',
  bad: 'text-rose-400',
  neutral: 'text-amber-400',
  excluded: 'text-surface-200/60',
  unknown: 'text-surface-200/60',
}

interface MetricListProps {
  items: MetricItem[]
  /** The score's verdict for each metric key, to colour the dots. */
  verdicts?: Record<string, ScoreMetric>
}

export function MetricList({ items, verdicts }: MetricListProps) {
  return (
    <dl className="divide-y divide-surface-800/80">
      {items.map((item) => (
        <MetricRow key={item.label} item={item} verdict={item.key ? verdicts?.[item.key] : undefined} />
      ))}
    </dl>
  )
}

function MetricRow({ item, verdict }: { item: MetricItem; verdict?: ScoreMetric }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <dt className="flex min-w-0 items-center gap-2 text-sm text-surface-200/75">
        {verdict && (
          <span
            role="img"
            aria-label={verdict.verdict}
            title={verdict.note}
            className={clsx('h-2 w-2 shrink-0 rounded-full', DOT[verdict.verdict])}
          />
        )}
        {item.label}
        {item.key && <MetricInfo metricKey={item.key} verdict={verdict} />}
      </dt>
      <dd className="text-right">
        <span className="text-sm font-semibold text-white">{item.value}</span>
        {item.sub && <span className="block text-[11px] text-surface-200/45">{item.sub}</span>}
      </dd>
    </div>
  )
}

/** The ⓘ beside a metric: what it is, the ideal range, and how this stock reads. */
function MetricInfo({ metricKey, verdict }: { metricKey: string; verdict?: ScoreMetric }) {
  const { data: glossary, isError } = useGlossary()
  const meta = glossary?.metrics[metricKey]
  if (!meta && !isError) return null

  const showVerdict = verdict && verdict.note && verdict.verdict !== 'unknown' && verdict.verdict !== 'excluded'

  return (
    <InfoPopover title={meta?.full_name || meta?.label || 'Metric'}>
      {meta ? (
        <>
          <p className="rounded-md bg-surface-800/70 px-2 py-1 font-mono text-[11px] text-brand-200">{meta.formula}</p>
          <p>{meta.plain}</p>
          {meta.ideal && <InfoSection heading="Ideal">{meta.ideal}</InfoSection>}
          {showVerdict && (
            <p className={clsx('font-medium', VERDICT_TEXT[verdict.verdict])}>
              This stock: {verdict.display} — {verdict.note}
            </p>
          )}
          {meta.watch_out && <InfoSection heading="Watch out">{meta.watch_out}</InfoSection>}
          <Link to={`/learn/metrics#${metricKey}`} className="inline-block text-brand-400 hover:underline">
            Read more in the guide →
          </Link>
        </>
      ) : (
        <p>No explanation available for this metric.</p>
      )}
    </InfoPopover>
  )
}

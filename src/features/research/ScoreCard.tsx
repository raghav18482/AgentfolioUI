import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import type { FundamentalScore, ScoreConfidence } from '@/types'

const GRADE_TONE: Record<string, { text: string; bar: string; ring: string }> = {
  A: { text: 'text-emerald-400', bar: 'bg-emerald-500', ring: 'border-emerald-500/50' },
  B: { text: 'text-lime-400', bar: 'bg-lime-500', ring: 'border-lime-500/50' },
  C: { text: 'text-amber-400', bar: 'bg-amber-500', ring: 'border-amber-500/50' },
  D: { text: 'text-orange-400', bar: 'bg-orange-500', ring: 'border-orange-500/50' },
  E: { text: 'text-rose-400', bar: 'bg-rose-500', ring: 'border-rose-500/50' },
}

/** A provisional score is grey: the colour is what a beginner reads first. */
const PROVISIONAL_TONE = { text: 'text-surface-200/70', bar: 'bg-surface-200/40', ring: 'border-surface-700' }

const CONFIDENCE_COPY: Record<Exclude<ScoreConfidence, 'none'>, string> = {
  high: 'Based on most of the metrics — a solid reading.',
  medium: 'Some metrics were unavailable, so treat this as approximate.',
  low: 'Provisional: too few metrics had data to score this reliably.',
}

const CONFIDENCE_TONE: Record<Exclude<ScoreConfidence, 'none'>, string> = {
  high: '',
  medium: 'border-amber-500/25 bg-amber-500/10 text-amber-100',
  low: 'border-surface-700 bg-surface-800/60 text-surface-200/75',
}

/** Name a whole skipped pillar rather than listing its metrics one by one. */
function skippedParts(score: FundamentalScore): string[] {
  const skipped = score.pillars.filter((p) => p.score === null && p.metrics.some((m) => m.verdict === 'excluded'))
  const inSkipped = new Set(skipped.flatMap((p) => p.metrics.map((m) => m.key)))
  const labels = new Map(score.pillars.flatMap((p) => p.metrics.map((m) => [m.key, m.label] as const)))
  const loose = score.excluded.filter((k) => !inSkipped.has(k)).map((k) => labels.get(k) ?? k)
  return [...skipped.map((p) => `${p.label.toLowerCase()} (not measurable from this data)`), ...loose]
}

export function ScoreCard({ score }: { score: FundamentalScore | null }) {
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Fundamental Score</h2>
          <p className="mt-0.5 text-xs text-surface-200/55">
            Graded against fixed thresholds — no AI involved, so the same numbers always give the same score.
          </p>
        </div>
        <Link to="/learn/metrics#how-it-works" className="text-xs text-brand-400 hover:text-brand-300 hover:underline">
          How is this calculated?
        </Link>
      </div>
      {!score || score.total == null ? (
        <p className="rounded-xl border border-dashed border-surface-800 px-4 py-6 text-center text-sm text-surface-200/50">
          {score?.note || 'Not enough fundamental data to score this stock.'}
        </p>
      ) : (
        <ScoreBody score={score} />
      )}
    </Card>
  )
}

function ScoreBody({ score }: { score: FundamentalScore }) {
  const provisional = score.confidence === 'low'
  const tone = provisional ? PROVISIONAL_TONE : (GRADE_TONE[score.grade ?? ''] ?? GRADE_TONE.C)
  const skipped = skippedParts(score)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-5">
        <div
          className={clsx('flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4', tone.ring)}
          aria-label={`Score ${score.total} out of 100`}
        >
          <span className={clsx('text-3xl font-bold leading-none', tone.text)}>{score.total}</span>
          <span className="mt-1 text-[10px] text-surface-200/50">/ 100</span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <span className={clsx('inline-block rounded-md bg-surface-800 px-2.5 py-1 text-sm font-semibold', tone.text)}>
            {provisional ? `Provisional · ${score.grade}` : `${score.grade} · ${score.label}`}
          </span>
          {(score.confidence === 'medium' || score.confidence === 'low') && (
            <p className={clsx('rounded-lg border px-3 py-2 text-xs', CONFIDENCE_TONE[score.confidence])}>
              {CONFIDENCE_COPY[score.confidence]} Based on {score.metrics_used} of {score.metrics_total} metrics.
            </p>
          )}
          {skipped.length > 0 && (
            <p className="text-xs text-surface-200/60">
              Adjusted for this sector: {skipped.join(', ')} left out — not meaningful for this kind of company.
              Scored out of 100 on the rest.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {score.pillars.map((p) => {
          const pct = p.score == null ? 0 : (p.score / p.max) * 100
          return (
            <div key={p.key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-white">{p.label}</span>
                <span className={clsx('text-xs', p.score == null ? 'text-surface-200/40' : 'text-surface-200/75')}>
                  {p.score == null ? 'No data' : `${p.score} / ${p.max}`}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`${p.label} score`}
                aria-valuemin={0}
                aria-valuemax={p.max}
                aria-valuenow={p.score ?? undefined}
                className="h-1.5 overflow-hidden rounded-full bg-surface-800"
              >
                <div className={clsx('h-full rounded-full', tone.bar)} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-surface-200/50">{p.tagline}</p>
            </div>
          )
        })}
      </div>

      {(score.strengths.length > 0 || score.concerns.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          <Notes heading="Strengths" items={score.strengths} tone="good" />
          <Notes heading="Watch out for" items={score.concerns} tone="bad" />
        </div>
      )}

      <p className="text-[11px] leading-relaxed text-surface-200/45">
        This only measures the numbers above. It knows nothing about management, competition, litigation or pledged
        shares — it is a reading aid, not a recommendation.
      </p>
    </div>
  )
}

function Notes({ heading, items, tone }: { heading: string; items: string[]; tone: 'good' | 'bad' }) {
  if (!items.length) return null
  return (
    <div
      className={clsx(
        'rounded-xl border px-4 py-3',
        tone === 'good' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5',
      )}
    >
      <p className={clsx('mb-1.5 text-xs font-semibold uppercase tracking-wider', tone === 'good' ? 'text-emerald-400' : 'text-rose-400')}>
        {heading}
      </p>
      <ul className="list-disc space-y-1 pl-4 text-xs text-surface-200/80">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

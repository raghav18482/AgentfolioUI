import { clsx } from 'clsx'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { lazy, Suspense, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { RupeeSeries } from '@/components/charts/options/academy'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'

const CalculatorChart = lazy(() => import('./CalculatorChart').then((m) => ({ default: m.CalculatorChart })))

interface NumberFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
}

/** A text field for numbers: `inputMode` brings up the numeric keypad, and the raw text is kept so typing is never fought. */
export function NumberField({ label, value, onChange, error, hint }: NumberFieldProps) {
  return (
    <Input
      label={label}
      inputMode="decimal"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      hint={hint}
    />
  )
}

/** The inputs beside the results on wide screens, stacked on narrow ones. */
export function CalculatorLayout({ form, results }: { form: ReactNode; results: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Card className="space-y-4 self-start">{form}</Card>
      <div className="space-y-4">{results}</div>
    </div>
  )
}

/** Shown in place of results while any field is invalid. */
export function FixInputs() {
  return (
    <Card>
      <EmptyState icon={AlertTriangle} title="Check the highlighted fields" hint="The projection appears as soon as every field is valid." />
    </Card>
  )
}

export function ResultStat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'good' | 'bad' }) {
  return (
    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
      <p className="text-xs text-surface-200/55">{label}</p>
      <p
        className={clsx(
          'mt-1 text-xl font-bold tabular-nums',
          tone === 'good' ? 'text-emerald-400' : tone === 'bad' ? 'text-rose-400' : 'text-white',
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-surface-200/50">{sub}</p>}
    </div>
  )
}

/** The results card: a "hypothetical" label, the key figures, then the chart. */
export function ResultsCard({ children, series, ariaLabel }: { children: ReactNode; series: RupeeSeries[]; ariaLabel: string }) {
  return (
    <Card className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80">
        Hypothetical projection · not a forecast or a guarantee
      </p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      <Suspense fallback={<Skeleton height={280} />}>
        <CalculatorChart series={series} ariaLabel={ariaLabel} />
      </Suspense>
    </Card>
  )
}

/** What the calculation assumes, and the lesson that explains the decision behind it. */
export function Assumptions({ items, lesson }: { items: string[]; lesson: { slug: string; title: string } }) {
  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-bold text-white">How this is calculated</h3>
      <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-surface-200/70">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link
        to={`/learn/lessons/${lesson.slug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 hover:text-brand-300"
      >
        Lesson: {lesson.title}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  )
}

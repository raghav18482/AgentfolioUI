import { clsx } from 'clsx'
import { ArrowRight, BookMarked, Calculator, CandlestickChart, CheckCircle2, Circle, Gauge, PlayCircle, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { legacyLearnRedirect } from '@/lib/academy/legacyRedirect'
import { completedCount, hasAnyProgress } from '@/lib/academy/progress'
import { useAcademyProgress } from '@/store/academyProgress'
import { findLesson, LESSONS, lessonsInPath, PATHS } from './content'
import type { LearningPath } from './content/types'
import { EducationNotice } from './EducationNotice'
import { LEVEL_LABEL } from './labels'

export function AcademyHomePage() {
  const { hash } = useLocation()
  const legacy = legacyLearnRedirect(hash)
  if (legacy) return <Navigate to={legacy} replace />
  return <AcademyHome />
}

function AcademyHome() {
  const progress = useAcademyProgress()
  const [confirmReset, setConfirmReset] = useState(false)
  const done = completedCount(progress, LESSONS.map((l) => l.slug))
  const last = findLesson(progress.lastLesson ?? undefined)
  const nextUp = LESSONS.find((l) => !progress.completed[l.slug])
  const resume = last && !progress.completed[last.slug] ? last : nextUp

  return (
    <div className="mx-auto max-w-[1080px] space-y-10 px-4 py-8 sm:px-6">
      <PageMeta
        title="Financial Learning Academy"
        description="Free, practical lessons for earners: monthly surplus, emergency funds, loans and EMIs, insurance, goals, asset allocation, fund evaluation and investor behaviour. No sign-up needed."
      />
      <PageHeader
        kicker="Free · no sign-up"
        title="Financial Learning Academy"
        sub="Practical lessons for earners: what to do with your monthly surplus, how to handle loans and EMIs, and how to invest towards your goals. Each lesson ends with a short check and links to the terms behind it."
      />

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            {done === 0 ? 'Start here' : resume ? 'Continue learning' : 'All lessons complete'}
          </p>
          <p className="mt-1 text-lg font-bold text-white">
            {resume ? resume.title : 'You’ve finished every lesson available so far.'}
          </p>
          <p className="mt-0.5 text-xs text-surface-200/55">
            {done} of {LESSONS.length} lessons complete · progress is saved on this device only
          </p>
        </div>
        {resume && (
          <ButtonLink to={`/learn/lessons/${resume.slug}`}>
            <PlayCircle className="h-4 w-4" aria-hidden />
            {done === 0 ? 'Start the first lesson' : 'Continue'}
          </ButtonLink>
        )}
      </Card>

      <section aria-labelledby="paths-title" className="space-y-4">
        <h2 id="paths-title" className="text-xl font-extrabold text-white">
          Learning paths
        </h2>
        {PATHS.map((path) => (
          <PathCard key={path.id} path={path} />
        ))}
      </section>

      <section aria-labelledby="explore-title" className="space-y-4">
        <h2 id="explore-title" className="text-xl font-extrabold text-white">
          Tools and reference
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ExploreCard
            to="/learn/trading-lab"
            icon={CandlestickChart}
            title="Trading Lab"
            body="Practise a moving-average crossover on a synthetic market: simulated trades, position sizing, costs and a buy-and-hold comparison."
          />
          <ExploreCard
            to="/learn/calculators"
            icon={Calculator}
            title="Calculators"
            body="Goal planner, SIP vs lump sum, prepay a loan vs invest, and inflation — run the numbers with your own assumptions."
          />
          <ExploreCard
            to="/learn/glossary"
            icon={BookMarked}
            title="Glossary"
            body="EMIs and prepayment, liquid funds, XIRR, TRI benchmarks, expense ratios, SIFs and more — each defined with a worked example."
          />
          <ExploreCard
            to="/learn/metrics"
            icon={Gauge}
            title="Metrics guide"
            body="P/E, ROE, debt-to-equity and the other company ratios on the Research page, with the exact thresholds used to score stocks."
          />
        </div>
      </section>

      <EducationNotice />

      {hasAnyProgress(progress) && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset my progress
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Reset your progress?"
        confirmLabel="Reset progress"
        tone="danger"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          progress.reset()
          setConfirmReset(false)
        }}
      >
        <p className="text-sm text-surface-200/75">
          This clears completed lessons and quiz scores saved in this browser. It can’t be undone.
        </p>
      </ConfirmDialog>
    </div>
  )
}

function PathCard({ path }: { path: LearningPath }) {
  const completed = useAcademyProgress((s) => s.completed)
  const bestScore = useAcademyProgress((s) => s.bestScore)
  const lessons = lessonsInPath(path.id)
  const done = lessons.filter((l) => completed[l.slug]).length
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-white">{path.title}</h3>
            <Badge variant="info">{LEVEL_LABEL[path.level]}</Badge>
          </div>
          <p className="max-w-[65ch] text-sm leading-relaxed text-surface-200/65">{path.description}</p>
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-surface-200/60">
          {done}/{lessons.length} done
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`${path.title} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-800"
      >
        <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>

      <ol className="divide-y divide-surface-800/70">
        {lessons.map((l, i) => {
          const isDone = Boolean(completed[l.slug])
          const best = bestScore[l.slug]
          return (
            <li key={l.slug}>
              <Link
                to={`/learn/lessons/${l.slug}`}
                className="group flex items-center gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-surface-800/30"
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-label="Completed" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-surface-200/30" aria-label="Not started" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white group-hover:text-brand-300">
                    {i + 1}. {l.title}
                  </span>
                  <span className="block text-xs text-surface-200/55">{l.summary}</span>
                </span>
                <span className="hidden shrink-0 text-right text-xs text-surface-200/50 sm:block">
                  {l.minutes} min
                  {best && <span className="block tabular-nums">Quiz {best.score}/{best.total}</span>}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

function ExploreCard({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: string
  icon: typeof BookMarked
  title: string
  body: string
}) {
  return (
    <Link
      to={to}
      className={clsx(
        'group flex gap-4 rounded-2xl border border-surface-800 bg-surface-900/60 p-5 transition-colors',
        'hover:border-surface-700 hover:bg-surface-900',
      )}
    >
      <div className="h-fit rounded-xl border border-surface-700/60 bg-surface-800/60 p-2.5">
        <Icon className="h-5 w-5 text-brand-400" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1 font-semibold text-white group-hover:text-brand-300">
          {title}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </p>
        <p className="mt-1 text-sm leading-relaxed text-surface-200/60">{body}</p>
      </div>
    </Link>
  )
}

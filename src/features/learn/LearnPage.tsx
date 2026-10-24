import { clsx } from 'clsx'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useHashTarget } from '@/hooks/useHashTarget'
import { useGlossary } from '@/hooks/useResearch'
import { metricsForPillar, PILLAR_ORDER } from '@/lib/glossary'
import type { Glossary } from '@/types'
import { MetricArticle } from './MetricArticle'

const GRADE_TEXT: Record<string, string> = {
  A: 'text-emerald-400',
  B: 'text-lime-400',
  C: 'text-amber-400',
  D: 'text-orange-400',
  E: 'text-rose-400',
}

/**
 * The metrics guide, drawn straight from the glossary the Python scorer grades
 * against, so every threshold shown is the one actually used. Nothing here is
 * written by AI.
 */
export function LearnPage() {
  const { data: glossary, isPending, isError, error, refetch } = useGlossary()
  const targeted = useHashTarget(glossary !== undefined)

  return (
    <div className="mx-auto max-w-[1080px] space-y-10 px-4 py-8 sm:px-6">
      <PageMeta
        title="Metrics guide"
        description="Every stock metric on Agentfolio's Research page explained in plain English, with the exact thresholds used to score stocks."
      />
      <div className="space-y-4">
        <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Academy
        </Link>
        <PageHeader
          kicker="Plain-English guide"
          title="What the numbers actually mean"
          sub="Every metric on the Research page explained without jargon — what it measures, what counts as a good number, and what it quietly hides. None of this page is written by AI: the thresholds here are the exact ones used to score your stocks."
        />
      </div>

      {isPending ? (
        <div className="space-y-6" aria-busy>
          <Skeleton height={160} />
          <Skeleton height={120} />
          <Skeleton height={320} />
        </div>
      ) : isError ? (
        <Alert
          variant="error"
          action={
            <button type="button" onClick={() => void refetch()} className="cursor-pointer text-sm underline">
              Try again
            </button>
          }
        >
          Could not load the metrics guide: {error.message}
        </Alert>
      ) : (
        <>
          <Intro intro={glossary.intro} />
          <Toc glossary={glossary} />
          {PILLAR_ORDER.map((key) => (
            <PillarSection key={key} pillarKey={key} glossary={glossary} targeted={targeted} />
          ))}
          <Scoring scoring={glossary.scoring} />
        </>
      )}
    </div>
  )
}

function Intro({ intro }: { intro: Glossary['intro'] }) {
  return (
    <section aria-labelledby="learn-intro">
      <h2 id="learn-intro" className="mb-4 text-xl font-extrabold text-white">
        Before you read a single ratio
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {intro.map((item, n) => (
          <div key={item.title} className="flex gap-3 rounded-2xl border border-surface-800 bg-surface-900/60 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-500/30 bg-brand-500/10 text-xs font-bold text-brand-300">
              {n + 1}
            </span>
            <div>
              <h3 className="mb-1 text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs leading-relaxed text-surface-200/70">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Toc({ glossary }: { glossary: Glossary }) {
  return (
    <nav
      aria-label="Jump to a metric"
      className="grid gap-4 rounded-2xl border border-surface-800 bg-surface-900/60 p-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {PILLAR_ORDER.map((key) => (
        <div key={key}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-surface-200/50">
            {glossary.pillars[key].label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {metricsForPillar(glossary.metrics, key).map((m) => (
              <a
                key={m.key}
                href={`#${m.key}`}
                className="rounded-full border border-surface-700 bg-surface-800 px-2.5 py-0.5 text-xs text-surface-200/80 transition-colors hover:border-brand-500 hover:text-brand-300"
              >
                {m.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function PillarSection({ pillarKey, glossary, targeted }: { pillarKey: string; glossary: Glossary; targeted: string | null }) {
  const pillar = glossary.pillars[pillarKey]
  return (
    <section id={`pillar-${pillarKey}`} aria-labelledby={`h-${pillarKey}`} className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 id={`h-${pillarKey}`} className="text-xl font-extrabold text-white">
          {pillar.label}
        </h2>
        <span className="text-xs font-semibold text-brand-400">{pillar.tagline}</span>
      </div>
      <p className="mb-5 mt-1 max-w-[70ch] text-sm leading-relaxed text-surface-200/65">{pillar.body}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {metricsForPillar(glossary.metrics, pillarKey).map((m) => (
          <MetricArticle key={m.key} metricKey={m.key} metric={m} targeted={targeted === m.key} />
        ))}
      </div>
    </section>
  )
}

function Scoring({ scoring }: { scoring: Glossary['scoring'] }) {
  return (
    <section id="how-it-works" aria-labelledby="h-how" className="scroll-mt-24">
      <h2 id="h-how" className="mb-4 text-xl font-extrabold text-white">
        How the Fundamental Score is calculated
      </h2>
      <Card className="space-y-6">
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-surface-200/80">
          {scoring.how_it_works.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-surface-200/50">Grade bands</p>
          <div className="flex flex-wrap gap-2">
            {scoring.grades.map((g) => (
              <span
                key={g.grade}
                className="flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-1.5 text-xs"
              >
                <strong className={clsx('text-base font-extrabold', GRADE_TEXT[g.grade])}>{g.grade}</strong>
                <span className="text-surface-200/80">{g.label}</span>
                <em className="not-italic tabular-nums text-surface-200/50">{g.min}+</em>
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-surface-200/50">What the score cannot see</p>
          <p className="text-sm leading-relaxed text-surface-200/80">{scoring.limits}</p>
        </div>
      </Card>
    </section>
  )
}

import { clsx } from 'clsx'
import { ArrowLeft, ArrowRight, Search, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { useHashTarget } from '@/hooks/useHashTarget'
import { searchTerms } from '@/lib/academy/glossarySearch'
import { SITE_URL } from '@/seo/routes'
import { findTerm, lessonsForTerm, TERM_CATEGORIES, TERMS } from './content'
import type { AcademyTerm, TermCategory } from './content/types'
import { EducationNotice } from './EducationNotice'
import { SourceList } from './SourceList'

/** schema.org `DefinedTermSet`: every term, linked to its anchor on this page. */
const GLOSSARY_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': `${SITE_URL}/learn/glossary`,
  name: 'Agentfolio financial glossary',
  url: `${SITE_URL}/learn/glossary`,
  hasDefinedTerm: TERMS.map((t) => ({
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/learn/glossary#${t.id}`,
    name: t.term,
    description: t.definition,
    ...(t.aka ? { alternateName: t.aka } : {}),
    inDefinedTermSet: `${SITE_URL}/learn/glossary`,
  })),
}

function categoryFrom(raw: string | null): TermCategory | null {
  return TERM_CATEGORIES.find((c) => c === raw) ?? null
}

export function GlossaryPage() {
  const [params, setParams] = useSearchParams()
  // The filters live in local state so typing stays instant; the URL starts them
  // (`?q=sip&category=Funds`) and is kept in step for sharing, but is never read back.
  const [query, setQuery] = useState(() => params.get('q') ?? '')
  const [category, setCategory] = useState(() => categoryFrom(params.get('category')))
  const results = useMemo(() => searchTerms(TERMS, query, category), [query, category])
  const targeted = useHashTarget(true)

  function update(next: { q?: string; category?: TermCategory | null }) {
    const q = next.q ?? query
    const c = next.category === undefined ? category : next.category
    setQuery(q)
    setCategory(c)
    const out = new URLSearchParams()
    if (q) out.set('q', q)
    if (c) out.set('category', c)
    setParams(out, { replace: true, preventScrollReset: true })
  }

  /** A related-term link jumps to a term that the current filters may be hiding. */
  function clearFilters() {
    setQuery('')
    setCategory(null)
  }

  return (
    <div className="mx-auto max-w-[1080px] space-y-8 px-4 py-8 sm:px-6">
      <PageMeta
        title="Financial glossary"
        description="Personal finance and investing terms explained with worked examples: take-home pay, EMIs, prepayment, liquid funds, XIRR, TRI, expense ratios and more."
        jsonLd={GLOSSARY_JSON_LD}
      />
      <div className="space-y-4">
        <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Academy
        </Link>
        <PageHeader
          kicker="Financial Learning Academy"
          title="Glossary"
          sub="Personal finance and investing terms, each with a worked example. Company ratios such as P/E and ROE are in the metrics guide."
        />
      </div>

      <div className="space-y-3">
        <Input
          type="search"
          aria-label="Search the glossary"
          placeholder="Search terms, e.g. EMI, XIRR, liquid fund"
          icon={<Search className="h-4 w-4" />}
          value={query}
          onChange={(e) => update({ q: e.target.value })}
        />
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          <CategoryChip label="All" active={category === null} onClick={() => update({ category: null })} />
          {TERM_CATEGORIES.map((c) => (
            <CategoryChip key={c} label={c} active={category === c} onClick={() => update({ category: c })} />
          ))}
        </div>
        <p className="text-xs text-surface-200/50" aria-live="polite">
          {results.length} {results.length === 1 ? 'term' : 'terms'}
        </p>
      </div>

      {results.length === 0 ? (
        <Card>
          <EmptyState
            icon={SearchX}
            title={`No terms match “${query}”`}
            hint="Try a shorter word, or clear the filters. Company ratios such as P/E or ROE are in the metrics guide."
            action={
              <Button variant="secondary" size="sm" onClick={() => update({ q: '', category: null })}>
                Clear search
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((t) => (
            <TermCard key={t.id} term={t} targeted={targeted === t.id} onJump={clearFilters} />
          ))}
        </div>
      )}

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-surface-200/75">Looking for P/E, ROE, debt-to-equity and other company ratios?</p>
        <Link to="/learn/metrics" className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 hover:text-brand-300">
          Open the metrics guide
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Card>

      <EducationNotice />
    </div>
  )
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-brand-500 bg-brand-500/15 text-brand-300'
          : 'border-surface-700 bg-surface-800 text-surface-200/75 hover:border-surface-600 hover:text-white',
      )}
    >
      {label}
    </button>
  )
}

function TermCard({ term, targeted, onJump }: { term: AcademyTerm; targeted: boolean; onJump: () => void }) {
  const related = term.related.map(findTerm).filter((t) => t !== undefined)
  const lessons = lessonsForTerm(term.id)
  return (
    <Card
      className={clsx(
        'scroll-mt-24 transition-[border-color,box-shadow] duration-300',
        targeted && 'border-brand-500 shadow-[0_0_0_3px_rgba(99,102,241,0.25)]',
      )}
    >
      <article id={term.id} className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">{term.term}</h2>
            {term.aka && <p className="text-xs text-surface-200/50">Also: {term.aka.join(', ')}</p>}
          </div>
          <div className="flex shrink-0 gap-1.5">
            {term.isNew && <Badge variant="warning">New</Badge>}
            <Badge>{term.category}</Badge>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-surface-200/85">{term.definition}</p>
        <p className="rounded-lg bg-surface-800/60 px-3 py-2 text-xs leading-relaxed text-surface-200/75">
          <span className="font-semibold text-surface-200">Example: </span>
          {term.example}
        </p>
        {related.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-surface-200/45">Related</span>
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/learn/glossary#${r.id}`}
                onClick={onJump}
                className="rounded-full border border-surface-700 bg-surface-800 px-2.5 py-0.5 text-xs text-surface-200/80 transition-colors hover:border-brand-500 hover:text-brand-300"
              >
                {r.term}
              </Link>
            ))}
          </div>
        )}
        {lessons.length > 0 && (
          <p className="text-xs text-surface-200/60">
            Learn more:{' '}
            {lessons.map((l, i) => (
              <span key={l.slug}>
                {i > 0 && ' · '}
                <Link to={`/learn/lessons/${l.slug}`} className="text-brand-400 hover:text-brand-300 hover:underline">
                  {l.title}
                </Link>
              </span>
            ))}
          </p>
        )}
        {term.sources && <SourceList sources={term.sources} compact />}
      </article>
    </Card>
  )
}

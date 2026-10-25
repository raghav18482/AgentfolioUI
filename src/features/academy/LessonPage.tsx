import { ArrowLeft, ArrowRight, BookOpen, Calculator, CheckCircle2, Clock, Lightbulb, Target } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '@/components/layout/PageMeta'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Markdown } from '@/components/ui/Markdown'
import { lessonOgImage, SITE_URL } from '@/seo/routes'
import { useAcademyProgress } from '@/store/academyProgress'
import { CALCULATORS, calculatorPath } from './calculators/ids'
import { findLesson, findPath, findTerm, neighbours } from './content'
import type { Lesson } from './content/types'
import { EducationNotice } from './EducationNotice'
import { LessonQuiz } from './LessonQuiz'
import { LessonVisual } from './LessonVisual'
import { LEVEL_LABEL } from './labels'
import { SourceList } from './SourceList'

export function LessonPage() {
  const { slug } = useParams()
  const lesson = findLesson(slug)

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <PageMeta title="Lesson not found" noindex />
        <EmptyState
          icon={BookOpen}
          title="We couldn’t find that lesson"
          hint="It may have moved, or the link may be mistyped."
          action={
            <ButtonLink to="/learn" variant="secondary" size="sm">
              Back to the Academy
            </ButtonLink>
          }
        />
      </div>
    )
  }
  return <LessonView key={lesson.slug} lesson={lesson} />
}

/** schema.org `LearningResource`, so search results can show the lesson's level and length. */
function lessonJsonLd(lesson: Lesson) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: lesson.summary,
    url: `${SITE_URL}/learn/lessons/${lesson.slug}`,
    image: SITE_URL + lessonOgImage(lesson.slug),
    learningResourceType: 'Lesson',
    educationalLevel: LEVEL_LABEL[lesson.level],
    timeRequired: `PT${lesson.minutes}M`,
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    teaches: lesson.objective,
    provider: { '@type': 'Organization', name: 'Agentfolio', url: SITE_URL },
  }
}

function LessonView({ lesson }: { lesson: Lesson }) {
  const visitLesson = useAcademyProgress((s) => s.visitLesson)
  const done = useAcademyProgress((s) => Boolean(s.completed[lesson.slug]))
  const path = findPath(lesson.pathId)
  const { prev, next } = neighbours(lesson)

  useEffect(() => {
    visitLesson(lesson.slug)
  }, [lesson.slug, visitLesson])

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <PageMeta
        title={lesson.title}
        description={lesson.summary}
        image={lessonOgImage(lesson.slug)}
        jsonLd={lessonJsonLd(lesson)}
      />

      <header className="animate-fade-in space-y-3">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-surface-200/55">
          <Link to="/learn" className="text-brand-400 hover:text-brand-300">
            Academy
          </Link>
          <span aria-hidden>/</span>
          <span>{path?.title}</span>
        </nav>
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{lesson.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">{LEVEL_LABEL[lesson.level]}</Badge>
          <Badge>
            <Clock className="h-3 w-3" aria-hidden />
            {lesson.minutes} min read
          </Badge>
          {done && (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              Completed
            </Badge>
          )}
        </div>
      </header>

      <Card className="flex gap-3">
        <Target className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden />
        <div>
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-300">What you’ll learn</h2>
          <p className="text-sm leading-relaxed text-surface-200/85">{lesson.objective}</p>
        </div>
      </Card>

      <section aria-label="Lesson" className="space-y-3 text-[15px] leading-relaxed text-surface-200/85">
        {lesson.explanation.map((paragraph) => (
          <Markdown key={paragraph} content={paragraph} />
        ))}
      </section>

      <Card>
        <h2 className="mb-2 text-base font-bold text-white">Example: {lesson.example.title}</h2>
        <div className="text-sm leading-relaxed text-surface-200/85">
          <Markdown content={lesson.example.body} />
        </div>
      </Card>

      {lesson.visual && (
        <Card>
          <LessonVisual visual={lesson.visual} />
        </Card>
      )}

      <Card className="border-amber-500/25">
        <div className="flex gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
          <div className="space-y-2 text-sm leading-relaxed">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">Common misconception</h2>
            <p className="text-surface-200/85">
              <span className="font-semibold text-rose-300">Myth: </span>
              {lesson.misconception.myth}
            </p>
            <p className="text-surface-200/85">
              <span className="font-semibold text-emerald-300">Reality: </span>
              {lesson.misconception.reality}
            </p>
          </div>
        </div>
      </Card>

      <LessonQuiz key={lesson.slug} slug={lesson.slug} questions={lesson.quiz} />

      <Card>
        <h2 className="mb-3 text-base font-bold text-white">Key takeaways</h2>
        <ul className="space-y-2">
          {lesson.takeaways.map((t) => (
            <li key={t} className="flex gap-2 text-sm leading-relaxed text-surface-200/85">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </Card>

      {lesson.calculators && <TryIt ids={lesson.calculators} />}

      <Related lesson={lesson} />

      {lesson.sources && <SourceList sources={lesson.sources} />}

      <EducationNotice />

      <nav aria-label="Lesson navigation" className="flex flex-wrap justify-between gap-3 border-t border-surface-800 pt-6">
        {prev ? (
          <ButtonLink to={`/learn/lessons/${prev.slug}`} variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {prev.title}
          </ButtonLink>
        ) : (
          <ButtonLink to="/learn" variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Academy
          </ButtonLink>
        )}
        {next ? (
          <ButtonLink to={`/learn/lessons/${next.slug}`} size="sm">
            {next.title}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        ) : (
          <ButtonLink to="/learn" size="sm">
            Back to the Academy
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        )}
      </nav>
    </article>
  )
}

function TryIt({ ids }: { ids: NonNullable<Lesson['calculators']> }) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Calculator className="h-5 w-5 shrink-0 text-brand-400" aria-hidden />
        <p className="text-sm text-surface-200/80">Run the numbers for your own situation.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {CALCULATORS.filter((c) => ids.includes(c.id)).map((c) => (
          <ButtonLink key={c.id} to={calculatorPath(c.id)} variant="secondary" size="sm">
            {c.label}
          </ButtonLink>
        ))}
      </div>
    </Card>
  )
}

function Related({ lesson }: { lesson: Lesson }) {
  const lessons = lesson.relatedLessons.map(findLesson).filter((l) => l !== undefined)
  const terms = lesson.relatedTerms.map(findTerm).filter((t) => t !== undefined)
  return (
    <Card className="grid gap-5 sm:grid-cols-2">
      <div>
        <h2 className="mb-2 text-sm font-bold text-white">Related lessons</h2>
        <ul className="space-y-1.5">
          {lessons.map((l) => (
            <li key={l.slug}>
              <Link to={`/learn/lessons/${l.slug}`} className="text-sm text-brand-400 hover:text-brand-300 hover:underline">
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-bold text-white">Terms in this lesson</h2>
        <div className="flex flex-wrap gap-1.5">
          {terms.map((t) => (
            <Link
              key={t.id}
              to={`/learn/glossary#${t.id}`}
              className="rounded-full border border-surface-700 bg-surface-800 px-2.5 py-0.5 text-xs text-surface-200/80 transition-colors hover:border-brand-500 hover:text-brand-300"
            >
              {t.term}
            </Link>
          ))}
        </div>
      </div>
    </Card>
  )
}

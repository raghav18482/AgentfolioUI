import { clsx } from 'clsx'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { allAnswered, emptyAnswers, scoreQuiz, type QuizAnswers, type QuizResult } from '@/lib/academy/quiz'
import { useAcademyProgress } from '@/store/academyProgress'
import type { QuizQuestion } from './content/types'

interface LessonQuizProps {
  slug: string
  questions: QuizQuestion[]
}

/**
 * The lesson's knowledge check. Submitting completes the lesson at any score
 * and keeps the best score; "Try again" clears the answers but never the
 * completion. Remount it per lesson (`key={slug}`) so answers don't carry over.
 */
export function LessonQuiz({ slug, questions }: LessonQuizProps) {
  const recordQuiz = useAcademyProgress((s) => s.recordQuiz)
  const best = useAcademyProgress((s) => s.bestScore[slug])
  const [answers, setAnswers] = useState<QuizAnswers>(() => emptyAnswers(questions.length))
  const [result, setResult] = useState<QuizResult | null>(null)

  function choose(question: number, option: number) {
    if (result) return
    setAnswers((prev) => prev.map((a, i) => (i === question ? option : a)))
  }

  function submit() {
    const scored = scoreQuiz(questions, answers)
    setResult(scored)
    recordQuiz(slug, scored.score, scored.total)
  }

  function retry() {
    setAnswers(emptyAnswers(questions.length))
    setResult(null)
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-white">Quick check</h2>
        {best && (
          <span className="text-xs text-surface-200/55">
            Best so far: {best.score}/{best.total}
          </span>
        )}
      </div>

      <ol className="space-y-6">
        {questions.map((q, qi) => (
          <li key={q.prompt}>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-white">
                {qi + 1}. {q.prompt}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((option, oi) => {
                  const picked = answers[qi] === oi
                  const isRight = oi === q.correctIndex
                  return (
                    <label
                      key={option}
                      className={clsx(
                        'flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors',
                        result ? 'cursor-default' : 'cursor-pointer hover:border-surface-600',
                        result && isRight && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100',
                        result && picked && !isRight && 'border-rose-500/50 bg-rose-500/10 text-rose-100',
                        !(result && (isRight || picked)) &&
                          (picked ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-surface-700 text-surface-200/80'),
                      )}
                    >
                      <input
                        type="radio"
                        name={`${slug}-q${qi}`}
                        checked={picked}
                        disabled={result !== null}
                        onChange={() => choose(qi, oi)}
                        className="mt-0.5 accent-brand-500"
                      />
                      <span>{option}</span>
                    </label>
                  )
                })}
              </div>
              {result && (
                <p
                  className={clsx(
                    'mt-2 flex gap-1.5 text-xs leading-relaxed',
                    result.correct[qi] ? 'text-emerald-300' : 'text-rose-300',
                  )}
                >
                  {result.correct[qi] ? (
                    <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                  ) : (
                    <XCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                  )}
                  <span>
                    <span className="font-semibold">{result.correct[qi] ? 'Correct.' : 'Not quite.'}</span>{' '}
                    <span className="text-surface-200/75">{q.explanation}</span>
                  </span>
                </p>
              )}
            </fieldset>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {result ? (
          <>
            <p className="text-sm font-semibold text-white" role="status">
              You scored {result.score}/{result.total}. Lesson marked complete.
            </p>
            <Button variant="secondary" size="sm" onClick={retry}>
              Try again
            </Button>
          </>
        ) : (
          <>
            <Button onClick={submit} disabled={!allAnswered(answers)}>
              Check my answers
            </Button>
            {!allAnswered(answers) && (
              <span className="text-xs text-surface-200/50">Answer every question to check.</span>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

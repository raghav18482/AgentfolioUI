import type { CalculatorId } from '../calculators/ids'

/**
 * Shapes of the Academy's static content. Lessons and glossary terms are plain
 * data in this folder — no backend — so they ship with the build and every
 * cross-reference between them is checked by `content.test.ts`.
 */

export type Level = 'core' | 'intermediate' | 'advanced'

export type PathId = 'managing-money' | 'investing-decisions'

export interface LearningPath {
  id: PathId
  title: string
  description: string
  level: Level
}

/** An authoritative reference, dated so readers know how current it is. */
export interface Source {
  label: string
  url: string
  /** When the source was last checked, `YYYY-MM-DD`. */
  asOf: string
}

export interface QuizQuestion {
  prompt: string
  options: string[]
  correctIndex: number
  /** Shown after the quiz is submitted, whichever answer was picked. */
  explanation: string
}

/** Charts a lesson can embed; each maps to a component in `LessonCharts.tsx`. */
export type LessonVisualKey = 'loan-prepayment' | 'goal-future-cost' | 'drawdown-recovery' | 'sip-pause'

export interface Lesson {
  slug: string
  pathId: PathId
  title: string
  /** One line for lesson lists. */
  summary: string
  level: Level
  minutes: number
  objective: string
  /** Markdown paragraphs, read in order. */
  explanation: string[]
  example: { title: string; body: string }
  visual?: LessonVisualKey
  misconception: { myth: string; reality: string }
  quiz: QuizQuestion[]
  takeaways: string[]
  relatedLessons: string[]
  /** Glossary term ids. A term lists the lessons that reference it, derived from this. */
  relatedTerms: string[]
  /** Calculators that put numbers on this lesson's decision. */
  calculators?: CalculatorId[]
  sources?: Source[]
}

export type TermCategory = 'Cash flow & planning' | 'Debt & protection' | 'Investing' | 'Funds' | 'Markets & risk'

export interface AcademyTerm {
  /** Anchor on the glossary page: `/learn/glossary#<id>`. */
  id: string
  term: string
  /** Other names searched alongside the term, e.g. "Stock" for equity. */
  aka?: string[]
  category: TermCategory
  definition: string
  example: string
  related: string[]
  /** A recent addition to Indian markets, badged "New". */
  isNew?: boolean
  sources?: Source[]
}

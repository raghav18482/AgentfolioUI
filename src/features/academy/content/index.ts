import { TERMS } from './glossary'
import { LESSONS } from './lessons'
import { PATHS } from './paths'
import type { AcademyTerm, Lesson, LearningPath, PathId } from './types'

export { LESSONS, PATHS, TERMS }
export { TERM_CATEGORIES } from './glossary'

export function findLesson(slug: string | undefined): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug)
}

export function findPath(id: PathId): LearningPath | undefined {
  return PATHS.find((p) => p.id === id)
}

export function findTerm(id: string): AcademyTerm | undefined {
  return TERMS.find((t) => t.id === id)
}

/** A path's lessons in reading order. */
export function lessonsInPath(id: PathId): Lesson[] {
  return LESSONS.filter((l) => l.pathId === id)
}

/** The lessons before and after this one in its path, for prev/next links. */
export function neighbours(lesson: Lesson): { prev?: Lesson; next?: Lesson } {
  const inPath = lessonsInPath(lesson.pathId)
  const i = inPath.findIndex((l) => l.slug === lesson.slug)
  return { prev: inPath[i - 1], next: inPath[i + 1] }
}

/** Lessons that list this term as related — the glossary's "Learn more" links. */
export function lessonsForTerm(id: string): Lesson[] {
  return LESSONS.filter((l) => l.relatedTerms.includes(id))
}

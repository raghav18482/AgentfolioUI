/**
 * Learning progress as plain data and pure transitions, so the rules are tested
 * without a store or a browser. `store/academyProgress.ts` persists it locally.
 * Holds lesson slugs, dates and scores only — never anything about the person.
 */
export interface ProgressData {
  /** Lesson slug → when its quiz was first submitted (ISO). */
  completed: Record<string, string>
  /** Lesson slug → best quiz result so far. */
  bestScore: Record<string, { score: number; total: number }>
  /** The lesson most recently opened, for "Continue where you left off". */
  lastLesson: string | null
}

export function emptyProgress(): ProgressData {
  return { completed: {}, bestScore: {}, lastLesson: null }
}

/**
 * Submitting a quiz completes its lesson at any score. Completion keeps its
 * first date; the best score only ever goes up.
 */
export function applyQuizResult(
  state: ProgressData,
  slug: string,
  score: number,
  total: number,
  nowIso: string,
): ProgressData {
  const prev = state.bestScore[slug]
  const better = !prev || score / total > prev.score / prev.total
  return {
    ...state,
    completed: state.completed[slug] ? state.completed : { ...state.completed, [slug]: nowIso },
    bestScore: better ? { ...state.bestScore, [slug]: { score, total } } : state.bestScore,
  }
}

export function isComplete(state: ProgressData, slug: string): boolean {
  return Boolean(state.completed[slug])
}

/** How many of `slugs` are complete. */
export function completedCount(state: ProgressData, slugs: readonly string[]): number {
  return slugs.filter((s) => isComplete(state, s)).length
}

export function hasAnyProgress(state: ProgressData): boolean {
  return Object.keys(state.completed).length > 0 || state.lastLesson !== null
}

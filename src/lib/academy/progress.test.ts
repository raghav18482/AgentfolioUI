import { describe, expect, it } from 'vitest'
import { applyQuizResult, completedCount, emptyProgress, hasAnyProgress, isComplete } from './progress'

const T1 = '2026-10-01T10:00:00.000Z'
const T2 = '2026-10-02T10:00:00.000Z'

describe('applyQuizResult', () => {
  it('completes the lesson at any score, including zero', () => {
    const s = applyQuizResult(emptyProgress(), 'budgeting', 0, 4, T1)
    expect(isComplete(s, 'budgeting')).toBe(true)
    expect(s.bestScore.budgeting).toEqual({ score: 0, total: 4 })
  })

  it('keeps the first completion date', () => {
    const s = applyQuizResult(applyQuizResult(emptyProgress(), 'budgeting', 1, 4, T1), 'budgeting', 4, 4, T2)
    expect(s.completed.budgeting).toBe(T1)
  })

  it('only ever raises the best score', () => {
    let s = applyQuizResult(emptyProgress(), 'budgeting', 3, 4, T1)
    s = applyQuizResult(s, 'budgeting', 1, 4, T2)
    expect(s.bestScore.budgeting).toEqual({ score: 3, total: 4 })
    s = applyQuizResult(s, 'budgeting', 4, 4, T2)
    expect(s.bestScore.budgeting).toEqual({ score: 4, total: 4 })
  })

  it('does not mutate the previous state', () => {
    const before = emptyProgress()
    applyQuizResult(before, 'budgeting', 2, 4, T1)
    expect(before).toEqual(emptyProgress())
  })
})

describe('progress summaries', () => {
  it('counts completed lessons among the given slugs', () => {
    const s = applyQuizResult(applyQuizResult(emptyProgress(), 'a', 1, 2, T1), 'b', 2, 2, T1)
    expect(completedCount(s, ['a', 'b', 'c'])).toBe(2)
    expect(completedCount(s, ['c'])).toBe(0)
  })

  it('reports whether anything is saved, so a reset is offered only then', () => {
    expect(hasAnyProgress(emptyProgress())).toBe(false)
    expect(hasAnyProgress({ ...emptyProgress(), lastLesson: 'a' })).toBe(true)
    expect(hasAnyProgress(applyQuizResult(emptyProgress(), 'a', 1, 2, T1))).toBe(true)
  })
})

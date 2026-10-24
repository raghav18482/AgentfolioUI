import { describe, expect, it } from 'vitest'
import { allAnswered, emptyAnswers, scoreQuiz } from './quiz'

const questions = [{ correctIndex: 1 }, { correctIndex: 0 }, { correctIndex: 3 }]

describe('scoreQuiz', () => {
  it('counts correct answers and marks each question', () => {
    expect(scoreQuiz(questions, [1, 2, 3])).toEqual({ score: 2, total: 3, correct: [true, false, true] })
  })

  it('treats an unanswered question as wrong', () => {
    expect(scoreQuiz(questions, [null, 0, null]).score).toBe(1)
  })

  it('rejects an answer list of the wrong length', () => {
    expect(() => scoreQuiz(questions, [1, 0])).toThrow()
  })
})

describe('allAnswered', () => {
  it('is false until every question has an answer', () => {
    expect(allAnswered(emptyAnswers(2))).toBe(false)
    expect(allAnswered([0, null])).toBe(false)
    expect(allAnswered([0, 2])).toBe(true)
  })

  it('is false for a quiz with no questions', () => {
    expect(allAnswered([])).toBe(false)
  })
})

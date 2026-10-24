import { describe, expect, it } from 'vitest'
import { findLesson, findTerm, LESSONS, lessonsInPath, PATHS, TERM_CATEGORIES, TERMS } from './index'

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function duplicates(values: string[]): string[] {
  return values.filter((v, i) => values.indexOf(v) !== i)
}

describe('lessons', () => {
  it('have unique, URL-safe slugs', () => {
    const slugs = LESSONS.map((l) => l.slug)
    expect(duplicates(slugs)).toEqual([])
    for (const slug of slugs) expect(slug).toMatch(SLUG)
  })

  it('cover both paths: six lessons each, kept together in reading order', () => {
    expect(PATHS.map((p) => p.id)).toEqual(['managing-money', 'investing-decisions'])
    for (const p of PATHS) expect(lessonsInPath(p.id)).toHaveLength(6)
    const order = LESSONS.map((l) => l.pathId)
    expect(order).toEqual([...order].sort((a, b) => PATHS.findIndex((p) => p.id === a) - PATHS.findIndex((p) => p.id === b)))
  })

  it('belong to a known path, and every path has lessons', () => {
    for (const l of LESSONS) expect(PATHS.map((p) => p.id)).toContain(l.pathId)
    for (const p of PATHS) expect(lessonsInPath(p.id).length).toBeGreaterThan(0)
  })

  it.each(LESSONS.map((l) => [l.slug, l] as const))('%s has every required section', (_, l) => {
    expect(l.title.trim()).not.toBe('')
    expect(l.summary.trim()).not.toBe('')
    expect(l.objective.trim()).not.toBe('')
    expect(l.explanation.length).toBeGreaterThanOrEqual(3)
    expect(l.example.title.trim()).not.toBe('')
    expect(l.example.body.trim()).not.toBe('')
    expect(l.misconception.myth.trim()).not.toBe('')
    expect(l.misconception.reality.trim()).not.toBe('')
    expect(l.takeaways.length).toBeGreaterThanOrEqual(2)
    expect(l.relatedLessons.length + l.relatedTerms.length).toBeGreaterThan(0)
    expect(l.minutes).toBeGreaterThan(0)
  })

  it.each(LESSONS.map((l) => [l.slug, l] as const))('%s has a valid 3–5 question quiz', (_, l) => {
    expect(l.quiz.length).toBeGreaterThanOrEqual(3)
    expect(l.quiz.length).toBeLessThanOrEqual(5)
    for (const q of l.quiz) {
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(duplicates(q.options)).toEqual([])
      expect(Number.isInteger(q.correctIndex)).toBe(true)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.explanation.trim()).not.toBe('')
    }
    expect(duplicates(l.quiz.map((q) => q.prompt))).toEqual([])
  })

  it('only reference lessons and terms that exist', () => {
    for (const l of LESSONS) {
      for (const s of l.relatedLessons) {
        expect(findLesson(s), `${l.slug} → lesson ${s}`).toBeDefined()
        expect(s, `${l.slug} lists itself`).not.toBe(l.slug)
      }
      for (const t of l.relatedTerms) expect(findTerm(t), `${l.slug} → term ${t}`).toBeDefined()
    }
  })
})

describe('glossary', () => {
  it('has unique, URL-safe ids and unique names', () => {
    expect(duplicates(TERMS.map((t) => t.id))).toEqual([])
    expect(duplicates(TERMS.map((t) => t.term.toLowerCase()))).toEqual([])
    for (const t of TERMS) expect(t.id).toMatch(SLUG)
  })

  it('gives every term a definition, an example and a known category', () => {
    for (const t of TERMS) {
      expect(t.definition.trim(), t.id).not.toBe('')
      expect(t.example.trim(), t.id).not.toBe('')
      expect(TERM_CATEGORIES, t.id).toContain(t.category)
    }
  })

  it('only relates terms that exist, and never a term to itself', () => {
    for (const t of TERMS) {
      for (const r of t.related) {
        expect(findTerm(r), `${t.id} → ${r}`).toBeDefined()
        expect(r).not.toBe(t.id)
      }
    }
  })

  it('includes the terms the Academy promises', () => {
    const promised = [
      'etf', 'sif', 'nav', 'sip', 'cagr', 'xirr', 'inflation', 'volatility', 'liquidity', 'drawdown',
      'diversification', 'market-capitalisation', 'derivatives', 'emi', 'loan-prepayment', 'liquid-fund',
      'tri-benchmark', 'risk-capacity', 'ctc-vs-take-home', 'term-insurance', 'riskometer', 'loss-aversion',
    ]
    for (const id of promised) {
      expect(findTerm(id), id).toBeDefined()
    }
  })

  it('every category has at least one term', () => {
    for (const c of TERM_CATEGORIES) expect(TERMS.some((t) => t.category === c), c).toBe(true)
  })
})

describe('sources', () => {
  it('are https links with an as-of date', () => {
    const sources = [...LESSONS.flatMap((l) => l.sources ?? []), ...TERMS.flatMap((t) => t.sources ?? [])]
    for (const s of sources) {
      expect(s.url).toMatch(/^https:\/\//)
      expect(s.asOf).toMatch(ISO_DATE)
      expect(s.label.trim()).not.toBe('')
    }
  })

  it('back every term marked as new', () => {
    for (const t of TERMS.filter((t) => t.isNew)) expect(t.sources?.length, t.id).toBeGreaterThan(0)
  })
})

describe('audience', () => {
  it('addresses working adults: no student or age-based copy anywhere in the content', () => {
    const text = JSON.stringify([LESSONS, TERMS, PATHS])
    expect(text).not.toMatch(/under[- ]?18|class 10|school students?|\bminors?\b|complete beginners?/i)
  })
})

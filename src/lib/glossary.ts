import type { Glossary, GlossaryBand, GlossaryMetric } from '@/types'

/** Pillars in the order the score and the guide present them. */
export const PILLAR_ORDER = ['valuation', 'profitability', 'balance_sheet', 'growth'] as const

export function metricsForPillar(metrics: Glossary['metrics'], pillar: string): Array<GlossaryMetric & { key: string }> {
  return Object.entries(metrics)
    .filter(([, m]) => m.pillar === pillar)
    .map(([key, m]) => ({ key, ...m }))
}

/**
 * The value range a band covers, from its own upper bound and the previous
 * band's: `up to 10`, `10 to 25`, `above 25`. A band with no upper bound and no
 * predecessor covers everything.
 */
export function bandRange(bands: GlossaryBand[], index: number): string {
  const band = bands[index]
  const prev = index > 0 ? bands[index - 1].max : null
  if (band.max === null) return prev === null ? 'any value' : `above ${prev}`
  if (prev === null) return `up to ${band.max}`
  return `${prev} to ${band.max}`
}

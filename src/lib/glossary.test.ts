import { describe, expect, it } from 'vitest'
import type { GlossaryBand } from '@/types'
import { bandRange, metricsForPillar } from './glossary'

const band = (max: number | null): GlossaryBand => ({ max, verdict: 'good', note: '' })

describe('bandRange', () => {
  const bands = [band(0), band(10), band(25), band(null)]

  it('describes each band from its neighbours', () => {
    expect(bandRange(bands, 0)).toBe('up to 0')
    expect(bandRange(bands, 1)).toBe('0 to 10')
    expect(bandRange(bands, 2)).toBe('10 to 25')
    expect(bandRange(bands, 3)).toBe('above 25')
  })

  it('treats a lone open band as any value', () => {
    expect(bandRange([band(null)], 0)).toBe('any value')
  })
})

describe('metricsForPillar', () => {
  it('keeps the key and filters by pillar', () => {
    const metrics = {
      pe: { pillar: 'valuation', label: 'P/E' },
      roe: { pillar: 'profitability', label: 'ROE' },
    } as never
    expect(metricsForPillar(metrics, 'valuation').map((m) => m.key)).toEqual(['pe'])
  })
})

import { describe, expect, it } from 'vitest'
import type { Candle } from '@/types'
import { applyTick, indiaToday, toCandleSeries } from './candlestick'

const candles: Candle[] = [
  ['2025-01-06T00:00:00+05:30', 100, 110, 95, 105, 1000],
  ['2025-01-07T00:00:00+05:30', 105, 108, 99, 101, 2000],
]

describe('toCandleSeries', () => {
  it("reorders the broker's [o, h, l, c] into ECharts' [o, c, l, h]", () => {
    const series = toCandleSeries(candles)
    expect(series.ohlc[0]).toEqual([100, 105, 95, 110])
    expect(series.dates).toEqual(['2025-01-06', '2025-01-07'])
    expect(series.volumes).toEqual([1000, 2000])
  })
})

describe('applyTick', () => {
  const series = toCandleSeries(candles)

  it("extends today's bar when the history already includes today", () => {
    const next = applyTick(series, 112, '2025-01-07')
    expect(next.ohlc.at(-1)).toEqual([105, 112, 99, 112])
    expect(next.dates).toHaveLength(2)
  })

  it('lowers the low on a falling tick', () => {
    expect(applyTick(series, 97, '2025-01-07').ohlc.at(-1)).toEqual([105, 97, 97, 108])
  })

  it('opens a new bar when the history ends before today', () => {
    const next = applyTick(series, 102, '2025-01-08')
    expect(next.dates.at(-1)).toBe('2025-01-08')
    expect(next.ohlc.at(-1)).toEqual([102, 102, 102, 102])
    expect(next.volumes.at(-1)).toBe(0)
  })

  it('never mutates the series it was given', () => {
    applyTick(series, 999, '2025-01-07')
    expect(series.ohlc[1]).toEqual([105, 101, 99, 108])
  })
})

describe('indiaToday', () => {
  it('uses the India date, which is ahead of UTC late in the UTC day', () => {
    expect(indiaToday(new Date('2025-01-07T20:00:00Z'))).toBe('2025-01-08')
  })
})

import { describe, expect, it } from 'vitest'
import { DEFAULT_PHASES, generateSeries, mulberry32, type Bar } from './data'
import {
  buyAndHold,
  canAct,
  DEFAULT_CONFIG,
  equityAt,
  maxDrawdownPct,
  riskSizedUnits,
  runStrategy,
  startLab,
  step,
  summarise,
  type LabConfig,
  type LabState,
} from './simulator'
import { crossoverSignals, sma } from './strategy'

const SEEDS = [1, 7, 42, 2024, 99_991]
const bar = (day: number, open: number, high: number, low: number, close: number): Bar => ({ day, open, high, low, close })

describe('synthetic data', () => {
  it('is deterministic: the same seed always draws the same series', () => {
    expect(generateSeries(42)).toEqual(generateSeries(42))
    expect(generateSeries(42).bars).not.toEqual(generateSeries(43).bars)
    const a = mulberry32(5)
    const b = mulberry32(5)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('has 240 internally consistent, positive bars across the four phases', () => {
    for (const seed of SEEDS) {
      const { bars, phases } = generateSeries(seed)
      expect(bars).toHaveLength(240)
      expect(phases.map((p) => p.name)).toEqual(DEFAULT_PHASES.map((p) => p.name))
      expect(phases.at(-1)?.to).toBe(239)
      for (const b of bars) {
        expect(b.low).toBeGreaterThan(0)
        expect(b.high).toBeGreaterThanOrEqual(Math.max(b.open, b.close))
        expect(b.low).toBeLessThanOrEqual(Math.min(b.open, b.close))
      }
      expect(bars.map((b) => b.day)).toEqual(Array.from({ length: 240 }, (_, i) => i + 1))
    }
  })
})

describe('moving averages and signals', () => {
  it('computes a simple moving average, null until enough closes', () => {
    expect(sma([1, 2, 3, 4, 5], 3)).toEqual([null, null, 2, 3, 4])
    expect(() => sma([1, 2], 0)).toThrow()
  })

  it('signals a buy on an upward cross and a sell on a downward cross', () => {
    const closes = [10, 10, 10, 10, 13, 13, 13, 7, 7]
    const signals = crossoverSignals(closes, 2, 3)
    expect(signals.indexOf('buy')).toBe(4)
    expect(signals.indexOf('sell')).toBe(7)
    expect(signals.filter(Boolean)).toHaveLength(2)
  })

  it('never looks ahead: adding later bars never changes an earlier signal or average', () => {
    for (const seed of SEEDS) {
      const closes = generateSeries(seed).bars.map((b) => b.close)
      const full = crossoverSignals(closes, 10, 30)
      const fullSma = sma(closes, 30)
      for (let k = 1; k <= closes.length; k += 7) {
        expect(crossoverSignals(closes.slice(0, k), 10, 30)).toEqual(full.slice(0, k))
        expect(sma(closes.slice(0, k), 30)).toEqual(fullSma.slice(0, k))
      }
    }
  })

  it('rejects a fast average that is not shorter than the slow one', () => {
    expect(() => crossoverSignals([1, 2, 3], 5, 5)).toThrow()
  })
})

/** Asserts the books balance after every step. */
function expectReconciled(state: LabState, bars: Bar[], config: LabConfig) {
  const closedPnl = state.trades.reduce((s, t) => s + t.pnl, 0)
  if (!state.position) expect(state.cash).toBeCloseTo(config.startCash + closedPnl, 6)
  else {
    const p = state.position
    expect(state.cash).toBeCloseTo(config.startCash + closedPnl - p.units * p.entryPrice - p.entryCost, 6)
  }
  expect(state.equity.at(-1)).toBeCloseTo(equityAt(state, bars), 6)
  expect(state.cash).toBeGreaterThanOrEqual(-1e-6)
  for (const t of state.trades) {
    expect(t.pnl).toBeCloseTo((t.exitPrice - t.entryPrice) * t.units - t.costs, 6)
    expect(t.exitIndex).toBeGreaterThanOrEqual(t.entryIndex)
  }
}

describe('simulator', () => {
  it('fills a decision made at a bar’s close at the next bar’s open', () => {
    const { bars } = generateSeries(42)
    let s = startLab(bars, DEFAULT_CONFIG)
    const decidedAt = s.cursor
    s = step(s, bars, DEFAULT_CONFIG, 'buy')
    expect(s.cursor).toBe(decidedAt + 1)
    expect(s.position?.entryPrice ?? s.trades[0]?.entryPrice).toBe(bars[decidedAt + 1].open)
  })

  it('reconciles cash, positions, trades and equity at every step of the strategy', () => {
    for (const seed of SEEDS) {
      const { bars } = generateSeries(seed)
      let s = startLab(bars, DEFAULT_CONFIG)
      while (s.cursor < bars.length - 1) {
        const visible = bars.slice(0, s.cursor + 1).map((b) => b.close)
        const sig = crossoverSignals(visible, 10, 30)[s.cursor]
        s = step(s, bars, DEFAULT_CONFIG, sig === 'buy' && !s.position ? 'buy' : sig === 'sell' && s.position ? 'sell' : 'wait')
        expectReconciled(s, bars, DEFAULT_CONFIG)
      }
      expect(s).toEqual(runStrategy(bars, DEFAULT_CONFIG))
    }
  })

  it('treats impossible actions as Wait: no Sell while flat, no second Buy while holding', () => {
    const { bars } = generateSeries(7)
    const start = startLab(bars, DEFAULT_CONFIG)
    expect(canAct('sell', start, bars, DEFAULT_CONFIG)).toBe(false)
    const afterSell = step(start, bars, DEFAULT_CONFIG, 'sell')
    expect(afterSell.trades).toHaveLength(0)
    expect(afterSell.cash).toBe(DEFAULT_CONFIG.startCash)

    const config = { ...DEFAULT_CONFIG, stopPct: 50 }
    const holding = step(start, bars, config, 'buy')
    expect(holding.position).not.toBeNull()
    expect(canAct('buy', holding, bars, config)).toBe(false)
    const again = step(holding, bars, config, 'buy')
    expect(again.position?.units).toBe(holding.position?.units)
    expect(again.cash).toBe(holding.cash)
  })

  it('does nothing once the last bar is reached', () => {
    const { bars } = generateSeries(3)
    const end = runStrategy(bars, DEFAULT_CONFIG)
    expect(end.cursor).toBe(bars.length - 1)
    expect(canAct('wait', end, bars, DEFAULT_CONFIG)).toBe(false)
    expect(step(end, bars, DEFAULT_CONFIG, 'buy')).toBe(end)
  })

  it('exits at the stop, or at the open when the bar gaps below it', () => {
    const config: LabConfig = { ...DEFAULT_CONFIG, fast: 1, slow: 2, stopPct: 10, riskPct: 100 }
    // Decide at bar 3's close, fill at bar 4's open (100, stop 90), then bar 5 tests the stop.
    const flat = [bar(1, 100, 100, 100, 100), bar(2, 100, 100, 100, 100), bar(3, 100, 101, 99, 100), bar(4, 100, 101, 99, 100)]
    const touch = [...flat, bar(5, 100, 100, 85, 95)]
    const gap = [...flat, bar(5, 80, 82, 78, 81)]

    let s = step(startLab(touch, config), touch, config, 'buy')
    s = step(s, touch, config, 'wait')
    expect(s.trades[0]).toMatchObject({ exit: 'stop', exitPrice: 90 })

    let g = step(startLab(gap, config), gap, config, 'buy')
    g = step(g, gap, config, 'wait')
    expect(g.trades[0]).toMatchObject({ exit: 'stop', exitPrice: 80 })
  })

  it('charges costs on both sides, so a round trip at the same price loses exactly the costs', () => {
    const config: LabConfig = { ...DEFAULT_CONFIG, fast: 1, slow: 2, costPct: 0.5, riskPct: 100, stopPct: 50 }
    const bars = [1, 2, 3, 4, 5].map((d) => bar(d, 100, 100, 100, 100))
    let s = step(startLab(bars, config), bars, config, 'buy')
    s = step(s, bars, config, 'sell')
    const t = s.trades[0]
    expect(t.costs).toBeCloseTo(t.units * 100 * 0.005 * 2, 6)
    expect(t.pnl).toBeCloseTo(-t.costs, 6)
    const free = { ...config, costPct: 0 }
    let z = step(startLab(bars, free), bars, free, 'buy')
    z = step(z, bars, free, 'sell')
    expect(z.trades[0].pnl).toBe(0)
  })

  it('sizes positions by risk, capped by available cash', () => {
    expect(riskSizedUnits(1_00_000, 1, 100, 95)).toBe(200)
    expect(riskSizedUnits(1_00_000, 1, 100, 100)).toBe(0)
    const { bars } = generateSeries(42)
    const s = step(startLab(bars, DEFAULT_CONFIG), bars, DEFAULT_CONFIG, 'buy')
    if (!s.position) throw new Error('expected a position')
    expect(s.position.units * s.position.entryPrice).toBeLessThanOrEqual(DEFAULT_CONFIG.startCash)
    const lossAtStop = s.position.units * (s.position.entryPrice - s.position.stop)
    expect(lossAtStop).toBeLessThanOrEqual(DEFAULT_CONFIG.startCash * 0.0105)
  })
})

describe('buy-and-hold and summary', () => {
  it('buys at the first possible fill with the same costs and tracks the same bars', () => {
    const { bars } = generateSeries(42)
    const bh = buyAndHold(bars, DEFAULT_CONFIG)
    const run = runStrategy(bars, DEFAULT_CONFIG)
    expect(bh.equity).toHaveLength(run.equity.length)
    const entry = bars[31].open
    expect(bh.units).toBe(Math.floor(1_00_000 / (entry * 1.001)))
    const cash = 1_00_000 - bh.units * entry * 1.001
    expect(bh.equity.at(-1)).toBeCloseTo(cash + bh.units * bars[239].close, 6)
  })

  it('measures maximum drawdown from the running peak', () => {
    expect(maxDrawdownPct([100, 120, 90, 130, 117])).toBeCloseTo(25, 10)
    expect(maxDrawdownPct([100, 110, 120])).toBe(0)
  })

  it('summarises a run consistently with its trades', () => {
    const { bars } = generateSeries(2024)
    const run = runStrategy(bars, DEFAULT_CONFIG)
    const sum = summarise(run, bars, DEFAULT_CONFIG)
    expect(sum.trades).toBe(run.trades.length)
    expect(sum.wins).toBe(run.trades.filter((t) => t.pnl > 0).length)
    expect(sum.equity).toBeCloseTo(run.equity.at(-1) ?? 0, 6)
    expect(sum.returnPct).toBeCloseTo((sum.equity / 1_00_000 - 1) * 100, 10)
  })
})

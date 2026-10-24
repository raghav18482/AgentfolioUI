/**
 * Deterministic synthetic prices for the Trading Lab. Every series comes from a
 * seed, so the same seed always draws the same chart. These are not market
 * data, do not describe any real security, and predict nothing.
 */

export interface Bar {
  /** 1-based trading day within the series. */
  day: number
  open: number
  high: number
  low: number
  close: number
}

export type PhaseName = 'Uptrend' | 'Sideways' | 'Downtrend' | 'Recovery'

export interface Phase {
  name: PhaseName
  /** Daily drift and volatility, as fractions (0.002 = 0.2%). */
  drift: number
  volatility: number
  bars: number
}

/** The default market: a rise, a range, a fall and a recovery — 240 trading days. */
export const DEFAULT_PHASES: readonly Phase[] = [
  { name: 'Uptrend', drift: 0.0025, volatility: 0.012, bars: 60 },
  { name: 'Sideways', drift: 0, volatility: 0.011, bars: 60 },
  { name: 'Downtrend', drift: -0.003, volatility: 0.016, bars: 60 },
  { name: 'Recovery', drift: 0.002, volatility: 0.013, bars: 60 },
]

export interface SyntheticSeries {
  bars: Bar[]
  /** Where each phase starts and ends (bar indexes, inclusive) — revealed only after a run. */
  phases: Array<{ name: PhaseName; from: number; to: number }>
}

/** mulberry32: a small, fast, seedable PRNG returning values in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A standard normal draw (Box–Muller) from a uniform source. */
function normal(random: () => number): number {
  const u = Math.max(random(), Number.EPSILON)
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random())
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function generateSeries(seed: number, phases: readonly Phase[] = DEFAULT_PHASES, startPrice = 100): SyntheticSeries {
  const random = mulberry32(seed)
  const bars: Bar[] = []
  const spans: SyntheticSeries['phases'] = []
  let prevClose = startPrice

  for (const phase of phases) {
    const from = bars.length
    for (let k = 0; k < phase.bars; k++) {
      const open = prevClose * (1 + phase.volatility * 0.3 * normal(random))
      const close = open * (1 + phase.drift + phase.volatility * normal(random))
      const high = Math.max(open, close) * (1 + Math.abs(normal(random)) * phase.volatility * 0.4)
      const low = Math.min(open, close) * (1 - Math.abs(normal(random)) * phase.volatility * 0.4)
      const bar = { day: bars.length + 1, open: round2(open), high: round2(high), low: round2(low), close: round2(close) }
      // Rounding can nudge open/close past high/low by a paisa; keep every bar internally consistent.
      bar.high = Math.max(bar.high, bar.open, bar.close)
      bar.low = Math.max(0.01, Math.min(bar.low, bar.open, bar.close))
      bars.push(bar)
      prevClose = bar.close
    }
    spans.push({ name: phase.name, from, to: bars.length - 1 })
  }
  return { bars, phases: spans }
}

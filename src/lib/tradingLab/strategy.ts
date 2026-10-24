/**
 * The moving-average crossover. Every value at index t is computed from
 * closes up to and including t, never later ones — see `strategy.test.ts`.
 */

/** Simple moving average; `null` until `period` closes exist. */
export function sma(values: readonly number[], period: number): Array<number | null> {
  if (!Number.isInteger(period) || period < 1) throw new Error('The period must be a positive whole number')
  const out: Array<number | null> = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i >= period) sum -= values[i - period]
    out.push(i >= period - 1 ? sum / period : null)
  }
  return out
}

export type Signal = 'buy' | 'sell' | null

/**
 * Signal at the close of bar t: `buy` when the fast average crosses above the
 * slow one between t − 1 and t, `sell` when it crosses below, otherwise none.
 */
export function crossoverSignals(closes: readonly number[], fast: number, slow: number): Signal[] {
  if (fast >= slow) throw new Error('The fast average must be shorter than the slow one')
  const f = sma(closes, fast)
  const s = sma(closes, slow)
  return closes.map((_, t) => {
    if (t === 0) return null
    const [f0, s0, f1, s1] = [f[t - 1], s[t - 1], f[t], s[t]]
    if (f0 === null || s0 === null || f1 === null || s1 === null) return null
    if (f0 <= s0 && f1 > s1) return 'buy'
    if (f0 >= s0 && f1 < s1) return 'sell'
    return null
  })
}

/** The first bar at which a crossover can be read: both averages exist at t − 1 and t. */
export function firstSignalBar(slow: number): number {
  return slow
}

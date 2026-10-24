/**
 * Maths behind the investing lessons' examples. Price paths here are made up
 * to illustrate a mechanism; they are not market data or forecasts.
 */

/** The gain needed to get back to a previous peak after falling `lossPct` percent. */
export function gainToRecover(lossPct: number): number {
  if (lossPct < 0 || lossPct >= 100) throw new Error('A loss must be at least 0% and below 100%')
  return (100 / (100 - lossPct) - 1) * 100
}

export interface InstalmentResult {
  invested: number
  units: number
  /** Value at the last price in the path. */
  value: number
  /** Holding value at each price in the path, after that period's purchase. */
  valueSeries: number[]
}

/**
 * Buys `amounts[i]` worth of units at `prices[i]` and values the holding along
 * the path. `prices` may run longer than `amounts`, to value after the last purchase.
 */
export function investInstalments(prices: readonly number[], amounts: readonly number[]): InstalmentResult {
  if (amounts.length > prices.length) throw new Error('Every instalment needs a price')
  if (prices.some((p) => p <= 0)) throw new Error('Prices must be positive')
  let units = 0
  let invested = 0
  const valueSeries = prices.map((price, i) => {
    const amount = amounts[i] ?? 0
    units += amount / price
    invested += amount
    return units * price
  })
  return { invested, units, value: valueSeries[valueSeries.length - 1], valueSeries }
}

/** A path moving in straight lines between `[month, price]` points, one price per month. */
export function piecewisePath(points: ReadonlyArray<readonly [number, number]>): number[] {
  const path: number[] = []
  for (let k = 0; k < points.length - 1; k++) {
    const [m0, p0] = points[k]
    const [m1, p1] = points[k + 1]
    for (let m = m0; m < m1; m++) path.push(p0 + ((p1 - p0) * (m - m0)) / (m1 - m0))
  }
  path.push(points[points.length - 1][1])
  return path
}

/** The made-up fund price path behind the investor-behaviour lesson: −30%, back to the start, then +15%. */
export const FALL_AND_RECOVERY_PATH = piecewisePath([
  [0, 100],
  [12, 70],
  [24, 100],
  [36, 115],
])

/** A ₹20,000 monthly SIP for 36 months, optionally paused for months `pauseFrom`–`pauseTo` inclusive. */
export function sipAmounts(pauseFrom?: number, pauseTo?: number): number[] {
  return Array.from({ length: 36 }, (_, m) =>
    pauseFrom !== undefined && pauseTo !== undefined && m >= pauseFrom && m <= pauseTo ? 0 : 20_000,
  )
}

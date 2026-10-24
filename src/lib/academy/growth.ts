/**
 * Growth maths behind lesson charts, examples and calculators. Rates are
 * percentages per year (10 means 10%) and are always assumptions, never forecasts.
 */

/** Value after each year of annual compounding; index 0 is the starting amount. */
export function compoundSeries(principal: number, ratePct: number, years: number): number[] {
  return Array.from({ length: years + 1 }, (_, y) => principal * (1 + ratePct / 100) ** y)
}

/** The monthly rate that compounds to `annualPct` over twelve months. */
export function monthlyRate(annualPct: number): number {
  return (1 + annualPct / 100) ** (1 / 12) - 1
}

/** What `monthly`, invested at the start of each month for `months`, grows to at an assumed annual return. */
export function sipFutureValue(monthly: number, annualPct: number, months: number): number {
  const i = monthlyRate(annualPct)
  if (i === 0) return monthly * months
  return monthly * (((1 + i) ** months - 1) / i) * (1 + i)
}

/**
 * The monthly investment, made at the start of each month, that grows to
 * `target` over `months` at an assumed annual return.
 */
export function monthlyInvestmentFor(target: number, annualPct: number, months: number): number {
  if (months <= 0) throw new Error('The horizon must be at least one month')
  if (target <= 0) return 0
  return target / sipFutureValue(1, annualPct, months)
}

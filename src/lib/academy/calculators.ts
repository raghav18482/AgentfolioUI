import { compoundSeries, monthlyInvestmentFor, sipFutureValue } from './growth'
import { amortize, emi } from './loans'

/**
 * The Academy calculators: input validation and deterministic projections.
 * Every rate is a user-entered assumption; nothing here is a forecast.
 */

export type FieldErrors<K extends string> = Partial<Record<K, string>>

export type CalcResult<K extends string, R> = { ok: true; result: R } | { ok: false; errors: FieldErrors<K> }

export interface FieldRule {
  label: string
  min: number
  max: number
  /** Whether `min` itself is allowed (amounts must be above zero; rates may be zero). */
  minInclusive?: boolean
  integer?: boolean
}

/**
 * A number typed by a person: commas, spaces and a leading ₹ are ignored, but
 * anything else that is not a number is rejected outright rather than half-read.
 */
export function parseNumberInput(raw: string): number | null {
  const cleaned = raw.replace(/[₹,\s]/g, '')
  if (cleaned === '' || !/^-?\d*\.?\d+$/.test(cleaned)) return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

function check(raw: string, rule: FieldRule): { value: number } | { error: string } {
  const n = parseNumberInput(raw)
  if (n === null) return { error: `Enter ${rule.label} as a number.` }
  const belowMin = rule.minInclusive ? n < rule.min : n <= rule.min
  if (belowMin) return { error: `${capitalise(rule.label)} must be ${rule.minInclusive ? 'at least' : 'more than'} ${rule.min}.` }
  if (n > rule.max) return { error: `${capitalise(rule.label)} can be at most ${rule.max.toLocaleString('en-IN')}.` }
  if (rule.integer && !Number.isInteger(n)) return { error: `${capitalise(rule.label)} must be a whole number.` }
  return { value: n }
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Validates every field; returns the parsed numbers, or one error per bad field. */
export function validate<K extends string>(
  inputs: Record<K, string>,
  rules: Record<K, FieldRule>,
): { ok: true; values: Record<K, number> } | { ok: false; errors: FieldErrors<K> } {
  const values = {} as Record<K, number>
  const errors: FieldErrors<K> = {}
  for (const key of Object.keys(rules) as K[]) {
    const r = check(inputs[key], rules[key])
    if ('error' in r) errors[key] = r.error
    else values[key] = r.value
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, values }
}

const MAX_AMOUNT = 1_000_00_00_000 // ₹1,000 crore — a typo guard, not a judgement
const AMOUNT = { min: 0, max: MAX_AMOUNT }
const RATE = { min: 0, max: 30, minInclusive: true }
const YEARS = { min: 1, max: 50, minInclusive: true, integer: true }

// ── Goal planner ────────────────────────────────────────────────────────────

export type GoalField = 'costToday' | 'years' | 'inflationPct' | 'savedSoFar' | 'returnPct'
export type GoalInputs = Record<GoalField, string>

export interface GoalPlan {
  futureCost: number
  /** What today's savings grow to by the goal date. */
  savingsAtGoal: number
  /** Future cost not covered by today's savings; zero when already covered. */
  gap: number
  /** Monthly investment, at the start of each month, that closes the gap. */
  monthlyNeeded: number
  totalToInvest: number
  /** Year by year: the goal's cost, and the projected corpus with the monthly investment. */
  costByYear: number[]
  corpusByYear: number[]
}

export function planGoal(inputs: GoalInputs): CalcResult<GoalField, GoalPlan> {
  const v = validate(inputs, {
    costToday: { label: 'the cost in today’s money', ...AMOUNT },
    years: { label: 'years to the goal', ...YEARS },
    inflationPct: { label: 'the inflation assumption', ...RATE },
    savedSoFar: { label: 'savings so far', min: 0, max: MAX_AMOUNT, minInclusive: true },
    returnPct: { label: 'the return assumption', ...RATE },
  })
  if (!v.ok) return v
  const { costToday, years, inflationPct, savedSoFar, returnPct } = v.values

  const costByYear = compoundSeries(costToday, inflationPct, years)
  const futureCost = costByYear[years]
  const savingsByYear = compoundSeries(savedSoFar, returnPct, years)
  const savingsAtGoal = savingsByYear[years]
  const gap = Math.max(0, futureCost - savingsAtGoal)
  const monthlyNeeded = monthlyInvestmentFor(gap, returnPct, years * 12)
  const corpusByYear = savingsByYear.map((s, y) => s + sipFutureValue(monthlyNeeded, returnPct, y * 12))

  return {
    ok: true,
    result: {
      futureCost,
      savingsAtGoal,
      gap,
      monthlyNeeded,
      totalToInvest: monthlyNeeded * years * 12,
      costByYear,
      corpusByYear,
    },
  }
}

// ── SIP vs lump sum ─────────────────────────────────────────────────────────

export type SipLumpField = 'total' | 'years' | 'returnPct'
export type SipLumpInputs = Record<SipLumpField, string>

export interface SipLumpProjection {
  /** The same total, invested at once or spread as equal monthly instalments over the horizon. */
  monthlyInstalment: number
  lumpSumValue: number
  sipValue: number
  lumpSumByYear: number[]
  sipByYear: number[]
  /** Amount actually invested by each year-end under the SIP. */
  sipInvestedByYear: number[]
}

export function compareSipLumpSum(inputs: SipLumpInputs): CalcResult<SipLumpField, SipLumpProjection> {
  const v = validate(inputs, {
    total: { label: 'the total amount', ...AMOUNT },
    years: { label: 'the horizon', ...YEARS },
    returnPct: { label: 'the return assumption', ...RATE },
  })
  if (!v.ok) return v
  const { total, years, returnPct } = v.values
  const months = years * 12
  const monthlyInstalment = total / months
  const lumpSumByYear = compoundSeries(total, returnPct, years)
  const sipByYear = Array.from({ length: years + 1 }, (_, y) => sipFutureValue(monthlyInstalment, returnPct, y * 12))

  return {
    ok: true,
    result: {
      monthlyInstalment,
      lumpSumValue: lumpSumByYear[years],
      sipValue: sipByYear[years],
      lumpSumByYear,
      sipByYear,
      sipInvestedByYear: Array.from({ length: years + 1 }, (_, y) => monthlyInstalment * y * 12),
    },
  }
}

// ── Inflation and real return ───────────────────────────────────────────────

export type InflationField = 'amount' | 'years' | 'inflationPct' | 'returnPct'
export type InflationInputs = Record<InflationField, string>

export interface InflationProjection {
  /** What something costing `amount` today costs after `years`. */
  futureCost: number
  /** What `amount` received after `years` is worth in today’s money. */
  todaysValueOfFutureAmount: number
  /** `(1 + return) ÷ (1 + inflation) − 1`, as a percentage. */
  realReturnPct: number
  /** `amount` invested at the assumed return: in rupees, and in today’s money. */
  nominalValue: number
  realValue: number
  nominalByYear: number[]
  realByYear: number[]
}

export function projectInflation(inputs: InflationInputs): CalcResult<InflationField, InflationProjection> {
  const v = validate(inputs, {
    amount: { label: 'the amount', ...AMOUNT },
    years: { label: 'the number of years', ...YEARS },
    inflationPct: { label: 'the inflation assumption', ...RATE },
    returnPct: { label: 'the return assumption', ...RATE },
  })
  if (!v.ok) return v
  const { amount, years, inflationPct, returnPct } = v.values
  const priceLevel = compoundSeries(1, inflationPct, years)
  const nominalByYear = compoundSeries(amount, returnPct, years)
  const realByYear = nominalByYear.map((n, y) => n / priceLevel[y])

  return {
    ok: true,
    result: {
      futureCost: amount * priceLevel[years],
      todaysValueOfFutureAmount: amount / priceLevel[years],
      realReturnPct: ((1 + returnPct / 100) / (1 + inflationPct / 100) - 1) * 100,
      nominalValue: nominalByYear[years],
      realValue: realByYear[years],
      nominalByYear,
      realByYear,
    },
  }
}

// ── Prepay loan vs invest ───────────────────────────────────────────────────

export type PrepayMode = 'tenure' | 'emi'
export type PrepayField = 'outstanding' | 'ratePct' | 'months' | 'prepayment' | 'returnPct'
export type PrepayInputs = Record<PrepayField, string> & { mode: PrepayMode }

export interface PrepayComparison {
  currentEmi: number
  /** EMI after prepaying: unchanged when the tenure shrinks, lower when the EMI does; 0 if the loan is closed. */
  newEmi: number
  /** Months until the loan closes after prepaying. */
  newMonths: number
  monthsSaved: number
  interestSaved: number
  /**
   * Wealth at the loan's original end date, when both choices spend the same
   * current EMI every month and invest whatever the loan no longer needs.
   */
  prepayThenInvest: number
  investInstead: number
  /** The annual return at which the two choices end level; above it, investing wins. */
  breakEvenReturnPct: number
  /** Outstanding balance at each year-end, without and with the prepayment. */
  balanceByYear: number[]
  prepaidBalanceByYear: number[]
}

/** Amount paid to the lender in each month 1…n, from a schedule's balances. */
function paymentsFrom(balances: number[], monthlyRate: number, n: number): number[] {
  return Array.from({ length: n }, (_, k) => {
    const before = balances[k]
    const after = balances[k + 1]
    return before === undefined || after === undefined ? 0 : before * (1 + monthlyRate) - after
  })
}

/** Balance at each year-end of the original tenure; zero once a schedule has closed. */
function yearEnds(balances: number[], months: number): number[] {
  return Array.from({ length: Math.ceil(months / 12) + 1 }, (_, y) => balances[y * 12] ?? 0)
}

/** Future value at month `n` of `flows[k]` received at the end of month k + 1, at an assumed annual return. */
function futureValueOfFlows(flows: number[], annualPct: number, n: number): number {
  const i = (1 + annualPct / 100) ** (1 / 12) - 1
  return flows.reduce((sum, f, k) => sum + f * (1 + i) ** (n - (k + 1)), 0)
}

export function comparePrepayment(inputs: PrepayInputs): CalcResult<PrepayField, PrepayComparison> {
  const v = validate<PrepayField>(inputs, {
    outstanding: { label: 'the outstanding loan', ...AMOUNT },
    ratePct: { label: 'the loan’s interest rate', ...RATE },
    months: { label: 'the remaining tenure in months', min: 1, max: 480, minInclusive: true, integer: true },
    prepayment: { label: 'the prepayment', ...AMOUNT },
    returnPct: { label: 'the return assumption', ...RATE },
  })
  if (!v.ok) return v
  const { outstanding, ratePct, months: n, prepayment, returnPct } = v.values
  if (prepayment > outstanding) {
    return { ok: false, errors: { prepayment: 'The prepayment can’t be more than the outstanding loan.' } }
  }

  const j = ratePct / 1200
  const currentEmi = emi(outstanding, ratePct, n)
  const base = amortize(outstanding, ratePct, currentEmi)
  const remaining = outstanding - prepayment
  const closed = remaining < 0.5

  const newEmi = closed ? 0 : inputs.mode === 'emi' ? emi(remaining, ratePct, n) : currentEmi
  const after = closed ? { balances: [0], months: 0, totalInterest: 0 } : amortize(remaining, ratePct, newEmi)

  // Both choices spend the current EMI every month; whatever the loan doesn't take is invested.
  const freed = paymentsFrom(after.balances, j, n).map((paid) => currentEmi - paid)
  const prepayThenInvest = futureValueOfFlows(freed, returnPct, n)
  const investInstead = prepayment * (1 + returnPct / 100) ** (n / 12)

  return {
    ok: true,
    result: {
      currentEmi,
      newEmi,
      newMonths: after.months,
      monthsSaved: n - after.months,
      interestSaved: base.totalInterest - after.totalInterest,
      prepayThenInvest,
      investInstead,
      breakEvenReturnPct: breakEven(freed, prepayment, n),
      balanceByYear: yearEnds(base.balances, n),
      prepaidBalanceByYear: yearEnds(after.balances, n),
    },
  }
}

/** The annual return at which investing the prepayment and prepaying end level, by bisection. */
function breakEven(freed: number[], prepayment: number, n: number): number {
  const gap = (pct: number) => futureValueOfFlows(freed, pct, n) - prepayment * (1 + pct / 100) ** (n / 12)
  let lo = 0
  let hi = 100
  if (gap(lo) <= 0) return 0
  for (let step = 0; step < 100; step++) {
    const mid = (lo + hi) / 2
    if (gap(mid) > 0) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

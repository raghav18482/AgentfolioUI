import { validate, type CalcResult } from '@/lib/academy/calculators'
import { riskSizedUnits } from './simulator'

/**
 * The position-size tool: how many units to buy so that hitting the stop
 * loses a chosen share of capital. The Trading Lab sizes its trades the same way.
 */

export type PositionField = 'capital' | 'riskPct' | 'entry' | 'stop' | 'rewardRatio'
export type PositionInputs = Record<PositionField, string>

export interface PositionPlan {
  units: number
  /** True when cash, not risk, limited the size. */
  cappedByCapital: boolean
  /** What hitting the stop would lose, before costs. */
  amountAtRisk: number
  riskPctOfCapital: number
  positionValue: number
  positionPctOfCapital: number
  /** Price at which the gain is `rewardRatio` × the risk. */
  target: number
}

export function planPosition(inputs: PositionInputs): CalcResult<PositionField, PositionPlan> {
  const v = validate(inputs, {
    capital: { label: 'trading capital', min: 0, max: 1_000_00_00_000 },
    riskPct: { label: 'risk per trade', min: 0, max: 100 },
    entry: { label: 'the entry price', min: 0, max: 10_00_000 },
    stop: { label: 'the stop price', min: 0, max: 10_00_000 },
    rewardRatio: { label: 'the reward-to-risk ratio', min: 0, max: 20 },
  })
  if (!v.ok) return v
  const { capital, riskPct, entry, stop, rewardRatio } = v.values
  if (stop >= entry) return { ok: false, errors: { stop: 'For a long trade the stop must be below the entry price.' } }

  const byRisk = riskSizedUnits(capital, riskPct, entry, stop)
  const byCapital = Math.floor(capital / entry)
  const units = Math.min(byRisk, byCapital)
  if (units < 1) {
    return { ok: false, errors: { capital: 'Too little capital for even one unit at this entry price and risk.' } }
  }
  const amountAtRisk = units * (entry - stop)
  return {
    ok: true,
    result: {
      units,
      cappedByCapital: byCapital < byRisk,
      amountAtRisk,
      riskPctOfCapital: (amountAtRisk / capital) * 100,
      positionValue: units * entry,
      positionPctOfCapital: ((units * entry) / capital) * 100,
      target: entry + rewardRatio * (entry - stop),
    },
  }
}

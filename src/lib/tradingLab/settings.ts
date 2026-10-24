import { validate, type CalcResult } from '@/lib/academy/calculators'
import type { LabConfig } from './simulator'

export type SettingsField = 'seed' | 'fast' | 'slow' | 'costPct' | 'riskPct' | 'stopPct' | 'startCash'
export type SettingsInputs = Record<SettingsField, string>

export interface LabSettings {
  seed: number
  config: LabConfig
}

/** Validates the Lab's settings form. The series is 240 bars, so the slow average stays well inside it. */
export function parseSettings(inputs: SettingsInputs): CalcResult<SettingsField, LabSettings> {
  const v = validate(inputs, {
    seed: { label: 'the market seed', min: 1, max: 999_999_999, minInclusive: true, integer: true },
    fast: { label: 'the fast average', min: 2, max: 50, minInclusive: true, integer: true },
    slow: { label: 'the slow average', min: 3, max: 120, minInclusive: true, integer: true },
    costPct: { label: 'the cost per side', min: 0, max: 2, minInclusive: true },
    riskPct: { label: 'the risk per trade', min: 0, max: 10 },
    stopPct: { label: 'the stop distance', min: 0, max: 50 },
    startCash: { label: 'the starting cash', min: 0, max: 1_000_00_00_000 },
  })
  if (!v.ok) return v
  const { seed, fast, slow, costPct, riskPct, stopPct, startCash } = v.values
  if (fast >= slow) return { ok: false, errors: { slow: 'The slow average must be longer than the fast one.' } }
  return { ok: true, result: { seed, config: { fast, slow, costPct, riskPct, stopPct, startCash } } }
}

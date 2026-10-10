import type { HorizonPrediction, PredictionDirection, PredictionHorizon, PredictionResult } from '@/types'

/** Three horizons only: intraday was never tractable from daily bars, and a year is a valuation question. */
export const HORIZONS: ReadonlyArray<{ key: PredictionHorizon; label: string }> = [
  { key: '1day', label: '1 Day' },
  { key: '1week', label: '1 Week' },
  { key: '1month', label: '1 Month' },
]

/**
 * Names the engine honestly. With no trained model registered the server falls
 * back to hand-weighted technical rules, and that must never read as a model's output.
 */
export function engineLabel(result: Pick<PredictionResult, 'model_type' | 'model_version'>): string {
  if (result.model_type === 'heuristic') return 'Rule-based score (no model)'
  const version = result.model_version ? ` ${String(result.model_version).slice(0, 8)}` : ''
  return `Model${version}`
}

/** Whether the confidence shown needs the "not a calibrated probability" notice. */
export function needsCalibrationNotice(result: Pick<PredictionResult, 'model_type' | 'calibrated'>): boolean {
  return result.model_type === 'heuristic' || result.calibrated === false
}

/**
 * Where a horizon sits on a 0–100 "chance of going up" axis: confidence for an up
 * call, its complement for a down call, and the midpoint for neutral.
 */
export function upwardPercent(p: Pick<HorizonPrediction, 'direction' | 'confidence'>): number {
  const value = p.direction === 'up' ? p.confidence * 100 : p.direction === 'down' ? (1 - p.confidence) * 100 : 50
  return Math.round(value * 10) / 10
}

/** The bar colour band: above 55 leans bullish, below 45 bearish, else neutral. */
export function leaning(percent: number): 'bullish' | 'bearish' | 'neutral' {
  return percent > 55 ? 'bullish' : percent < 45 ? 'bearish' : 'neutral'
}

export function directionOf(outlookOrDirection: PredictionDirection | PredictionResult['overall_outlook']) {
  if (outlookOrDirection === 'up' || outlookOrDirection === 'bullish') return 'bullish'
  if (outlookOrDirection === 'down' || outlookOrDirection === 'bearish') return 'bearish'
  return 'neutral'
}

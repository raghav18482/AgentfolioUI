import { describe, expect, it } from 'vitest'
import { directionOf, engineLabel, leaning, needsCalibrationNotice, upwardPercent } from './prediction'

describe('engineLabel', () => {
  it('never presents the rule-based fallback as a model', () => {
    expect(engineLabel({ model_type: 'heuristic', model_version: null })).toBe('Rule-based score (no model)')
    // Even if a version somehow accompanies it.
    expect(engineLabel({ model_type: 'heuristic', model_version: 'abcdef123456' })).toBe('Rule-based score (no model)')
  })

  it('shows a registered model with a short version', () => {
    expect(engineLabel({ model_type: 'xgboost', model_version: '0123456789abcdef' })).toBe('Model 01234567')
    expect(engineLabel({ model_type: 'xgboost', model_version: null })).toBe('Model')
  })
})

describe('needsCalibrationNotice', () => {
  it('flags the heuristic and any uncalibrated model', () => {
    expect(needsCalibrationNotice({ model_type: 'heuristic' })).toBe(true)
    expect(needsCalibrationNotice({ model_type: 'xgboost', calibrated: false })).toBe(true)
    expect(needsCalibrationNotice({ model_type: 'xgboost', calibrated: true })).toBe(false)
    expect(needsCalibrationNotice({ model_type: 'xgboost' })).toBe(false)
  })
})

describe('upwardPercent', () => {
  it('maps direction and confidence onto a chance-of-rising axis', () => {
    expect(upwardPercent({ direction: 'up', confidence: 0.7 })).toBe(70)
    expect(upwardPercent({ direction: 'down', confidence: 0.7 })).toBe(30)
    expect(upwardPercent({ direction: 'neutral', confidence: 0.9 })).toBe(50)
  })
})

describe('leaning', () => {
  it('uses the 45/55 band', () => {
    expect(leaning(55.1)).toBe('bullish')
    expect(leaning(55)).toBe('neutral')
    expect(leaning(45)).toBe('neutral')
    expect(leaning(44.9)).toBe('bearish')
  })
})

describe('directionOf', () => {
  it('normalises directions and outlooks', () => {
    expect(directionOf('up')).toBe('bullish')
    expect(directionOf('bearish')).toBe('bearish')
    expect(directionOf('neutral')).toBe('neutral')
  })
})

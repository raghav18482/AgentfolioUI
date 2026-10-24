import { describe, expect, it } from 'vitest'
import { FALL_AND_RECOVERY_PATH, gainToRecover, investInstalments, piecewisePath, sipAmounts } from './investing'

describe('gainToRecover', () => {
  it('needs a larger gain than the loss to get back', () => {
    expect(gainToRecover(0)).toBe(0)
    expect(gainToRecover(20)).toBeCloseTo(25, 10)
    expect(gainToRecover(50)).toBeCloseTo(100, 10)
    expect(gainToRecover(60)).toBeCloseTo(150, 10)
  })

  it('rejects impossible losses', () => {
    expect(() => gainToRecover(100)).toThrow()
    expect(() => gainToRecover(-5)).toThrow()
  })
})

describe('investInstalments', () => {
  it('values a lump sum at the final price', () => {
    const r = investInstalments([100, 112], [6_00_000])
    expect(r.invested).toBe(6_00_000)
    expect(r.value).toBeCloseTo(6_72_000, 6)
  })

  it('reproduces the SIP vs lump sum lesson on both made-up paths', () => {
    const rising = [100, 102, 104, 106, 108, 110, 112]
    const dip = [100, 90, 82, 85, 92, 97, 100]
    const stp = Array.from({ length: 6 }, () => 1_00_000)
    expect(Math.round(investInstalments(rising, [6_00_000]).value)).toBe(6_72_000)
    expect(Math.round(investInstalments(rising, stp).value)).toBe(6_40_678)
    expect(Math.round(investInstalments(dip, [6_00_000]).value)).toBe(6_00_000)
    expect(Math.round(investInstalments(dip, stp).value)).toBe(6_62_498)
  })

  it('reproduces the paused-SIP example in the behaviour lesson', () => {
    const steady = investInstalments(FALL_AND_RECOVERY_PATH, sipAmounts())
    const paused = investInstalments(FALL_AND_RECOVERY_PATH, sipAmounts(6, 17))
    expect(steady.invested).toBe(7_20_000)
    expect(Math.round(steady.value)).toBe(9_15_049)
    expect(paused.invested).toBe(4_80_000)
    expect(Math.round(paused.value)).toBe(5_57_739)
  })

  it('rejects missing or non-positive prices', () => {
    expect(() => investInstalments([100], [1, 2])).toThrow()
    expect(() => investInstalments([100, 0], [1])).toThrow()
  })
})

describe('piecewisePath', () => {
  it('has one price per month, hitting every waypoint', () => {
    expect(FALL_AND_RECOVERY_PATH).toHaveLength(37)
    expect(FALL_AND_RECOVERY_PATH[0]).toBe(100)
    expect(FALL_AND_RECOVERY_PATH[12]).toBe(70)
    expect(FALL_AND_RECOVERY_PATH[24]).toBe(100)
    expect(FALL_AND_RECOVERY_PATH[36]).toBe(115)
    expect(piecewisePath([[0, 10], [2, 20]])).toEqual([10, 15, 20])
  })
})

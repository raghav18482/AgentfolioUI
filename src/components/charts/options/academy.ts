import type { EChartsOption } from 'echarts'
import { formatCompactInr, formatRupees } from '@/utils/format'
import { COLORS } from '../theme'
import { paramList, seriesDot, tooltipTitle } from './tooltip'

export interface RupeeSeries {
  name: string
  values: number[]
  color: string
  /** Shaded under the line, for the series the lesson is about. */
  area?: boolean
}

type Period = 'year' | 'month'

/** Rupee value per period for one or more series; index 0 is "today". */
export function rupeesOverTimeOption(series: RupeeSeries[], period: Period = 'year'): EChartsOption {
  const years = series[0].values.map((_, y) => `${y}`)
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const list = paramList(params)
        const rows = list
          .map((p) => `<div>${seriesDot(p.color)}${p.seriesName}: <b>${formatRupees(Number(p.value))}</b></div>`)
          .join('')
        return tooltipTitle(`After ${list[0].dataIndex} ${period}s`) + rows
      },
    },
    legend: { data: series.map((s) => s.name), top: 4, itemWidth: 20, itemHeight: 3 },
    grid: { left: 64, right: 16, top: 40, bottom: 36 },
    xAxis: {
      type: 'category',
      data: years,
      name: period === 'year' ? 'Years' : 'Months',
      nameLocation: 'middle',
      nameGap: 24,
      axisLabel: { interval: Math.max(0, Math.ceil(years.length / 10) - 1) },
    },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => formatCompactInr(v) } },
    series: series.map((s) => ({
      name: s.name,
      type: 'line' as const,
      data: s.values.map((v) => Math.round(v)),
      symbol: 'none',
      lineStyle: { color: s.color, width: 2.5 },
      itemStyle: { color: s.color },
      ...(s.area ? { areaStyle: { color: s.color, opacity: 0.12 } } : {}),
    })),
  }
}

export function loanPrepaymentOption(withoutPrepayment: number[], withPrepayment: number[]): EChartsOption {
  return rupeesOverTimeOption([
    { name: 'Outstanding, no prepayment', values: withoutPrepayment, color: COLORS.muted },
    { name: 'Outstanding, ₹5 lakh prepaid in year 3', values: withPrepayment, color: COLORS.greenSoft, area: true },
  ])
}

export function goalFutureCostOption(atLower: number[], atHigher: number[], lowerPct: number, higherPct: number): EChartsOption {
  return rupeesOverTimeOption([
    { name: `Cost at ${higherPct}% inflation`, values: atHigher, color: COLORS.orange, area: true },
    { name: `Cost at ${lowerPct}% inflation`, values: atLower, color: COLORS.accentSoft },
  ])
}

export function sipPauseOption(steady: number[], paused: number[]): EChartsOption {
  return rupeesOverTimeOption(
    [
      { name: 'Kept the SIP going', values: steady, color: COLORS.greenSoft, area: true },
      { name: 'Paused for 12 months', values: paused, color: COLORS.orange },
    ],
    'month',
  )
}

/** The gain needed to recover from each size of fall, as bars. */
export function drawdownRecoveryOption(lossesPct: number[], gainsPct: number[]): EChartsOption {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const list = paramList(params)
        const i = list[0].dataIndex
        return tooltipTitle(`A ${lossesPct[i]}% fall`) + `<div>Gain needed to recover: <b>${gainsPct[i].toFixed(1)}%</b></div>`
      },
    },
    grid: { left: 52, right: 16, top: 24, bottom: 40 },
    xAxis: {
      type: 'category',
      data: lossesPct.map((l) => `−${l}%`),
      name: 'Fall from peak',
      nameLocation: 'middle',
      nameGap: 28,
    },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => `${v}%` } },
    series: [
      {
        name: 'Gain needed',
        type: 'bar',
        data: gainsPct.map((g) => Math.round(g * 10) / 10),
        barMaxWidth: 36,
        itemStyle: { color: COLORS.redSoft, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', color: COLORS.muted, fontSize: 11, formatter: '+{c}%' },
      },
    ],
  }
}

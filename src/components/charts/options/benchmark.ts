import type { EChartsOption } from 'echarts'
import type { BenchmarkComparison } from '@/types'
import { COLORS } from '../theme'
import { paramList, seriesDot, tooltipTitle } from './tooltip'

function areaFade(rgb: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: `rgba(${rgb},0.18)` },
      { offset: 1, color: `rgba(${rgb},0)` },
    ],
  }
}

/** Cumulative return of the portfolio against NIFTY 50 over the same days. */
export function benchmarkOption(data: BenchmarkComparison): EChartsOption {
  const labels = data.dates.map((d) => {
    const [, month, day] = d.split('-')
    return `${day}/${month}`
  })

  const line = (name: string, values: number[], color: string, rgb: string) => ({
    name,
    type: 'line' as const,
    data: values,
    smooth: 0.3,
    symbol: 'none',
    lineStyle: { color, width: 2.5 },
    itemStyle: { color },
    areaStyle: { color: areaFade(rgb) },
  })

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const list = paramList(params)
        const rows = list
          .map((p) => {
            const v = Number(p.value)
            return `<div>${seriesDot(p.color)}${p.seriesName}: <b>${v >= 0 ? '+' : ''}${v.toFixed(2)}%</b></div>`
          })
          .join('')
        return tooltipTitle(labels[list[0].dataIndex]) + rows
      },
    },
    legend: { data: ['NIFTY 50', 'My Portfolio'], top: 6, itemWidth: 20, itemHeight: 3 },
    grid: { left: 55, right: 20, top: 45, bottom: 50 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { rotate: 45, fontSize: 10, interval: Math.max(0, Math.floor(labels.length / 12) - 1) },
    },
    yAxis: {
      type: 'value',
      name: 'Cumulative Return (%)',
      nameTextStyle: { fontSize: 11 },
      axisLabel: { formatter: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` },
    },
    series: [
      line('NIFTY 50', data.nifty_cumulative, COLORS.yellow, '245,158,11'),
      line('My Portfolio', data.portfolio_cumulative, COLORS.green, '16,185,129'),
    ],
  }
}

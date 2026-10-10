import type { EChartsOption } from 'echarts'
import type { TrendPoint } from '@/types'
import { formatCompactInr } from '@/utils/format'
import { COLORS } from '../theme'
import { paramList, seriesDot, tooltipTitle } from './tooltip'

/** `1.2T`, `3.4B`, `5Cr` — axis ticks in the units annual financials arrive in. */
function axisAmount(v: number): string {
  const abs = Math.abs(v)
  if (abs >= 1e12) return `${(v / 1e12).toFixed(1)}T`
  if (abs >= 1e9) return `${(v / 1e9).toFixed(1)}B`
  if (abs >= 1e7) return `${(v / 1e7).toFixed(0)}Cr`
  return String(v)
}

/** Annual revenue as bars with net profit as a line over the same years. */
export function financialsTrendOption(revenue: TrendPoint[], profit: TrendPoint[]): EChartsOption {
  // Years come from whichever series has them: profit can exist without revenue.
  const years = (revenue.length ? revenue : profit).map((p) => p.year)
  const align = (points: TrendPoint[]) => years.map((y) => points.find((p) => p.year === y)?.value ?? null)

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const list = paramList(params)
        const rows = list
          .map((p) => `<div>${seriesDot(p.color)}${p.seriesName}: <b>${p.value == null ? '—' : formatCompactInr(Number(p.value))}</b></div>`)
          .join('')
        return tooltipTitle(list[0].name) + rows
      },
    },
    legend: { data: ['Revenue', 'Net Profit'], bottom: 0 },
    grid: { top: 30, right: 30, bottom: 50, left: 30, containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', axisLabel: { formatter: axisAmount } },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        barWidth: '35%',
        data: align(revenue),
        itemStyle: { color: COLORS.accent, borderRadius: [4, 4, 0, 0] },
      },
      {
        name: 'Net Profit',
        type: 'line',
        smooth: true,
        data: align(profit),
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: COLORS.green, width: 2 },
        itemStyle: { color: COLORS.green },
      },
    ],
  }
}

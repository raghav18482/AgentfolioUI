import type { EChartsOption } from 'echarts'
import { HORIZONS, leaning, upwardPercent } from '@/lib/prediction'
import type { PredictionResult } from '@/types'
import { COLORS } from '../theme'
import { paramList, tooltipTitle } from './tooltip'

const LEAN_COLOR = { bullish: COLORS.green, bearish: COLORS.red, neutral: COLORS.yellow } as const
const LEAN_ARROW = { bullish: '▲', bearish: '▼', neutral: '—' } as const
const LEAN_WORD = { bullish: 'Bullish', bearish: 'Bearish', neutral: 'Neutral' } as const

/** One bar per horizon on a 0–100 "chance of rising" axis, coloured by which way it leans. */
export function predictionBarsOption(predictions: PredictionResult['predictions']): EChartsOption {
  const rows = HORIZONS.flatMap(({ key, label }) => {
    const p = predictions[key]
    if (!p) return []
    const value = upwardPercent(p)
    return [{ label, value, lean: leaning(value) }]
  })

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const p = paramList(params)[0]
        const row = rows[p.dataIndex]
        return (
          tooltipTitle(row.label) +
          `<span style="color:${LEAN_COLOR[row.lean]}">${LEAN_WORD[row.lean]}</span>: ${row.value}% confidence`
        )
      },
    },
    grid: { left: 12, right: 12, top: 16, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      data: rows.map((r) => r.label),
      axisLabel: { color: COLORS.muted, fontSize: 11, fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 25,
      axisLabel: { fontSize: 10, formatter: '{value}%' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: COLORS.border, type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        barWidth: '50%',
        data: rows.map((r) => ({
          value: r.value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              // The hex plus `44` is the same colour at about a quarter opacity.
              colorStops: [
                { offset: 0, color: LEAN_COLOR[r.lean] },
                { offset: 1, color: `${LEAN_COLOR[r.lean]}44` },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
        })),
        label: {
          show: true,
          position: 'top',
          color: COLORS.text,
          fontSize: 12,
          fontWeight: 700,
          formatter: (p) => {
            const row = rows[p.dataIndex]
            return `${LEAN_ARROW[row.lean]} ${row.value}%`
          },
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: COLORS.muted, type: 'dashed', width: 1 },
          label: { show: false },
          data: [{ yAxis: 50 }],
        },
      },
    ],
  }
}

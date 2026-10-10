import type { EChartsOption } from 'echarts'
import type { RebalanceRow } from '@/lib/rebalance'
import { formatCurrency } from '@/utils/format'
import { COLORS, SECTOR_PALETTE } from '../theme'
import { paramList, tooltipRow, tooltipTitle } from './tooltip'

/** `1.2L` / `85K` — compact rupee ticks for the value axis. */
function axisAmount(v: number): string {
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
  return String(v)
}

/** Holding values after the simulated sells and reinvestments; sold-down bars fade. */
export function rebalancerOption(rows: RebalanceRow[], after: Record<string, number>): EChartsOption {
  return {
    // Redrawn on every slider tick: animation would make the bars trail the thumb.
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const row = rows[paramList(params)[0].dataIndex]
        const now = after[row.symbol]
        const diff = now - row.original
        return (
          tooltipTitle(row.label) +
          tooltipRow('Original', formatCurrency(row.original)) +
          tooltipRow('After', formatCurrency(now)) +
          tooltipRow('Change', `${diff >= 0 ? '+' : ''}${formatCurrency(diff)}`, diff >= 0 ? COLORS.green : COLORS.red)
        )
      },
    },
    grid: { left: 100, right: 30, top: 10, bottom: 10 },
    xAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: axisAmount }, axisLine: { show: false } },
    yAxis: {
      type: 'category',
      inverse: true,
      data: rows.map((r) => r.label),
      axisLabel: { color: COLORS.text, fontSize: 12, fontWeight: 500 },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 24,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        data: rows.map((r, i) => ({
          value: Math.round(after[r.symbol]),
          itemStyle: {
            color: SECTOR_PALETTE[i % SECTOR_PALETTE.length],
            opacity: after[r.symbol] < r.original ? 0.5 : 1,
          },
        })),
      },
    ],
  }
}

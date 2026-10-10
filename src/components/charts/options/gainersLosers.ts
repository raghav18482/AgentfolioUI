import type { EChartsOption } from 'echarts'
import type { Holding } from '@/types'
import { displaySymbol, formatRupees, signedPct } from '@/utils/format'
import { COLORS, pnlColor } from '../theme'
import { paramList, tooltipRow, tooltipTitle } from './tooltip'

/** The five best and five worst holdings by absolute P&L, without double-counting. */
export function topAndBottom(holdings: Holding[], n = 5): Holding[] {
  const sorted = holdings.filter((h) => h.invested > 0).sort((a, b) => b.pnl - a.pnl)
  const picked = new Map<string, Holding>()
  for (const h of [...sorted.slice(0, n), ...sorted.slice(-n)]) picked.set(h.symbol, h)
  // Ascending, because a category y-axis draws its first entry at the bottom.
  return [...picked.values()].sort((a, b) => a.pnl - b.pnl)
}

function compactAxis(v: number): string {
  if (Math.abs(v) >= 100_000) return `${(v / 100_000).toFixed(1)}L`
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return String(v)
}

/** Horizontal bars of P&L in rupees, labelled with P&L percent. */
export function gainersLosersOption(holdings: Holding[]): EChartsOption {
  const rows = topAndBottom(holdings)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const h = rows[paramList(params)[0].dataIndex]
        const color = pnlColor(h.pnl)
        const sign = h.pnl >= 0 ? '+' : ''
        return (
          tooltipTitle(displaySymbol(h.symbol)) +
          tooltipRow('P&L', `${sign}${formatRupees(h.pnl)}`, color) +
          tooltipRow('P&L %', signedPct(h.pnl_pct), color) +
          tooltipRow('Invested', formatRupees(h.invested))
        )
      },
    },
    grid: { left: 100, right: 48, top: 15, bottom: 15 },
    xAxis: {
      type: 'value',
      axisLabel: { formatter: compactAxis },
    },
    yAxis: {
      type: 'category',
      data: rows.map((h) => displaySymbol(h.symbol)),
      axisLine: { show: false },
      axisLabel: { color: COLORS.text, fontSize: 12, fontWeight: 500 },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 28,
        data: rows.map((h) => {
          const up = h.pnl >= 0
          return {
            value: h.pnl,
            itemStyle: {
              borderRadius: up ? [0, 4, 4, 0] : [4, 0, 0, 4],
              color: {
                type: 'linear',
                x: up ? 0 : 1,
                y: 0,
                x2: up ? 1 : 0,
                y2: 0,
                colorStops: [
                  { offset: 0, color: up ? 'rgba(16,185,129,.15)' : 'rgba(244,63,94,.15)' },
                  { offset: 1, color: up ? COLORS.green : COLORS.red },
                ],
              },
            },
            label: {
              show: true,
              position: up ? 'right' : 'left',
              formatter: signedPct(h.pnl_pct, 1),
              color: pnlColor(h.pnl),
              fontSize: 11,
              fontWeight: 600,
            },
          }
        }),
      },
    ],
  }
}

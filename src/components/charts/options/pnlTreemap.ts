import type { EChartsOption } from 'echarts'
import type { Holding } from '@/types'
import { displaySymbol, formatRupees, signedPct } from '@/utils/format'
import { COLORS, pnlColor, pnlGradient } from '../theme'
import { paramList, tooltipRow, tooltipTitle } from './tooltip'

interface Tile {
  name: string
  value: number
  invested: number
  pnl: number
  pnl_pct: number
}

/** Holdings as tiles: area is current value, colour is P&L relative to the biggest mover. */
export function pnlTreemapOption(holdings: Holding[]): EChartsOption {
  const live = holdings.filter((h) => h.current > 0)
  const maxAbsPct = Math.max(...live.map((h) => Math.abs(h.pnl_pct)), 1)

  const data = live.map((h) => ({
    name: displaySymbol(h.symbol),
    value: h.current,
    invested: h.invested,
    pnl: h.pnl,
    pnl_pct: h.pnl_pct,
    itemStyle: {
      color: pnlGradient(h.pnl, Math.abs(h.pnl_pct) / maxAbsPct),
      borderColor: COLORS.surface,
      borderWidth: 2,
    },
  }))

  return {
    tooltip: {
      formatter: (params) => {
        const tile = paramList(params)[0].data as Tile
        const color = pnlColor(tile.pnl)
        const sign = tile.pnl >= 0 ? '+' : ''
        return (
          tooltipTitle(tile.name) +
          tooltipRow('Current', formatRupees(tile.value)) +
          tooltipRow('Invested', formatRupees(tile.invested)) +
          tooltipRow('P&L', `${sign}${formatRupees(tile.pnl)} (${signedPct(tile.pnl_pct)})`, color)
        )
      },
    },
    series: [
      {
        type: 'treemap',
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        itemStyle: { borderRadius: 4, gapWidth: 3 },
        label: {
          show: true,
          // Canvas rich text, not HTML: nothing to escape.
          formatter: (p) => {
            const tile = p.data as Tile
            return `{name|${tile.name}}\n{pct|${signedPct(tile.pnl_pct, 1)}}`
          },
          rich: {
            name: { fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 20 },
            pct: { fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,.85)', lineHeight: 16 },
          },
        },
        data,
      },
    ],
  }
}

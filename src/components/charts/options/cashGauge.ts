import type { EChartsOption } from 'echarts'
import { formatRupees } from '@/utils/format'
import { COLORS } from '../theme'
import { paramList, tooltipTitle } from './tooltip'

/** A three-quarter ring of invested capital against idle cash. */
export function cashGaugeOption(invested: number, cash: number): EChartsOption {
  const total = invested + cash
  const investedPct = total ? (invested / total) * 100 : 0
  const cashPct = total ? (cash / total) * 100 : 0

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const p = paramList(params)[0]
        const value = Number(p.value)
        return `${tooltipTitle(p.name)}${formatRupees(value)} &nbsp;(${((value / total) * 100).toFixed(1)}%)`
      },
    },
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: '35%',
        children: [
          {
            type: 'text',
            left: 'center',
            style: { text: formatRupees(total), fill: COLORS.text, fontSize: 20, fontWeight: 700, align: 'center' },
          },
          {
            type: 'text',
            left: 'center',
            top: 26,
            style: { text: 'Total Capital', fill: COLORS.muted, fontSize: 11, align: 'center' },
          },
        ],
      },
      {
        type: 'text',
        left: 'center',
        bottom: '5%',
        style: {
          text: `Invested: ${investedPct.toFixed(1)}%   |   Cash: ${cashPct.toFixed(1)}%`,
          fill: COLORS.muted,
          fontSize: 12,
          align: 'center',
        },
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['62%', '80%'],
        startAngle: 210,
        endAngle: -30,
        padAngle: 3,
        itemStyle: { borderRadius: 8, borderColor: COLORS.surface, borderWidth: 3 },
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(99,102,241,.3)' } },
        data: [
          { value: Math.round(invested), name: 'Invested', itemStyle: { color: COLORS.accent } },
          { value: Math.round(cash), name: 'Cash', itemStyle: { color: COLORS.green } },
        ],
      },
    ],
  }
}

import type { EChartsOption } from 'echarts'
import type { Holding, SectorMap } from '@/types'
import { formatRupees } from '@/utils/format'
import { COLORS, SECTOR_PALETTE } from '../theme'
import { paramList, tooltipTitle } from './tooltip'

export interface SectorSlice {
  name: string
  value: number
}

/**
 * Current value per sector, largest first. Every holding counts — unmapped
 * symbols land in "Other" and ETFs in their own slice — so the slices always
 * sum to the whole portfolio.
 */
export function sectorSlices(holdings: Holding[], sectorMap: SectorMap): SectorSlice[] {
  const totals = new Map<string, number>()
  for (const h of holdings) {
    const sector = sectorMap[h.symbol] ?? 'Other'
    totals.set(sector, (totals.get(sector) ?? 0) + h.current)
  }
  return [...totals]
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
}

export function sectorAllocationOption(slices: SectorSlice[]): EChartsOption {
  const total = slices.reduce((sum, s) => sum + s.value, 0)

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const p = paramList(params)[0]
        return `${tooltipTitle(p.name)}${formatRupees(Number(p.value))} &nbsp;(${(p.percent ?? 0).toFixed(1)}%)`
      },
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 10,
      pageTextStyle: { color: COLORS.muted },
    },
    graphic: [
      {
        type: 'group',
        left: '35%',
        top: 'center',
        children: [
          {
            type: 'text',
            left: 'center',
            top: -10,
            style: { text: formatRupees(total), fill: COLORS.text, fontSize: 18, fontWeight: 700, align: 'center' },
          },
          {
            type: 'text',
            left: 'center',
            top: 14,
            style: { text: 'Total Value', fill: COLORS.muted, fontSize: 11, align: 'center' },
          },
        ],
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['48%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: { borderRadius: 6, borderColor: COLORS.surface, borderWidth: 2 },
        label: { show: false },
        emphasis: {
          scale: true,
          label: { show: false },
          itemStyle: { shadowBlur: 20, shadowColor: 'rgba(99,102,241,.4)' },
        },
        color: [...SECTOR_PALETTE],
        data: slices,
      },
    ],
  }
}

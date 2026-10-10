import { useMemo } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import { pnlTreemapOption } from '@/components/charts/options/pnlTreemap'
import type { Holding } from '@/types'

const HEIGHT = 400

export function PnlHeatmap({ holdings }: { holdings: Holding[] }) {
  const option = useMemo(() => pnlTreemapOption(holdings), [holdings])
  const empty = holdings.some((h) => h.current > 0) ? null : 'No holdings data available'

  return (
    <ChartCard
      title="P&L Heatmap"
      tag="Size = Current Value · Color = Profit / Loss"
      height={HEIGHT}
      empty={empty}
    >
      <EChart
        option={option}
        height={HEIGHT}
        ariaLabel="Treemap of holdings, sized by current value and coloured by profit or loss"
      />
    </ChartCard>
  )
}

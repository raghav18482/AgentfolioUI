import { useMemo } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import { gainersLosersOption } from '@/components/charts/options/gainersLosers'
import type { Holding } from '@/types'

const HEIGHT = 400

export function TopMovers({ holdings }: { holdings: Holding[] }) {
  const option = useMemo(() => gainersLosersOption(holdings), [holdings])
  const empty = holdings.some((h) => h.invested > 0) ? null : 'No holdings data available'

  return (
    <ChartCard
      title="Top Gainers & Losers"
      tag="Absolute P&L with percentage labels"
      height={HEIGHT}
      empty={empty}
    >
      <EChart
        option={option}
        height={HEIGHT}
        ariaLabel="Bar chart of the five best and five worst holdings by profit or loss"
      />
    </ChartCard>
  )
}

import { useMemo } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import { sectorAllocationOption, sectorSlices } from '@/components/charts/options/sectorAllocation'
import { useSectorMap } from '@/hooks/usePortfolio'
import type { Holding } from '@/types'

const HEIGHT = 340

export function SectorAllocation({ holdings }: { holdings: Holding[] }) {
  const sectorMap = useSectorMap()
  const slices = useMemo(
    () => (sectorMap.data ? sectorSlices(holdings, sectorMap.data) : []),
    [holdings, sectorMap.data],
  )
  const option = useMemo(() => sectorAllocationOption(slices), [slices])

  return (
    <ChartCard
      title="Sector Allocation"
      tag="By current value"
      height={HEIGHT}
      loading={sectorMap.isPending}
      error={sectorMap.isError ? `Could not load sectors: ${sectorMap.error.message}` : null}
      empty={slices.length ? null : 'No holdings data available'}
    >
      <EChart option={option} height={HEIGHT} ariaLabel="Donut chart of portfolio value by sector" />
    </ChartCard>
  )
}

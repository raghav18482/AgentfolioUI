import { useMemo } from 'react'
import { EChart } from '@/components/charts/EChart'
import { tradingLabOption } from '@/components/charts/options/tradingLab'

type LabChartProps = Parameters<typeof tradingLabOption>[0]

/** The Lab's price chart. Loaded lazily, so ECharts downloads only on this page. */
export function LabChart(props: LabChartProps) {
  const { bars, cursor, fast, slow, fastPeriod, slowPeriod, trades, position } = props
  const option = useMemo(
    () => tradingLabOption({ bars, cursor, fast, slow, fastPeriod, slowPeriod, trades, position }),
    [bars, cursor, fast, slow, fastPeriod, slowPeriod, trades, position],
  )
  return (
    <EChart
      option={option}
      height={340}
      ariaLabel="Candlestick chart of synthetic prices up to the current day, with two moving averages, buy and sell markers and the stop level."
    />
  )
}

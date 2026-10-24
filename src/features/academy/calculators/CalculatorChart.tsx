import { useMemo } from 'react'
import { EChart } from '@/components/charts/EChart'
import { rupeesOverTimeOption, type RupeeSeries } from '@/components/charts/options/academy'

interface CalculatorChartProps {
  series: RupeeSeries[]
  ariaLabel: string
}

/** A calculator's projection by year. Loaded lazily, so ECharts downloads only when a chart is shown. */
export function CalculatorChart({ series, ariaLabel }: CalculatorChartProps) {
  const option = useMemo(() => rupeesOverTimeOption(series), [series])
  return <EChart option={option} height={280} ariaLabel={ariaLabel} />
}

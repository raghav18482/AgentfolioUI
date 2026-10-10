import { useMemo } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import { cashGaugeOption } from '@/components/charts/options/cashGauge'
import { parseAmount } from '@/utils/format'
import type { PortfolioFunds, PortfolioSummary } from '@/types'

const HEIGHT = 340

interface CashGaugeProps {
  summary: PortfolioSummary
  funds: PortfolioFunds
}

export function CashGauge({ summary, funds }: CashGaugeProps) {
  const cash = parseAmount(funds.available_cash) ?? 0
  const invested = summary.total_invested ?? 0
  const option = useMemo(() => cashGaugeOption(invested, cash), [invested, cash])

  return (
    <ChartCard
      title="Cash vs Invested"
      tag="Capital deployment"
      height={HEIGHT}
      empty={cash + invested > 0 ? null : 'No funds data available'}
    >
      <EChart option={option} height={HEIGHT} ariaLabel="Ring chart of invested capital against available cash" />
    </ChartCard>
  )
}

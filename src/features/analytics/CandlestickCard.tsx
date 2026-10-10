import { useMemo } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import { candlestickOption, toCandleSeries } from '@/components/charts/options/candlestick'
import { useCandles } from '@/hooks/usePortfolio'
import type { Holding } from '@/types'
import { displaySymbol } from '@/utils/format'

const HEIGHT = 480
const DAYS = 90

export function CandlestickCard({ holding }: { holding: Holding }) {
  const candles = useCandles(holding.symbol, DAYS)

  const option = useMemo(
    () => (candles.data?.length ? candlestickOption(toCandleSeries(candles.data), { avgBuyPrice: holding.avg_price }) : null),
    [candles.data, holding.avg_price],
  )

  return (
    <ChartCard
      title={`${displaySymbol(holding.symbol)} — Price Chart`}
      tag="90-day OHLC • Yellow line = your avg buy price"
      height={HEIGHT}
      loading={candles.isPending}
      error={candles.isError ? candles.error.message : null}
      empty={candles.isSuccess && !option ? 'No chart data available' : null}
    >
      {option && (
        <EChart
          option={option}
          height={HEIGHT}
          ariaLabel={`Candlestick chart of ${displaySymbol(holding.symbol)} over 90 days, with your average buy price marked`}
        />
      )}
    </ChartCard>
  )
}

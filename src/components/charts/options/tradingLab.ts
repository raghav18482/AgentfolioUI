import type { EChartsOption } from 'echarts'
import type { Bar } from '@/lib/tradingLab/data'
import type { Position, Trade } from '@/lib/tradingLab/simulator'
import { COLORS } from '../theme'
import { paramList, tooltipRow, tooltipTitle } from './tooltip'

interface LabChartInput {
  /** The whole series; only bars up to `cursor` are drawn, so the axis never reveals future prices. */
  bars: readonly Bar[]
  cursor: number
  fast: Array<number | null>
  slow: Array<number | null>
  fastPeriod: number
  slowPeriod: number
  trades: readonly Trade[]
  position: Position | null
}

const price = (n: number) => `₹${n.toFixed(2)}`

/** Synthetic candles with both moving averages, trade markers and the open position's stop. */
export function tradingLabOption({ bars, cursor, fast, slow, fastPeriod, slowPeriod, trades, position }: LabChartInput): EChartsOption {
  const days = bars.map((b) => `Day ${b.day}`)
  // Only visible days get data; the category axis still spans every day, so the scale stays put.
  const candles = bars.slice(0, cursor + 1).map((b) => [b.open, b.close, b.low, b.high])
  const line = (values: Array<number | null>) => bars.map((_, i) => (i <= cursor && values[i] != null ? values[i] : '-'))

  const entries = [...trades.map((t) => ({ index: t.entryIndex, price: t.entryPrice })), ...(position ? [{ index: position.entryIndex, price: position.entryPrice }] : [])]
  const marks = [
    ...entries.map((e) => ({
      name: 'Buy',
      coord: [e.index, bars[e.index].low],
      value: 'B',
      symbol: 'triangle',
      symbolSize: 11,
      symbolOffset: [0, 10],
      itemStyle: { color: COLORS.greenSoft },
      label: { show: false },
    })),
    ...trades.map((t) => ({
      name: t.exit === 'stop' ? 'Stop' : 'Sell',
      coord: [t.exitIndex, bars[t.exitIndex].high],
      value: t.exit === 'stop' ? 'S' : 'X',
      symbol: 'triangle',
      symbolRotate: 180,
      symbolSize: 11,
      symbolOffset: [0, -10],
      itemStyle: { color: t.exit === 'stop' ? COLORS.yellowSoft : COLORS.redSoft },
      label: { show: false },
    })),
  ]

  return {
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', crossStyle: { color: COLORS.muted } },
      formatter: (params) => {
        const i = paramList(params)[0]?.dataIndex ?? 0
        if (i > cursor) return ''
        const b = bars[i]
        return (
          tooltipTitle(`Day ${b.day} (synthetic)`) +
          tooltipRow('Open', price(b.open)) +
          tooltipRow('High', price(b.high)) +
          tooltipRow('Low', price(b.low)) +
          tooltipRow('Close', price(b.close)) +
          (fast[i] != null ? tooltipRow(`${fastPeriod}-day avg`, price(fast[i] as number), COLORS.cyan) : '') +
          (slow[i] != null ? tooltipRow(`${slowPeriod}-day avg`, price(slow[i] as number), COLORS.orange) : '')
        )
      },
    },
    legend: { data: [`${fastPeriod}-day average`, `${slowPeriod}-day average`], top: 0, itemWidth: 18, itemHeight: 3 },
    grid: { left: 52, right: 16, top: 32, bottom: 32 },
    xAxis: { type: 'category', data: days, axisLabel: { fontSize: 10, interval: 29 }, boundaryGap: true },
    yAxis: { scale: true, axisLabel: { formatter: (v: number) => `₹${Math.round(v)}` } },
    series: [
      {
        name: 'Price',
        type: 'candlestick',
        data: candles,
        itemStyle: { color: COLORS.green, color0: COLORS.red, borderColor: COLORS.green, borderColor0: COLORS.red },
        markPoint: { data: marks, animation: false },
        markLine: position
          ? {
              symbol: 'none',
              silent: true,
              lineStyle: { color: COLORS.yellowSoft, type: 'dashed' },
              label: { formatter: `Stop ${price(position.stop)}`, color: COLORS.yellowSoft, fontSize: 10 },
              data: [{ yAxis: position.stop }],
            }
          : undefined,
      },
      {
        name: `${fastPeriod}-day average`,
        type: 'line',
        data: line(fast),
        symbol: 'none',
        lineStyle: { color: COLORS.cyan, width: 1.6 },
        itemStyle: { color: COLORS.cyan },
      },
      {
        name: `${slowPeriod}-day average`,
        type: 'line',
        data: line(slow),
        symbol: 'none',
        lineStyle: { color: COLORS.orange, width: 1.6 },
        itemStyle: { color: COLORS.orange },
      },
    ],
  }
}

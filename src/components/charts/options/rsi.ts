import type { EChartsOption } from 'echarts'
import type { TechnicalData } from '@/types'
import { COLORS } from '../theme'
import { paramList, tooltipRow, tooltipTitle } from './tooltip'
import { initialZoomStart } from './priceDma'

const shortDate = (v: string) => v.slice(5)

/** RSI(14) coloured by zone: green below 30 (oversold), red above 70 (overbought). */
export function rsiOption(cd: TechnicalData['chart_data']): EChartsOption {
  const zoomStart = initialZoomStart(cd.dates.length)
  return {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params) => {
        const p = paramList(params)[0]
        return tooltipTitle(cd.dates[p.dataIndex]) + (p.value == null ? '' : tooltipRow('RSI', Number(p.value).toFixed(1)))
      },
    },
    grid: { top: 15, right: 30, bottom: 40, left: 30, containLabel: true },
    xAxis: { type: 'category', data: cd.dates, boundaryGap: false, axisLabel: { rotate: 30, formatter: shortDate } },
    yAxis: { type: 'value', min: 0, max: 100 },
    visualMap: {
      show: false,
      pieces: [
        { gt: 0, lte: 30, color: COLORS.green },
        { gt: 30, lte: 70, color: COLORS.accent },
        { gt: 70, lte: 100, color: COLORS.red },
      ],
    },
    dataZoom: [{ type: 'inside', start: zoomStart, end: 100 }],
    series: [
      {
        name: 'RSI',
        type: 'line',
        data: cd.rsi,
        symbol: 'none',
        lineStyle: { width: 1.5 },
        areaStyle: { opacity: 0.05 },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', width: 1 },
          data: [
            { yAxis: 70, lineStyle: { color: 'rgba(244,63,94,.4)' }, label: { formatter: '70', color: COLORS.red, fontSize: 10 } },
            { yAxis: 30, lineStyle: { color: 'rgba(16,185,129,.4)' }, label: { formatter: '30', color: COLORS.green, fontSize: 10 } },
          ],
        },
      },
    ],
  }
}

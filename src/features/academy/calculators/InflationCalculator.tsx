import { useMemo, useState } from 'react'
import { COLORS } from '@/components/charts/theme'
import { projectInflation, type InflationField, type InflationInputs } from '@/lib/academy/calculators'
import { formatRupees } from '@/utils/format'
import { Assumptions, CalculatorLayout, FixInputs, NumberField, ResultsCard, ResultStat } from './parts'

const DEFAULTS: InflationInputs = { amount: '1,00,000', years: '10', inflationPct: '6', returnPct: '8' }

const FIELDS: Array<{ key: InflationField; label: string; hint?: string }> = [
  { key: 'amount', label: 'Amount (₹)' },
  { key: 'years', label: 'Years' },
  { key: 'inflationPct', label: 'Assumed inflation (% a year)' },
  { key: 'returnPct', label: 'Assumed return on the amount (% a year)', hint: 'Enter 0 to see cash that earns nothing.' },
]

export function InflationCalculator() {
  const [inputs, setInputs] = useState<InflationInputs>(DEFAULTS)
  const projection = useMemo(() => projectInflation(inputs), [inputs])
  const series = useMemo(
    () =>
      projection.ok
        ? [
            { name: 'Value in rupees', values: projection.result.nominalByYear, color: COLORS.accentSoft },
            { name: 'Value in today’s money', values: projection.result.realByYear, color: COLORS.greenSoft, area: true },
          ]
        : [],
    [projection],
  )
  const real = projection.ok ? projection.result.realReturnPct : 0

  return (
    <div className="space-y-6">
      <CalculatorLayout
        form={FIELDS.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            hint={f.hint}
            value={inputs[f.key]}
            onChange={(value) => setInputs((prev) => ({ ...prev, [f.key]: value }))}
            error={projection.ok ? undefined : projection.errors[f.key]}
          />
        ))}
        results={
          projection.ok ? (
            <ResultsCard series={series} ariaLabel="Line chart by year: the invested amount's value in rupees and in today's money.">
              <ResultStat
                label="Real return"
                value={`${real >= 0 ? '+' : ''}${real.toFixed(2)}% a year`}
                sub="(1 + return) ÷ (1 + inflation) − 1"
                tone={real >= 0 ? 'good' : 'bad'}
              />
              <ResultStat
                label={`Invested amount after ${inputs.years.trim()} years`}
                value={formatRupees(projection.result.nominalValue)}
                sub={`Worth ${formatRupees(projection.result.realValue)} in today’s money`}
              />
              <ResultStat
                label="What costs this much today will cost"
                value={formatRupees(projection.result.futureCost)}
              />
              <ResultStat
                label="This amount received then is worth today"
                value={formatRupees(projection.result.todaysValueOfFutureAmount)}
              />
            </ResultsCard>
          ) : (
            <FixInputs />
          )
        }
      />
      <Assumptions
        lesson={{ slug: 'financial-goals-and-time-horizons', title: 'Financial goals and time horizons' }}
        items={[
          'Prices and the invested amount both compound yearly at the constant rates you enter.',
          '“Today’s money” divides a future amount by the cumulative rise in prices, so it shows purchasing power rather than rupees.',
          'A single inflation rate stands in for your own mix of costs, which may rise faster or slower.',
          'Taxes and costs are not included; after-tax returns are lower.',
        ]}
      />
    </div>
  )
}

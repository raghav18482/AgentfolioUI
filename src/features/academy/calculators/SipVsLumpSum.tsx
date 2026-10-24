import { useMemo, useState } from 'react'
import { COLORS } from '@/components/charts/theme'
import { compareSipLumpSum, type SipLumpField, type SipLumpInputs } from '@/lib/academy/calculators'
import { formatRupees } from '@/utils/format'
import { Assumptions, CalculatorLayout, FixInputs, NumberField, ResultsCard, ResultStat } from './parts'

const DEFAULTS: SipLumpInputs = { total: '6,00,000', years: '10', returnPct: '10' }

const FIELDS: Array<{ key: SipLumpField; label: string; hint?: string }> = [
  { key: 'total', label: 'Total amount to invest (₹)' },
  { key: 'years', label: 'Horizon (years)', hint: 'The SIP spreads the total evenly across every month of the horizon.' },
  { key: 'returnPct', label: 'Assumed return (% a year)' },
]

export function SipVsLumpSum() {
  const [inputs, setInputs] = useState<SipLumpInputs>(DEFAULTS)
  const projection = useMemo(() => compareSipLumpSum(inputs), [inputs])
  const years = projection.ok ? projection.result.lumpSumByYear.length - 1 : 0
  const series = useMemo(
    () =>
      projection.ok
        ? [
            { name: 'Lump sum', values: projection.result.lumpSumByYear, color: COLORS.accentSoft },
            { name: 'SIP: portfolio value', values: projection.result.sipByYear, color: COLORS.greenSoft, area: true },
            { name: 'SIP: amount paid in', values: projection.result.sipInvestedByYear, color: COLORS.muted },
          ]
        : [],
    [projection],
  )

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
            <ResultsCard series={series} ariaLabel="Line chart by year: the lump sum's value, the SIP portfolio's value, and the amount paid into the SIP so far.">
              <ResultStat
                label={`Lump sum: value after ${years} years`}
                value={formatRupees(projection.result.lumpSumValue)}
                sub={`${formatRupees(projection.result.lumpSumByYear[0])} invested on day one`}
              />
              <ResultStat
                label={`SIP: portfolio value after ${years} years`}
                value={formatRupees(projection.result.sipValue)}
                sub={`${formatRupees(projection.result.monthlyInstalment)} a month × ${years * 12} months = ${formatRupees(projection.result.lumpSumByYear[0])} paid in`}
              />
              <p className="text-xs leading-relaxed text-surface-200/65 sm:col-span-2">
                The gap between the SIP’s portfolio value and the amount paid in is its growth. With a steady
                positive return the lump sum always ends higher, because all of the money is invested
                from day one. Real returns are uneven: a fall soon after investing a lump sum can leave it behind a
                SIP for years. And a SIP is usually not a choice — salary arrives monthly, so most people invest it
                as it comes.
              </p>
            </ResultsCard>
          ) : (
            <FixInputs />
          )
        }
      />
      <Assumptions
        lesson={{ slug: 'sip-vs-lump-sum', title: 'SIP vs lump sum: deploying a windfall' }}
        items={[
          'The lump sum is invested in full today; the SIP invests the same total in equal instalments at the start of every month of the horizon.',
          'Both grow at the same constant return, compounded monthly at the equivalent monthly rate.',
          'A constant return hides the sequence risk that decides real outcomes — see the lesson for the same comparison on uneven price paths.',
          'Taxes, fund costs and exit loads are not included.',
        ]}
      />
    </div>
  )
}

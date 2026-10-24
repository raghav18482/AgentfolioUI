import { useMemo, useState } from 'react'
import { COLORS } from '@/components/charts/theme'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { RupeeSeries } from '@/components/charts/options/academy'
import {
  comparePrepayment,
  type PrepayComparison,
  type PrepayField,
  type PrepayInputs,
  type PrepayMode,
} from '@/lib/academy/calculators'
import { formatRupees } from '@/utils/format'
import { Assumptions, CalculatorLayout, FixInputs, NumberField, ResultsCard, ResultStat } from './parts'

/** Defaults are the debt lesson's loan three years in, so the two agree. */
const DEFAULTS: PrepayInputs = {
  outstanding: '37,39,440',
  ratePct: '8.5',
  months: '204',
  prepayment: '5,00,000',
  returnPct: '10',
  mode: 'tenure',
}

const FIELDS: Array<{ key: PrepayField; label: string; hint?: string }> = [
  { key: 'outstanding', label: 'Outstanding loan (₹)', hint: 'From your latest loan statement.' },
  { key: 'ratePct', label: 'Loan interest rate (% a year)' },
  { key: 'months', label: 'Remaining tenure (months)', hint: '17 years left is 204 months.' },
  { key: 'prepayment', label: 'Amount you could prepay (₹)' },
  { key: 'returnPct', label: 'Assumed return if invested instead (% a year)', hint: 'Use a realistic after-tax figure.' },
]

const MODES = [
  { value: 'tenure', label: 'Keep EMI, shorten tenure' },
  { value: 'emi', label: 'Keep tenure, lower EMI' },
] as const

function months(n: number): string {
  const y = Math.floor(n / 12)
  const m = n % 12
  return [y && `${y} yr`, m && `${m} mo`].filter(Boolean).join(' ') || '0 mo'
}

export function PrepayVsInvest() {
  const [inputs, setInputs] = useState<PrepayInputs>(DEFAULTS)
  const comparison = useMemo(() => comparePrepayment(inputs), [inputs])
  const series = useMemo(
    () =>
      comparison.ok
        ? [
            { name: 'Balance without prepaying', values: comparison.result.balanceByYear, color: COLORS.muted },
            { name: 'Balance after prepaying', values: comparison.result.prepaidBalanceByYear, color: COLORS.greenSoft, area: true },
          ]
        : [],
    [comparison],
  )

  return (
    <div className="space-y-6">
      <CalculatorLayout
        form={
          <>
            {FIELDS.map((f) => (
              <NumberField
                key={f.key}
                label={f.label}
                hint={f.hint}
                value={inputs[f.key]}
                onChange={(value) => setInputs((prev) => ({ ...prev, [f.key]: value }))}
                error={comparison.ok ? undefined : comparison.errors[f.key]}
              />
            ))}
            <div>
              <p className="mb-1.5 text-sm font-medium text-surface-200/80">After prepaying</p>
              <SegmentedControl<PrepayMode>
                ariaLabel="After prepaying"
                options={MODES}
                value={inputs.mode}
                onChange={(mode) => setInputs((prev) => ({ ...prev, mode }))}
                size="sm"
              />
            </div>
          </>
        }
        results={comparison.ok ? <Results inputs={inputs} result={comparison.result} series={series} /> : <FixInputs />}
      />
      <Assumptions
        lesson={{ slug: 'debt-and-emi-decisions', title: 'Debt and EMI decisions' }}
        items={[
          'The EMI is worked out on the reducing balance at the annual rate ÷ 12, as lenders quote it, and the rate stays fixed. A floating rate will change.',
          'The prepayment is made today. Both choices spend the same current EMI every month until the loan’s original end date; whatever the loan no longer needs is invested at the end of that month.',
          'Investments grow at the return you enter, compounded monthly at the equivalent monthly rate, with no ups and downs.',
          'Tax is not modelled: interest saved is not taxed, investment returns usually are, and prepaying may reduce a home-loan tax benefit you use.',
          'Under RBI rules there are no pre-payment charges on floating-rate loans taken by individuals for non-business purposes. Fixed-rate loans may carry them — check your loan terms.',
          'Keep your emergency fund intact before prepaying.',
        ]}
      />
    </div>
  )
}

function Results({
  inputs,
  result,
  series,
}: {
  inputs: PrepayInputs
  result: PrepayComparison
  series: RupeeSeries[]
}) {
  const prepayAhead = result.prepayThenInvest >= result.investInstead
  const closed = result.newMonths === 0
  return (
    <ResultsCard series={series} ariaLabel="Line chart by year: outstanding loan balance without and with the prepayment.">
      <ResultStat label="Current EMI" value={formatRupees(result.currentEmi)} />
      {closed ? (
        <ResultStat label="After prepaying" value="Loan closed" tone="good" sub="The prepayment clears the outstanding amount" />
      ) : inputs.mode === 'tenure' ? (
        <ResultStat
          label="Loan closes sooner by"
          value={months(result.monthsSaved)}
          sub={`New remaining tenure: ${months(result.newMonths)}`}
          tone="good"
        />
      ) : (
        <ResultStat
          label="New EMI"
          value={formatRupees(result.newEmi)}
          sub={`${formatRupees(result.currentEmi - result.newEmi)} a month lower, same tenure`}
          tone="good"
        />
      )}
      <ResultStat label="Interest saved (certain)" value={formatRupees(result.interestSaved)} sub="Compared with not prepaying" tone="good" />
      <ResultStat
        label="Break-even investment return"
        value={`${result.breakEvenReturnPct.toFixed(2)}% a year`}
        sub="Investing wins only if you beat this after tax"
      />

      <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4 sm:col-span-2">
        <p className="mb-3 text-xs text-surface-200/55">
          Wealth by the loan’s original end date ({months(result.monthsSaved + result.newMonths)} from now), at the
          assumed return
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Choice
            title="Prepay, then invest the freed-up EMI"
            value={formatRupees(result.prepayThenInvest)}
            ahead={prepayAhead}
          />
          <Choice title="Invest the amount instead, keep the loan" value={formatRupees(result.investInstead)} ahead={!prepayAhead} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-surface-200/65">
          At an assumed {inputs.returnPct.trim()}% a year, {prepayAhead ? 'prepaying' : 'investing'} ends ahead. The
          interest saved by prepaying is certain; the investment figure depends entirely on the return you assumed, and
          real returns are uneven.
        </p>
      </div>
    </ResultsCard>
  )
}

function Choice({ title, value, ahead }: { title: string; value: string; ahead: boolean }) {
  return (
    <div className={ahead ? 'rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3' : 'rounded-lg border border-surface-800 p-3'}>
      <p className="text-xs text-surface-200/65">{title}</p>
      <p className="mt-1 text-lg font-bold tabular-nums text-white">{value}</p>
      {ahead && <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-400">Ahead at this assumption</p>}
    </div>
  )
}

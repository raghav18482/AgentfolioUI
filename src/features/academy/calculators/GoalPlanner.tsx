import { useMemo, useState } from 'react'
import { COLORS } from '@/components/charts/theme'
import { planGoal, type GoalField, type GoalInputs } from '@/lib/academy/calculators'
import { formatRupees } from '@/utils/format'
import { Assumptions, CalculatorLayout, FixInputs, NumberField, ResultsCard, ResultStat } from './parts'

/** Defaults are the worked example in the goals lesson, so the two agree. */
const DEFAULTS: GoalInputs = { costToday: '20,00,000', years: '12', inflationPct: '8', savedSoFar: '3,00,000', returnPct: '10' }

const FIELDS: Array<{ key: GoalField; label: string; hint?: string }> = [
  { key: 'costToday', label: 'Cost of the goal in today’s money (₹)' },
  { key: 'years', label: 'Years until you need it' },
  { key: 'inflationPct', label: 'Assumed inflation for this cost (% a year)', hint: 'Education and healthcare can rise faster than general prices.' },
  { key: 'savedSoFar', label: 'Already set aside for it (₹)' },
  { key: 'returnPct', label: 'Assumed return (% a year)', hint: 'Use a conservative figure for the mix you will hold.' },
]

export function GoalPlanner() {
  const [inputs, setInputs] = useState<GoalInputs>(DEFAULTS)
  const plan = useMemo(() => planGoal(inputs), [inputs])
  const series = useMemo(
    () =>
      plan.ok
        ? [
            { name: 'Goal cost', values: plan.result.costByYear, color: COLORS.orange },
            { name: 'Projected savings', values: plan.result.corpusByYear, color: COLORS.greenSoft, area: true },
          ]
        : [],
    [plan],
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
            error={plan.ok ? undefined : plan.errors[f.key]}
          />
        ))}
        results={
          plan.ok ? (
            <ResultsCard series={series} ariaLabel="Line chart by year: the goal's inflated cost and the projected savings that reach it.">
              <ResultStat label="Cost when you need it" value={formatRupees(plan.result.futureCost)} />
              <ResultStat label="What today’s savings could grow to" value={formatRupees(plan.result.savingsAtGoal)} />
              {plan.result.monthlyNeeded > 0 ? (
                <>
                  <ResultStat
                    label="Monthly investment needed"
                    value={`${formatRupees(plan.result.monthlyNeeded)} / month`}
                    sub="Invested at the start of each month"
                  />
                  <ResultStat label="Total you would invest" value={formatRupees(plan.result.totalToInvest)} />
                </>
              ) : (
                <ResultStat
                  label="Monthly investment needed"
                  value="₹0"
                  sub="Savings already cover this goal at these assumptions"
                  tone="good"
                />
              )}
            </ResultsCard>
          ) : (
            <FixInputs />
          )
        }
      />
      <Assumptions
        lesson={{ slug: 'financial-goals-and-time-horizons', title: 'Financial goals and time horizons' }}
        items={[
          'The goal’s cost grows at the inflation rate you enter, compounded yearly.',
          'Savings and monthly investments grow at the return you enter, compounded monthly at the equivalent monthly rate; each instalment is invested at the start of its month.',
          'Rates stay constant for the whole period. Real returns vary year to year, and can be negative.',
          'Taxes, fund costs and exit loads are not included.',
          'Re-run it each year with your actual balance — as the goal nears, shift money to lower-risk options.',
        ]}
      />
    </div>
  )
}

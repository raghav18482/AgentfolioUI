import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { planPosition, type PositionField, type PositionInputs } from '@/lib/tradingLab/positionSize'
import { formatRupees } from '@/utils/format'
import { FixInputs, NumberField, ResultStat } from '../calculators/parts'

const DEFAULTS: PositionInputs = { capital: '1,00,000', riskPct: '1', entry: '500', stop: '475', rewardRatio: '2' }

const FIELDS: Array<{ key: PositionField; label: string; hint?: string }> = [
  { key: 'capital', label: 'Trading capital (₹)' },
  { key: 'riskPct', label: 'Risk per trade (% of capital)', hint: 'What you accept losing if the stop is hit.' },
  { key: 'entry', label: 'Entry price (₹)' },
  { key: 'stop', label: 'Stop-loss price (₹)', hint: 'Below the entry, for a long trade.' },
  { key: 'rewardRatio', label: 'Reward-to-risk ratio', hint: '2 means aiming to gain twice what you risk.' },
]

/** How many units to buy so that a stopped-out trade costs a set share of capital. */
export function PositionSizeTool() {
  const [inputs, setInputs] = useState<PositionInputs>(DEFAULTS)
  const plan = useMemo(() => planPosition(inputs), [inputs])

  return (
    <section aria-labelledby="sizer-title" className="space-y-4">
      <div>
        <h2 id="sizer-title" className="text-xl font-extrabold text-white">
          Position-size tool
        </h2>
        <p className="mt-1 max-w-[70ch] text-sm leading-relaxed text-surface-200/65">
          Size a trade from the loss you are willing to take, not from how confident you feel. The Lab sizes every
          Buy with this same rule.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Card className="space-y-4 self-start">
          {FIELDS.map((f) => (
            <NumberField
              key={f.key}
              label={f.label}
              hint={f.hint}
              value={inputs[f.key]}
              onChange={(value) => setInputs((prev) => ({ ...prev, [f.key]: value }))}
              error={plan.ok ? undefined : plan.errors[f.key]}
            />
          ))}
        </Card>
        {plan.ok ? (
          <Card className="space-y-4 self-start">
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultStat
                label="Units to buy"
                value={plan.result.units.toLocaleString('en-IN')}
                sub={plan.result.cappedByCapital ? 'Limited by capital, not by risk' : 'Rounded down to stay within your risk'}
              />
              <ResultStat
                label="Loss if the stop is hit"
                value={formatRupees(plan.result.amountAtRisk)}
                sub={`${plan.result.riskPctOfCapital.toFixed(2)}% of capital, before costs`}
                tone="bad"
              />
              <ResultStat
                label="Position value"
                value={formatRupees(plan.result.positionValue)}
                sub={`${plan.result.positionPctOfCapital.toFixed(1)}% of capital`}
              />
              <ResultStat
                label="Target for this reward-to-risk"
                value={`₹${plan.result.target.toFixed(2)}`}
                sub="A level to plan around, not a prediction"
                tone="good"
              />
            </div>
            <p className="text-xs leading-relaxed text-surface-200/60">
              Units = capital × risk % ÷ (entry − stop), rounded down and capped at what the capital can buy. A stop is
              not guaranteed: if the price gaps below it, the loss is larger. Brokerage, taxes and slippage add to it.
            </p>
          </Card>
        ) : (
          <FixInputs />
        )}
      </div>
    </section>
  )
}

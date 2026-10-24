import { useMemo, type ReactNode } from 'react'
import { EChart } from '@/components/charts/EChart'
import {
  drawdownRecoveryOption,
  goalFutureCostOption,
  loanPrepaymentOption,
  sipPauseOption,
} from '@/components/charts/options/academy'
import { compoundSeries } from '@/lib/academy/growth'
import { FALL_AND_RECOVERY_PATH, gainToRecover, investInstalments, sipAmounts } from '@/lib/academy/investing'
import { amortize, emi } from '@/lib/academy/loans'
import type { LessonVisualKey } from './content/types'

/**
 * The charts lessons embed. Loaded lazily by `LessonVisual`, so ECharts is only
 * downloaded for a lesson that has one.
 */
export function LessonCharts({ visual }: { visual: LessonVisualKey }) {
  switch (visual) {
    case 'loan-prepayment':
      return <LoanPrepayment />
    case 'goal-future-cost':
      return <GoalFutureCost />
    case 'drawdown-recovery':
      return <DrawdownRecovery />
    case 'sip-pause':
      return <SipPause />
  }
}

/** Year-end balances from a monthly schedule, padded with zeros once the loan closes. */
function yearEnd(balances: number[], years: number): number[] {
  return Array.from({ length: years + 1 }, (_, y) => balances[y * 12] ?? 0)
}

function LoanPrepayment() {
  const option = useMemo(() => {
    const principal = 40_00_000
    const rate = 8.5
    const monthly = emi(principal, rate, 240)
    const base = amortize(principal, rate, monthly)
    const prepaid = amortize(principal, rate, monthly, [{ afterMonth: 36, amount: 5_00_000 }])
    return loanPrepaymentOption(yearEnd(base.balances, 20), yearEnd(prepaid.balances, 20))
  }, [])
  return (
    <Figure caption="₹40 lakh over 20 years at an assumed 8.5%, EMI about ₹34,713. Prepaying ₹5 lakh after year 3 and keeping the EMI closes the loan 50 months early. Illustrative only — your loan’s rate and terms will differ.">
      <EChart
        option={option}
        height={280}
        ariaLabel="Line chart: outstanding home loan balance by year. With a five lakh prepayment in year three, the balance falls faster and reaches zero about four years earlier."
      />
    </Figure>
  )
}

function GoalFutureCost() {
  const option = useMemo(() => goalFutureCostOption(compoundSeries(20_00_000, 6, 12), compoundSeries(20_00_000, 8, 12), 6, 8), [])
  return (
    <Figure caption="A goal costing ₹20 lakh today, needed in 12 years. At an assumed 8% a year it costs about ₹50.4 lakh; at 6%, about ₹40.2 lakh. These are assumptions to test, not forecasts.">
      <EChart
        option={option}
        height={280}
        ariaLabel="Line chart: the future cost of a twenty lakh goal over twelve years, rising to about fifty lakh at eight percent inflation and about forty lakh at six percent."
      />
    </Figure>
  )
}

const FALLS = [10, 20, 30, 40, 50, 60]

function DrawdownRecovery() {
  const option = useMemo(() => drawdownRecoveryOption(FALLS, FALLS.map(gainToRecover)), [])
  return (
    <Figure caption="The gain needed to get back to a previous peak after each size of fall. The deeper the fall, the faster the required gain grows — a 60% fall needs a 150% gain.">
      <EChart
        option={option}
        height={260}
        ariaLabel="Bar chart: gain needed to recover from a fall. Ten percent needs 11.1, twenty needs 25, thirty needs 42.9, forty needs 66.7, fifty needs 100, sixty needs 150 percent."
      />
    </Figure>
  )
}

function SipPause() {
  const option = useMemo(
    () =>
      sipPauseOption(
        investInstalments(FALL_AND_RECOVERY_PATH, sipAmounts()).valueSeries,
        investInstalments(FALL_AND_RECOVERY_PATH, sipAmounts(6, 17)).valueSeries,
      ),
    [],
  )
  return (
    <Figure caption="Value of a ₹20,000 monthly SIP on a made-up price path that falls 30%, recovers, then rises 15%. Pausing for months 6–17 skips the cheapest units: ₹5.58 lakh from ₹4.8 lakh invested, against ₹9.15 lakh from ₹7.2 lakh. Not market data.">
      <EChart
        option={option}
        height={280}
        ariaLabel="Line chart over 36 months: the investor who kept the SIP going ends near 9.15 lakh; the investor who paused for a year ends near 5.58 lakh."
      />
    </Figure>
  )
}

function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure>
      {children}
      <figcaption className="mt-2 text-xs leading-relaxed text-surface-200/55">{caption}</figcaption>
    </figure>
  )
}

/**
 * Reducing-balance loan maths, as Indian lenders quote it: interest accrues
 * monthly at annual rate ÷ 12 on the outstanding balance. Rates are percentages
 * per year (8.5 means 8.5%).
 */

/** The fixed monthly instalment that repays `principal` over `months`. */
export function emi(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) throw new Error('Principal and tenure must be positive')
  const r = annualRatePct / 1200
  if (r === 0) return principal / months
  const growth = (1 + r) ** months
  return (principal * r * growth) / (growth - 1)
}

export interface Prepayment {
  /** Paid straight after this month's EMI (1 = after the first EMI). */
  afterMonth: number
  amount: number
}

export interface LoanSchedule {
  /** Outstanding balance after each month; index 0 is the original principal. */
  balances: number[]
  /** Months until the balance reaches zero. */
  months: number
  totalInterest: number
}

/**
 * Month-by-month schedule at a fixed EMI. A prepayment keeps the EMI and so
 * shortens the tenure — the option that saves the most interest.
 */
export function amortize(
  principal: number,
  annualRatePct: number,
  monthlyEmi: number,
  prepayments: readonly Prepayment[] = [],
): LoanSchedule {
  const r = annualRatePct / 1200
  if (monthlyEmi <= principal * r) throw new Error('EMI does not cover the monthly interest, so the loan never ends')

  const balances = [principal]
  let balance = principal
  let totalInterest = 0
  // A ceiling well past any real tenure, so bad input can't loop forever.
  for (let month = 1; balance > 0.005 && month <= 1200; month++) {
    const interest = balance * r
    totalInterest += interest
    balance = Math.max(0, balance + interest - Math.min(monthlyEmi, balance + interest))
    for (const p of prepayments) if (p.afterMonth === month) balance = Math.max(0, balance - p.amount)
    // Float residue from the final instalment is not a debt; snap sub-paisa balances to zero.
    if (balance < 0.005) balance = 0
    balances.push(balance)
  }
  return { balances, months: balances.length - 1, totalInterest }
}

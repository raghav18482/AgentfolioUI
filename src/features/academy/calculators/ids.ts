/** The calculators, in tab order. Lessons link to one with `/learn/calculators?tool=<id>`. */
export const CALCULATORS = [
  {
    id: 'goal',
    label: 'Goal planner',
    description:
      'Turn a goal into a future cost and the monthly investment that reaches it, given what you have already set aside.',
  },
  {
    id: 'sip',
    label: 'SIP vs lump sum',
    description:
      'Compare investing a total amount today with spreading the same total as a monthly SIP over the horizon, at the same assumed return.',
  },
  {
    id: 'prepay',
    label: 'Prepay vs invest',
    description:
      'Compare prepaying part of a loan with investing the same amount: interest and months saved, the break-even return, and where each choice leaves you by the loan’s original end date.',
  },
  {
    id: 'inflation',
    label: 'Inflation and real return',
    description:
      'See what inflation does to a cost or a sum of money over time, and what an assumed return is worth after inflation.',
  },
] as const

export type CalculatorId = (typeof CALCULATORS)[number]['id']

export function calculatorFrom(raw: string | null): CalculatorId {
  return CALCULATORS.find((c) => c.id === raw)?.id ?? 'goal'
}

export function calculatorPath(id: CalculatorId): string {
  return `/learn/calculators?tool=${id}`
}

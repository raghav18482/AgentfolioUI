import type { LearningPath } from './types'

/** Learning paths in the order the Academy presents them. Only paths with complete lessons appear. */
export const PATHS: LearningPath[] = [
  {
    id: 'managing-money',
    title: 'Managing Your Money',
    description:
      'Turn take-home pay into a plan: find your real surplus, hold the right reserves, handle debt and EMIs, protect your income, and put numbers on your goals.',
    level: 'core',
  },
  {
    id: 'investing-decisions',
    title: 'Making Investment Decisions',
    description:
      'Choose the right vehicles, set an allocation you can hold, deploy lump sums, judge funds on evidence, and keep behaviour from undoing the plan.',
    level: 'intermediate',
  },
]

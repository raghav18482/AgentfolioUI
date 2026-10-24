import type { Level } from './content/types'

export const LEVEL_LABEL: Record<Level, string> = {
  core: 'Core',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

const asOfFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

/** "As of" date for a source, from its `YYYY-MM-DD`. */
export function formatAsOf(iso: string): string {
  return asOfFormat.format(new Date(`${iso}T00:00:00`))
}

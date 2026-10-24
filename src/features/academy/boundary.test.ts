import { describe, expect, it } from 'vitest'

/**
 * The Academy is static education: it must never reach the backend, and in
 * particular never the trading API, whose `approveProposal` places a real order.
 * Every Academy and Trading Lab source file — including the Lab's chart
 * builder — is read as text and its imports are checked.
 */
const sources = import.meta.glob<string>(
  [
    '/src/features/academy/**/*.{ts,tsx}',
    '/src/lib/academy/**/*.{ts,tsx}',
    '/src/lib/tradingLab/**/*.{ts,tsx}',
    '/src/components/charts/options/tradingLab.ts',
    '!**/*.test.ts',
  ],
  { query: '?raw', import: 'default', eager: true },
)

/** Module specifiers from `import … from '…'`, `export … from '…'` and dynamic `import('…')`. */
function importsOf(code: string): string[] {
  const specifiers: string[] = []
  for (const m of code.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g)) specifiers.push(m[1])
  return specifiers
}

const FORBIDDEN = [
  /^@\/api(\/|$)/,
  /(^|\/)api\/(client|trading)/,
  /^axios$/,
  /^@\/hooks\/(useTrading|usePortfolio|useEventSource)$/,
  /^@\/features\/trading(\/|$)/,
]

describe('Academy boundary', () => {
  it('finds the Academy and Trading Lab source files', () => {
    const files = Object.keys(sources)
    expect(files.length).toBeGreaterThan(5)
    for (const lab of ['/src/lib/tradingLab/simulator.ts', '/src/features/academy/tradingLab/LabSession.tsx']) expect(files).toContain(lab)
  })

  it('keeps the Lab free of network and storage calls', () => {
    const lab = Object.entries(sources).filter(([path]) => path.includes('tradingLab'))
    for (const [path, code] of lab) expect(code, path).not.toMatch(/\bfetch\(|XMLHttpRequest|WebSocket|EventSource|localStorage/)
  })

  it.each(Object.entries(sources))('%s imports nothing from the API or trading layer', (_, code) => {
    const bad = importsOf(code).filter((spec) => FORBIDDEN.some((re) => re.test(spec)))
    expect(bad).toEqual([])
  })

  it('detects a forbidden import when there is one', () => {
    const sample = "import { approveProposal } from '@/api/trading'\nconst m = import('../../api/client')"
    expect(importsOf(sample).filter((spec) => FORBIDDEN.some((re) => re.test(spec)))).toEqual([
      '@/api/trading',
      '../../api/client',
    ])
  })
})

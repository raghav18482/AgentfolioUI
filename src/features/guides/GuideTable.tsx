import type { ReactNode } from 'react'

interface GuideTableProps {
  columns: string[]
  rows: ReactNode[][]
  /** Caption for screen readers; tables in prose are otherwise unnamed. */
  caption: string
}

export function GuideTable({ columns, rows, caption }: GuideTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-800">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-surface-800 bg-surface-900/80 text-xs uppercase tracking-wider text-surface-200/50">
            {columns.map((c) => (
              <th key={c} scope="col" className="px-4 py-2.5 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-surface-800/50 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 align-top text-surface-200/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

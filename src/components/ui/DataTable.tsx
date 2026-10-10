import { clsx } from 'clsx'
import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'right'
  /** Hide below this breakpoint, for secondary columns on narrow screens. */
  hideBelow?: 'sm' | 'md'
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T, index: number) => string
  /** Names the table for screen readers. */
  caption: string
}

const hide = { sm: 'hidden sm:table-cell', md: 'hidden md:table-cell' }

/** The app's standard table: muted uppercase header, hairline rows, numbers right-aligned. */
export function DataTable<T>({ columns, rows, rowKey, caption }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-surface-800 text-xs uppercase tracking-wider text-surface-200/50">
            {columns.map((c) => (
              <th
                key={c.header}
                scope="col"
                className={clsx(
                  'px-5 py-3 font-medium',
                  c.align === 'right' ? 'text-right' : 'text-left',
                  c.hideBelow && hide[c.hideBelow],
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={rowKey(row, i)}
              className="border-b border-surface-800/50 transition-colors last:border-0 hover:bg-surface-800/30"
            >
              {columns.map((c) => (
                <td
                  key={c.header}
                  className={clsx(
                    'px-5 py-3.5',
                    c.align === 'right' ? 'text-right tabular-nums' : 'text-left',
                    c.hideBelow && hide[c.hideBelow],
                    c.className,
                  )}
                >
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

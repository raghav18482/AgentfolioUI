import ReactMarkdown from 'react-markdown'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-semibold text-white mt-3 mb-1.5">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold text-white mt-2 mb-1">{children}</h3>,
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li className="text-surface-200/90">{children}</li>,
        code: ({ className, children }) => {
          const isBlock = className?.includes('language-')
          if (isBlock) {
            return (
              <pre className="my-2 rounded-lg bg-surface-800 p-3 text-xs overflow-x-auto">
                <code>{children}</code>
              </pre>
            )
          }
          return <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-brand-300">{children}</code>
        },
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className="w-full text-xs border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => <th className="border border-surface-700 bg-surface-800 px-2 py-1 text-left font-medium text-surface-200">{children}</th>,
        td: ({ children }) => <td className="border border-surface-800 px-2 py-1 text-surface-200/80">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

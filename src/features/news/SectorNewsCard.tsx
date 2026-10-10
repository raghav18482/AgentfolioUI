import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/format'
import type { SectorNews } from '@/types'

interface Props {
  sector: SectorNews
}

export function SectorNewsCard({ sector }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">{sector.name}</h3>
          <p className="text-xs text-surface-200/50">
            Invested: {formatCurrency(sector.invested)}
          </p>
        </div>
        <Badge variant="info">{sector.news.length} articles</Badge>
      </div>

      <div className="space-y-3">
        {sector.news.slice(0, 5).map((article, i) => (
          <div key={i} className="border-t border-surface-800/50 pt-3 first:border-0 first:pt-0">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 text-sm font-medium text-surface-200/90 hover:text-brand-400 transition-colors"
            >
              <span className="line-clamp-2 flex-1">{article.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <p className="mt-1 text-xs text-surface-200/50 line-clamp-2">{article.description}</p>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-surface-200/40">
              <span>{article.source}</span>
              <span>&middot;</span>
              <span>{article.date}</span>
            </div>
          </div>
        ))}
        {sector.news.length > 5 && (
          <p className="text-xs text-surface-200/40 pt-2">
            +{sector.news.length - 5} more articles
          </p>
        )}
      </div>
    </Card>
  )
}

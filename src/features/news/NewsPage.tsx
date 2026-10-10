import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Newspaper, Search, BarChart3 } from 'lucide-react'
import { Tabs } from '@/components/ui/Tabs'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { SectorNewsCard } from './SectorNewsCard'
import { SentimentBar } from './SentimentBar'
import { fetchPortfolioNews, searchNews, analyzeSentiment } from '@/api/news'
import type { SentimentResult } from '@/types'

const PERIODS = [
  { key: '7d', label: '7 Days' },
  { key: '1m', label: '1 Month' },
  { key: '3m', label: '3 Months' },
]

export function NewsPage() {
  const [tab, setTab] = useState('portfolio')
  const [period, setPeriod] = useState('7d')
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null)

  const portfolioNews = useQuery({
    queryKey: ['portfolio-news', period],
    queryFn: () => fetchPortfolioNews(period),
  })

  const newsSearch = useQuery({
    queryKey: ['news-search', submittedQuery, period],
    queryFn: () => searchNews(submittedQuery, period),
    enabled: !!submittedQuery,
  })

  const sentimentMutation = useMutation({
    mutationFn: (sectors: string[]) => analyzeSentiment(sectors),
    onSuccess: (data) => setSentiment(data),
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) setSubmittedQuery(searchQuery.trim())
  }

  function runSentiment() {
    if (!portfolioNews.data?.sectors) return
    const sectorNames = portfolioNews.data.sectors.map((s) => s.name)
    sentimentMutation.mutate(sectorNames)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">News</h1>
        <p className="mt-1 text-sm text-surface-200/60">Market news and sentiment analysis</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 animate-slide-up">
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <Button
              key={p.key}
              variant={period === p.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <Tabs
        items={[
          { key: 'portfolio', label: 'Portfolio News', icon: <Newspaper className="h-3.5 w-3.5" /> },
          { key: 'explore', label: 'Explore News', icon: <Search className="h-3.5 w-3.5" /> },
        ]}
        activeKey={tab}
        onChange={setTab}
      />

      {tab === 'portfolio' && (
        <div className="space-y-6 animate-fade-in">
          {portfolioNews.isLoading && <Spinner size="lg" />}
          {portfolioNews.error && (
            <Card>
              <p className="text-center text-rose-300 py-4">Failed to load news</p>
            </Card>
          )}

          {portfolioNews.data && (
            <>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={runSentiment}
                  loading={sentimentMutation.isPending}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Run Sentiment Analysis
                </Button>
              </div>

              {sentiment && (
                <Card>
                  <h3 className="text-sm font-medium text-white mb-3">Portfolio Sentiment</h3>
                  <SentimentBar
                    bullish={sentiment.portfolio_sentiment.bullish}
                    neutral={sentiment.portfolio_sentiment.neutral}
                    bearish={sentiment.portfolio_sentiment.bearish}
                  />
                  <p className="mt-2 text-xs text-surface-200/60">
                    {sentiment.portfolio_sentiment.total_articles} articles analyzed —{' '}
                    <span className="text-white font-medium">{sentiment.portfolio_sentiment.label}</span>
                  </p>
                </Card>
              )}

              {portfolioNews.data.sectors.length === 0 ? (
                <Card>
                  <p className="text-center text-surface-200/50 py-8">No news found for this period</p>
                </Card>
              ) : (
                portfolioNews.data.sectors.map((sector) => (
                  <SectorNewsCard key={sector.name} sector={sector} />
                ))
              )}
            </>
          )}
        </div>
      )}

      {tab === 'explore' && (
        <div className="space-y-6 animate-fade-in">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-200/40" />
              <input
                type="text"
                placeholder="Search for news (e.g. Reliance, IT sector)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-surface-700 bg-surface-800/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-surface-200/30 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
              />
            </div>
            <Button type="submit" size="md">Search</Button>
          </form>

          {newsSearch.isLoading && <Spinner />}
          {newsSearch.data && (
            newsSearch.data.articles.length === 0 ? (
              <Card>
                <p className="text-center text-surface-200/50 py-8">No results found</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {newsSearch.data.articles.map((article, i) => (
                  <Card key={i}>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white hover:text-brand-400 transition-colors line-clamp-2"
                    >
                      {article.title}
                    </a>
                    <p className="mt-2 text-xs text-surface-200/60 line-clamp-3">{article.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-surface-200/40">
                      <span>{article.source}</span>
                      <span>&middot;</span>
                      <span>{article.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

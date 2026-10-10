import { useQuery } from '@tanstack/react-query'
import { Activity } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import { SectorHeatmap } from './SectorHeatmap'
import { SectorCard } from './SectorCard'
import { fetchSectorOverview, fetchMarketBreadth } from '@/api/sectors'

export function SectorsPage() {
  const overview = useQuery({
    queryKey: ['sector-overview'],
    queryFn: fetchSectorOverview,
    staleTime: 6 * 60 * 60 * 1000,
  })

  const breadth = useQuery({
    queryKey: ['market-breadth'],
    queryFn: fetchMarketBreadth,
    staleTime: 5 * 60 * 1000,
  })

  const isLoading = overview.isLoading || breadth.isLoading

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Sectors</h1>
        <p className="mt-1 text-sm text-surface-200/60">Sector allocation & market breadth</p>
      </div>

      {isLoading && <Spinner size="lg" />}

      {breadth.data && (
        <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">
          <StatCard
            label="India VIX"
            value={breadth.data.india_vix?.current?.toFixed(2) ?? '—'}
            icon={<Activity className="h-4 w-4" />}
          />
          <StatCard
            label="52W Highs"
            value={String(breadth.data.week52_highs ?? '—')}
            trend="up"
          />
          <StatCard
            label="52W Lows"
            value={String(breadth.data.week52_lows ?? '—')}
            trend="down"
          />
        </div>
      )}

      {breadth.data?.sector_heatmap && breadth.data.sector_heatmap.length > 0 && (
        <SectorHeatmap data={breadth.data.sector_heatmap} />
      )}

      {breadth.data?.fii_dii && breadth.data.fii_dii.length > 0 && (
        <Card>
          <h3 className="text-sm font-medium text-white mb-3">FII / DII Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-800 text-xs uppercase tracking-wider text-surface-200/50">
                  {Object.keys(breadth.data.fii_dii[0] || {}).map((key) => (
                    <th key={key} className="px-3 py-2 text-left font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breadth.data.fii_dii.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-surface-800/50 last:border-0">
                    {Object.values(row).map((val: any, j: number) => (
                      <td key={j} className="px-3 py-2 text-surface-200/80">{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {overview.data && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Sector Allocation</h2>
          {overview.data.sectors.length === 0 ? (
            <Card>
              <p className="text-center text-surface-200/50 py-8">No sector data available</p>
            </Card>
          ) : (
            overview.data.sectors.map((sector) => (
              <SectorCard key={sector.name} sector={sector} />
            ))
          )}
        </div>
      )}

      {overview.error && (
        <Card>
          <p className="text-center text-rose-300 py-4">Failed to load sector data</p>
        </Card>
      )}
    </div>
  )
}

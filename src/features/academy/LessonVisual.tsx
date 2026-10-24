import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import type { LessonVisualKey } from './content/types'

const LessonCharts = lazy(() => import('./LessonCharts').then((m) => ({ default: m.LessonCharts })))

/** A lesson's chart, with a placeholder of the same height while ECharts loads. */
export function LessonVisual({ visual }: { visual: LessonVisualKey }) {
  return (
    <Suspense fallback={<Skeleton height={280} />}>
      <LessonCharts visual={visual} />
    </Suspense>
  )
}

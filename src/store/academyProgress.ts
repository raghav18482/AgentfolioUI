import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { applyQuizResult, emptyProgress, type ProgressData } from '@/lib/academy/progress'

interface AcademyProgressState extends ProgressData {
  recordQuiz: (slug: string, score: number, total: number) => void
  visitLesson: (slug: string) => void
  reset: () => void
}

/**
 * Academy progress, kept in this browser only — v1 stores nothing about
 * learners on the server. `createJSONStorage` falls back to memory when storage
 * is disabled (some private-browsing modes), so progress then lasts for the visit.
 */
export const useAcademyProgress = create<AcademyProgressState>()(
  persist(
    (set) => ({
      ...emptyProgress(),
      recordQuiz: (slug, score, total) =>
        set((state) => applyQuizResult(state, slug, score, total, new Date().toISOString())),
      visitLesson: (slug) => set({ lastLesson: slug }),
      reset: () => set(emptyProgress()),
    }),
    {
      name: 'agentfolio_academy_v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ completed, bestScore, lastLesson }): ProgressData => ({ completed, bestScore, lastLesson }),
    },
  ),
)

import { lazy, type ComponentType } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { GuestOnlyRoute } from '@/components/auth/GuestOnlyRoute'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LandingPage } from '@/features/landing/LandingPage'
import { LoginPage } from '@/features/auth/LoginPage'

/**
 * Code-split a page exported by name. Every route except the two a first-time
 * visitor lands on downloads only when visited — which keeps ECharts, the
 * heaviest dependency, off the landing and login pages entirely.
 */
function page<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(() => load().then((module) => ({ default: module[name] })))
}

const EnrollPage = page(() => import('@/features/auth/EnrollPage'), 'EnrollPage')
const SetupGuidePage = page(() => import('@/features/guides/SetupGuidePage'), 'SetupGuidePage')
const ConnectMcpPage = page(() => import('@/features/guides/ConnectMcpPage'), 'ConnectMcpPage')
const DashboardPage = page(() => import('@/features/dashboard/DashboardPage'), 'DashboardPage')
const PositionsPage = page(() => import('@/features/positions/PositionsPage'), 'PositionsPage')
const OrdersPage = page(() => import('@/features/orders/OrdersPage'), 'OrdersPage')
const AnalyticsPage = page(() => import('@/features/analytics/AnalyticsPage'), 'AnalyticsPage')
const AgentPage = page(() => import('@/features/agent/AgentPage'), 'AgentPage')
const NewsPage = page(() => import('@/features/news/NewsPage'), 'NewsPage')
const ResearchPage = page(() => import('@/features/research/ResearchPage'), 'ResearchPage')
const LearnPage = page(() => import('@/features/learn/LearnPage'), 'LearnPage')
const AcademyHomePage = page(() => import('@/features/academy/AcademyHomePage'), 'AcademyHomePage')
const LessonPage = page(() => import('@/features/academy/LessonPage'), 'LessonPage')
const GlossaryPage = page(() => import('@/features/academy/GlossaryPage'), 'GlossaryPage')
const CalculatorsPage = page(() => import('@/features/academy/calculators/CalculatorsPage'), 'CalculatorsPage')
const TradingLabPage = page(() => import('@/features/academy/tradingLab/TradingLabPage'), 'TradingLabPage')
const SectorsPage = page(() => import('@/features/sectors/SectorsPage'), 'SectorsPage')
const TradingPage = page(() => import('@/features/trading/TradingPage'), 'TradingPage')
const NotFoundPage = page(() => import('@/features/errors/NotFoundPage'), 'NotFoundPage')

/** `/app/` in production (served by FastAPI), `/` under the dev server. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<GuestOnlyRoute />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="enroll" element={<EnrollPage />} />
          </Route>
          <Route path="setup" element={<SetupGuidePage />} />
          <Route path="connect" element={<ConnectMcpPage />} />
          {/* The Financial Learning Academy is public: no account needed to learn. */}
          <Route path="learn">
            <Route index element={<AcademyHomePage />} />
            <Route path="lessons/:slug" element={<LessonPage />} />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="calculators" element={<CalculatorsPage />} />
            <Route path="trading-lab" element={<TradingLabPage />} />
            <Route path="metrics" element={<LearnPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="positions" element={<PositionsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="agent" element={<AgentPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="sectors" element={<SectorsPage />} />
            <Route path="trading" element={<TradingPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

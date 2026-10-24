import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ToastContainer } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'

/**
 * Start each page at the top, as a full page load would. A URL with a hash
 * (`/learn/metrics#how-it-works`) is left alone so the page can scroll to its anchor.
 */
function useScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
}

export function AppLayout() {
  useScrollToTopOnNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<Spinner size="lg" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

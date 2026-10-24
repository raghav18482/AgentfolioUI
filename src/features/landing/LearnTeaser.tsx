import { ArrowRight, BookMarked, Calculator, CandlestickChart, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/ButtonLink'

const cards = [
  {
    to: '/learn',
    icon: GraduationCap,
    title: 'Practical lessons',
    desc: 'Surplus, reserves, EMIs, insurance and goals — then asset allocation, fund evaluation and investor behaviour. Each built around a real decision.',
  },
  {
    to: '/learn/calculators',
    icon: Calculator,
    title: 'Calculators',
    desc: 'Plan a goal, compare SIP with a lump sum, weigh prepaying a loan against investing, and see what inflation does.',
  },
  {
    to: '/learn/glossary',
    icon: BookMarked,
    title: 'Glossary',
    desc: 'EMIs, prepayment, liquid funds, XIRR, TRI benchmarks, SIFs and more, each with a worked example.',
  },
  {
    to: '/learn/trading-lab',
    icon: CandlestickChart,
    title: 'Trading Lab',
    desc: 'Practise a documented strategy on a synthetic market — simulated trades only, with costs and position sizing.',
  },
]

/** The landing page's entry point into the free Financial Learning Academy. */
export function LearnTeaser() {
  return (
    <section className="px-4 py-20 sm:py-24" aria-labelledby="learn-teaser-title">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-sm text-brand-300">
            <GraduationCap className="h-3.5 w-3.5" />
            Free · no sign-up
          </div>
          <h2 id="learn-teaser-title" className="font-display text-3xl font-bold text-white sm:text-5xl">
            Make better money decisions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-200/60">
            The Financial Learning Academy: practical lessons on putting your salary or business income to work —
            surplus, debt, protection, goals and investing.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-surface-800 bg-surface-900/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-surface-700"
            >
              <div className="mb-5 inline-flex rounded-xl border border-surface-700/60 bg-surface-800/60 p-3">
                <Icon className="h-5 w-5 text-brand-400" />
              </div>
              <h3 className="mb-2 flex items-center gap-1.5 text-lg font-semibold text-white">
                {title}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </h3>
              <p className="text-sm leading-relaxed text-surface-200/60">{desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink to="/learn" size="lg">
            Start learning
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

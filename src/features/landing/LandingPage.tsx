import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  BarChart3,
  Brain,
  Zap,
  ShieldCheck,
  TrendingUp,
  Bot,
  ArrowRight,
  Sparkles,
  MessageSquare,
  LineChart,
  Link2,
  Cpu,
  Rocket,
  Check,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { PageMeta } from '@/components/layout/PageMeta'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { LogoMark } from '@/components/ui/Logo'
import { SITE_URL } from '@/seo/routes'
import { FeedbackForm } from './FeedbackForm'
import { LearnTeaser } from './LearnTeaser'

const features = [
  {
    icon: BarChart3,
    title: 'Live Portfolio',
    desc: 'Holdings, positions, funds, and P&L streaming live from Angel One.',
    color: 'text-emerald-400',
    glow: 'from-emerald-500/20',
    span: 'lg:col-span-2',
  },
  {
    icon: Brain,
    title: 'AI Insights',
    desc: 'Portfolio analysis, risk cues, and Q&A powered by your choice of LLM.',
    color: 'text-amber-400',
    glow: 'from-amber-500/20',
    span: '',
  },
  {
    icon: Zap,
    title: 'MCP Ready',
    desc: 'Connect through Claude, ChatGPT, Cursor, or any MCP-compatible client.',
    color: 'text-sky-400',
    glow: 'from-sky-500/20',
    span: '',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Storage',
    desc: 'Credentials stay in memory only. Nothing written to disk, ever.',
    color: 'text-cyan-400',
    glow: 'from-cyan-500/20',
    span: '',
  },
  {
    icon: TrendingUp,
    title: 'ML Predictions',
    desc: 'Multi-timeframe directional forecasts using ensemble LightGBM models.',
    color: 'text-violet-400',
    glow: 'from-violet-500/20',
    span: '',
  },
  {
    icon: Bot,
    title: 'Trading Agent',
    desc: 'An AI agent that analyses, proposes, and executes trades — only with your approval.',
    color: 'text-rose-400',
    glow: 'from-rose-500/20',
    span: 'lg:col-span-2',
  },
]

const steps = [
  {
    icon: Link2,
    title: 'Connect Angel One',
    desc: 'Link your broker account in under a minute. Credentials are encrypted and only ever decrypted in memory.',
  },
  {
    icon: Cpu,
    title: 'Pick your AI',
    desc: 'Use the built-in dashboard, or plug Agentfolio into Claude, ChatGPT, or Cursor over MCP.',
  },
  {
    icon: Rocket,
    title: 'Ask, analyse, act',
    desc: 'Get insights, forecasts, and trade proposals — you stay in control of every order.',
  },
]

const premiumFeatures = [
  {
    icon: MessageSquare,
    title: 'Daily WhatsApp Briefings',
    desc: 'Personalised market summary with per-stock signals and ML predictions delivered to your phone every morning.',
  },
  {
    icon: LineChart,
    title: 'Advanced Analytics',
    desc: 'Technical indicators, fundamental data, sentiment analysis, and sectoral breakdowns.',
  },
  {
    icon: Sparkles,
    title: 'Autonomous Agent',
    desc: 'Goal-driven agent with guardrails, risk caps, and human-in-the-loop confirmations.',
  },
]

const mcpClients = ['Claude', 'ChatGPT', 'Cursor', 'Any MCP client']

const highlights = [
  { value: 'Live', label: 'P&L streamed from Angel One' },
  { value: '0 bytes', label: 'of credentials on disk' },
  { value: 'Multi-TF', label: 'ML directional forecasts' },
  { value: 'You', label: 'approve every trade' },
]

/** Illustrative holdings for the hero preview — not real data. */
const previewHoldings = [
  { symbol: 'RELIANCE', change: 2.41 },
  { symbol: 'TCS', change: 1.18 },
  { symbol: 'HDFCBANK', change: -0.62 },
]

function SectionBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm',
        className ?? 'border-sky-500/20 bg-sky-500/5 text-sky-300',
      )}
    >
      {children}
    </div>
  )
}

/** A stylised dashboard card shown beside the hero copy. */
function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-emerald-500/20 via-sky-500/10 to-brand-500/25 blur-2xl" />

      <div className="gradient-border relative rounded-2xl p-5 shadow-2xl shadow-black/50 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-surface-200/50">Portfolio value</p>
            <p className="mt-1 font-display text-3xl font-bold text-white">₹12,48,320</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
              +₹18,904 (1.54%) today
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
            <span className="animate-pulse-glow h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        <svg viewBox="0 0 300 100" className="mt-5 h-28 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path
            d="M0 80 C20 76 30 70 45 72 S75 60 90 62 S120 48 140 52 S170 40 185 44 S215 28 235 30 S270 14 300 10 L300 100 L0 100 Z"
            fill="url(#hero-area)"
          />
          <path
            className="animate-draw-line"
            d="M0 80 C20 76 30 70 45 72 S75 60 90 62 S120 48 140 52 S170 40 185 44 S215 28 235 30 S270 14 300 10"
            fill="none"
            stroke="url(#hero-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="mt-4 space-y-2">
          {previewHoldings.map(({ symbol, change }) => {
            const up = change >= 0
            return (
              <div
                key={symbol}
                className="flex items-center justify-between rounded-xl border border-surface-800/80 bg-surface-950/60 px-3.5 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 text-[11px] font-bold text-surface-200">
                    {symbol.slice(0, 2)}
                  </span>
                  <span className="text-sm font-medium text-white">{symbol}</span>
                </div>
                <span
                  className={clsx(
                    'inline-flex items-center gap-0.5 text-sm font-semibold',
                    up ? 'text-emerald-400' : 'text-rose-400',
                  )}
                >
                  {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {up ? '+' : ''}
                  {change.toFixed(2)}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating AI insight bubble */}
      <div className="animate-float absolute -bottom-20 -left-4 hidden w-64 rounded-2xl border border-surface-700/80 bg-surface-900/95 p-4 shadow-xl shadow-black/40 backdrop-blur sm:block lg:-left-12">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500/15">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
          </span>
          <span className="text-xs font-semibold text-white">AI insight</span>
        </div>
        <p className="text-xs leading-relaxed text-surface-200/70">
          IT is now 38% of your portfolio. Consider trimming to stay within your 30% sector cap.
        </p>
      </div>

      {/* Floating ML forecast chip */}
      <div
        className="animate-float absolute -top-6 -right-3 hidden items-center gap-2 rounded-xl border border-surface-700/80 bg-surface-900/95 px-3 py-2 shadow-xl shadow-black/40 backdrop-blur sm:flex lg:-right-8"
        style={{ animationDelay: '1.5s' }}
      >
        <TrendingUp className="h-4 w-4 text-violet-400" />
        <span className="text-xs text-surface-200/80">
          5-day forecast: <span className="font-semibold text-emerald-400">Bullish</span>
        </span>
      </div>
    </div>
  )
}

const LANDING_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Agentfolio',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Agentfolio',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
}

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <PageMeta
        fullTitle
        title="Agentfolio — AI portfolio tracker for Angel One, with MCP"
        description="Track your Angel One holdings, positions and P&L in real time, get AI insights, and talk to your portfolio from Claude, ChatGPT or Cursor over MCP."
        jsonLd={LANDING_JSON_LD}
      />
      {/* Hero */}
      <section className="relative px-4 pt-16 pb-28 sm:pt-24 lg:pt-28 lg:pb-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-grid absolute inset-0" />
          <div className="animate-aurora absolute -top-48 left-1/4 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
          <div
            className="animate-aurora absolute -top-24 right-0 h-[480px] w-[480px] rounded-full bg-brand-600/15 blur-3xl"
            style={{ animationDelay: '-6s' }}
          />
          <div
            className="animate-aurora absolute top-64 left-0 h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-3xl"
            style={{ animationDelay: '-12s' }}
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-12 sm:px-2">
          <div className="text-center lg:text-left">
            <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Portfolio Intelligence + MCP
            </div>
            <h1 className="animate-slide-up font-display text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your portfolio,
              <br />
              <span className="text-shimmer">reimagined.</span>
            </h1>
            <p
              className="animate-slide-up mx-auto mt-6 max-w-xl text-lg text-surface-200/70 sm:text-xl lg:mx-0"
              style={{ animationDelay: '0.1s' }}
            >
              Track holdings, positions, and P&L in real time. Get AI-powered insights on your dashboard,
              or talk to your portfolio from Claude, ChatGPT, or Cursor using MCP.
            </p>
            <div
              className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: '0.2s' }}
            >
              <ButtonLink
                to="/login"
                size="lg"
                className="group bg-gradient-to-r from-emerald-500 via-sky-500 to-brand-500 shadow-xl shadow-sky-500/25 hover:brightness-110"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink to="/connect" variant="secondary" size="lg" className="bg-surface-900/60 backdrop-blur">
                <Zap className="h-4 w-4 text-sky-400" />
                Connect via MCP
              </ButtonLink>
            </div>

            <div
              className="animate-slide-up mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-surface-200/45 lg:justify-start"
              style={{ animationDelay: '0.3s' }}
            >
              <span className="text-xs uppercase tracking-wider text-surface-200/35">Works with</span>
              {mcpClients.map((client) => (
                <span key={client} className="font-medium text-surface-200/60">
                  {client}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* Highlights strip */}
      <section className="px-4">
        <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-2xl border border-surface-800/80 bg-surface-900/40 backdrop-blur lg:grid-cols-4">
          {highlights.map(({ value, label }, i) => (
            <div
              key={label}
              className={clsx(
                'px-6 py-7 text-center',
                i % 2 === 1 && 'border-l border-surface-800/80',
                i >= 2 && 'border-t border-surface-800/80 lg:border-t-0',
                i === 2 && 'lg:border-l',
              )}
            >
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-surface-200/50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features bento grid */}
      <section className="px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <SectionBadge>
              <Sparkles className="h-3.5 w-3.5" />
              Features
            </SectionBadge>
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">Everything you need</h2>
            <p className="mt-4 text-lg text-surface-200/60">A complete portfolio intelligence platform</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc, color, glow, span }) => (
              <div
                key={title}
                className={clsx(
                  'group relative overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-surface-700 hover:shadow-2xl hover:shadow-black/40',
                  span,
                )}
              >
                <div
                  className={clsx(
                    'pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100',
                    glow,
                  )}
                />
                <div className="relative">
                  <div className="mb-5 inline-flex rounded-xl border border-surface-700/60 bg-surface-800/60 p-3 transition-transform duration-300 group-hover:scale-110">
                    <Icon className={clsx('h-5 w-5', color)} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-surface-200/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <SectionBadge className="border-emerald-500/20 bg-emerald-500/5 text-emerald-300">
              <Rocket className="h-3.5 w-3.5" />
              How it works
            </SectionBadge>
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Up and running in <span className="text-shimmer">three steps</span>
            </h2>
          </div>
          <div className="relative grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute top-10 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-emerald-500/40 via-sky-500/40 to-brand-500/40 md:block" />
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative text-center">
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-surface-700/70 bg-surface-900 shadow-lg shadow-black/30">
                  <Icon className="h-7 w-7 text-sky-300" />
                  <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-brand-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-surface-200/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LearnTeaser />

      {/* Quote / Manifesto */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-surface-800/60 bg-gradient-to-br from-surface-900 via-surface-900/80 to-surface-950 p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
            <LogoMark className="relative mx-auto mb-8 h-14 w-14 drop-shadow-[0_0_24px_rgba(14,165,233,0.35)]" />
            <blockquote className="relative font-display text-2xl leading-snug font-semibold text-white sm:text-4xl">
              &ldquo;Make <span className="text-shimmer">money work for you</span>, not you work for money.&rdquo;
            </blockquote>
            <p className="relative mx-auto mt-6 max-w-xl text-base text-surface-200/50">
              Compound your time, not your stress. Let intelligent systems watch the markets while you live
              your life.
            </p>
          </div>
        </div>
      </section>

      <FeedbackForm />

      {/* Premium Features */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <SectionBadge className="border-amber-500/20 bg-amber-500/5 text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Premium
            </SectionBadge>
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              More than a dashboard.{' '}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                Your edge.
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface-200/60">
              Unlock the next layer — automated intelligence that researches, monitors, and acts on your behalf.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {premiumFeatures.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative rounded-2xl bg-gradient-to-b from-amber-500/30 via-surface-800 to-surface-800 p-px transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-full overflow-hidden rounded-[15px] bg-surface-900 p-7">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-500/10 to-transparent" />
                  <div className="relative">
                    <div className="mb-5 inline-flex rounded-xl bg-amber-500/10 p-3">
                      <Icon className="h-5 w-5 text-amber-300" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                    <p className="text-sm leading-relaxed text-surface-200/60">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pt-8 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/40 via-sky-500/30 to-brand-500/40 p-px">
            <div className="relative overflow-hidden rounded-[23px] bg-surface-950 px-8 py-14 text-center sm:px-16 sm:py-20">
              <div className="bg-grid pointer-events-none absolute inset-0" />
              <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-brand-500/20 blur-3xl" />
              <div className="relative">
                <LogoMark className="mx-auto mb-6 h-12 w-12" />
                <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">Ready to get started?</h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-surface-200/60">
                  Connect your Angel One account and see your portfolio come alive.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <ButtonLink
                    to="/login"
                    size="lg"
                    className="group bg-gradient-to-r from-emerald-500 via-sky-500 to-brand-500 shadow-xl shadow-sky-500/25 hover:brightness-110"
                  >
                    Login with Angel One
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </ButtonLink>
                  <ButtonLink to="/setup" variant="ghost" size="lg">
                    Read the setup guide
                  </ButtonLink>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-surface-200/50">
                  {['Encrypted credentials', 'Any MCP client', 'You approve every trade'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-400" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
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
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  {
    icon: BarChart3,
    title: 'Live Portfolio',
    desc: 'Holdings, positions, funds, and P&L streaming live from Angel One.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
  },
  {
    icon: Brain,
    title: 'AI Insights',
    desc: 'Portfolio analysis, risk cues, and Q&A powered by your choice of LLM.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Zap,
    title: 'MCP Ready',
    desc: 'Connect through Claude, ChatGPT, Cursor, or any MCP-compatible client.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Storage',
    desc: 'Credentials stay in memory only. Nothing written to disk, ever.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: TrendingUp,
    title: 'ML Predictions',
    desc: 'Multi-timeframe directional forecasts using ensemble LightGBM models.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Bot,
    title: 'Trading Agent',
    desc: 'AI agent that analyses, proposes, and executes with your approval.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
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

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-24 sm:pt-32 sm:pb-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-600/8 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/6 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-sm text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            Portfolio Intelligence + MCP
          </div>
          <h1 className="animate-slide-up font-display text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your portfolio,{' '}
            <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-brand-300 bg-clip-text text-transparent">
              reimagined
            </span>
          </h1>
          <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-surface-200/70 sm:text-xl" style={{ animationDelay: '0.1s' }}>
            Track holdings, positions, and P&L in real time. Get AI-powered
            insights on your dashboard, or connect through Claude, ChatGPT, or
            Cursor using MCP.
          </p>
          <div className="animate-slide-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.2s' }}>
            <Link to="/login">
              <Button size="lg">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Connect via MCP
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-4 text-surface-200/60 text-lg">
              A complete portfolio intelligence platform
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="group rounded-2xl border border-surface-800 bg-surface-900/40 p-6 transition-all duration-300 hover:border-surface-700 hover:bg-surface-900/70"
              >
                <div className={`mb-4 inline-flex rounded-xl ${bg} p-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-surface-200/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / Manifesto */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-surface-800/60 bg-gradient-to-b from-surface-900/80 to-surface-950 p-10 sm:p-16">
            <blockquote className="font-display text-2xl sm:text-3xl font-semibold text-white leading-snug">
              &ldquo;Make{' '}
              <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
                money work for you
              </span>
              , not you work for money.&rdquo;
            </blockquote>
            <p className="mt-6 text-surface-200/50 text-base">
              Compound your time, not your stress. Let intelligent systems watch
              the markets while you live your life.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-sm text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Premium
            </div>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              More than a dashboard.{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Your edge.
              </span>
            </h2>
            <p className="mt-4 text-surface-200/60 text-lg max-w-xl mx-auto">
              Unlock the next layer — automated intelligence that researches,
              monitors, and acts on your behalf.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {premiumFeatures.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/40 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-brand-600/3 to-transparent pointer-events-none" />
                <div className="relative">
                  <Icon className="h-6 w-6 text-brand-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-surface-200/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-brand-500/20 bg-brand-600/5 p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-3 text-surface-200/60">
              Connect your Angel One account and see your portfolio come alive.
            </p>
            <div className="mt-8">
              <Link to="/login">
                <Button size="lg">
                  Login with Angel One
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

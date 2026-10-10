// --- Session & auth ---

export interface PremiumStatus {
  registered: boolean
  whatsapp_number: string | null
}

/** `GET /api/session/bootstrap`. Anonymous is an answer, not an error. */
export type Session =
  | { authenticated: false }
  | { authenticated: true; client_id: string; premium: PremiumStatus }

export interface CountryOption {
  iso: string
  dial: string
  name: string
  /** `+91` — shown beside the name because `+1` alone is ambiguous. */
  label: string
}

/** `GET /api/auth/config` — what the login, enroll and premium forms need. */
export interface AuthConfig {
  countries: CountryOption[]
  default_dial_code: string
  min_password_chars: number
}

/** A dial-code dropdown plus the number typed beside it, as the server expects. */
export interface PhoneValue {
  dial: string
  national: string
}

export interface LoginPayload {
  country_code: string
  whatsapp_number: string
  app_password: string
}

export interface EnrollPayload {
  api_key: string
  client_id: string
  password: string
  totp_secret: string
  country_code: string
  whatsapp_number: string
  app_password: string
  app_password_confirm: string
}

// --- AI ---

/** Attached to every AI request. The server forwards them to OpenRouter and stores neither. */
export interface AiCredentials {
  api_key: string
  model: string
}

export interface FundamentalSummary {
  summary: string
  /** True when the server answered from its per-(symbol, model) cache. */
  cached: boolean
}

// --- Portfolio ---

/** A holding as `GET /api/portfolio/analytics` returns it, derived fields included. */
export interface Holding {
  symbol: string
  symboltoken: string
  qty: number
  avg_price: number
  ltp: number
  invested: number
  current: number
  pnl: number
  pnl_pct: number
}

/**
 * Portfolio totals. Each field is absent when the broker call behind it failed,
 * so the UI can show "—" instead of a misleading ₹0.
 */
export interface PortfolioSummary {
  total_invested?: number
  current_value?: number
  overall_pnl?: number
  overall_pnl_pct?: number
  /** Today's P&L across open positions. */
  day_pnl?: number
}

/** Angel One reports funds as strings, or "N/A" when unavailable. */
export interface PortfolioFunds {
  available_cash?: string | number
  net?: string | number
}

/** `GET /api/portfolio/analytics` */
export interface PortfolioResponse {
  holdings: Holding[]
  summary: PortfolioSummary
  funds: PortfolioFunds
}

/** `GET /api/portfolio/positions` row. */
export interface Position {
  symbol: string
  product: string
  net_qty: number
  buy_avg: number
  sell_avg: number
  ltp: number
  pnl: number
}

/** `GET /api/portfolio/orders` row. */
export interface Order {
  orderid: string
  symbol: string
  txn_type: string
  qty: number
  price: number
  status: string
  time: string
}

/** `GET /api/portfolio/trades` row — one fill. */
export interface Trade {
  tradeid: string
  orderid: string
  symbol: string
  txn_type: string
  qty: number
  price: number
  time: string
  exchange: string
  product: string
}

/** `GET /api/portfolio/beta` — the portfolio's top six holdings against NIFTY 50. */
export interface BenchmarkComparison {
  beta: number
  /** Mean daily excess return over what beta explains, as a fraction. */
  alpha: number
  r_squared: number
  dates: string[]
  /** Cumulative return to each date, in percent. */
  nifty_cumulative: number[]
  portfolio_cumulative: number[]
  stock_betas: Array<{ symbol: string; beta: number }>
  days_used: number
}

/** `data/sector_map.json` — trading symbol to sector, e.g. `TCS-EQ` → `IT`. */
export type SectorMap = Record<string, string>

// --- Analytics ---

export type PredictionDirection = 'up' | 'down' | 'neutral'
export type PredictionHorizon = '1day' | '1week' | '1month'

export interface HorizonPrediction {
  direction: PredictionDirection
  /** How sure the engine is of `direction`, 0–1. Not a calibrated probability for the rule-based engine. */
  confidence: number
  score: number
  probability_up?: number
  calibrated?: boolean
}

/** A feature that pushed the outlook one way, with the value it had. */
export interface PredictionSignal {
  feature: string
  value: number | null
  contribution?: number
}

/** `GET /api/portfolio/predict`. */
export interface PredictionResult {
  symbol: string
  predictions: Partial<Record<PredictionHorizon, HorizonPrediction>>
  overall_outlook: 'bullish' | 'bearish' | 'neutral'
  overall_score: number
  /** `heuristic` means no trained model is registered: a rule-based score, not ML. */
  model_type: string
  model_version: string | null
  calibrated?: boolean
  disclaimer?: string
  top_bullish_signals: PredictionSignal[]
  top_bearish_signals: PredictionSignal[]
}

// --- News ---

export interface NewsArticle {
  title: string
  description: string
  link: string
  source: string
  date: string
  sentiment?: string
}

export interface SectorNews {
  name: string
  invested: number
  news: NewsArticle[]
}

export interface SentimentResult {
  sectors: Array<SectorNews & {
    sentiment_summary?: {
      bullish: number
      bearish: number
      neutral: number
    }
  }>
  portfolio_sentiment: {
    label: string
    score: number
    bullish: number
    bearish: number
    neutral: number
    total_articles: number
  }
}

// --- Research ---

export type Verdict = 'good' | 'bad' | 'neutral' | 'excluded' | 'unknown'

export interface ScoreMetric {
  key: string
  label: string
  value: number | null
  /** The value as the server formats it for display. */
  display: string
  verdict: Verdict
  note: string
}

export interface ScorePillar {
  key: string
  label: string
  tagline: string
  /** `null` when the pillar could not be measured for this stock. */
  score: number | null
  max: number
  metrics: ScoreMetric[]
}

/** `none` accompanies an unscorable stock, where `total` is null too. */
export type ScoreConfidence = 'high' | 'medium' | 'low' | 'none'

/** The 0–100 fundamental score, computed in Python — no AI involved. */
export interface FundamentalScore {
  total: number | null
  grade: string | null
  label: string
  confidence: ScoreConfidence
  metrics_used: number
  metrics_total: number
  pillars: ScorePillar[]
  strengths: string[]
  concerns: string[]
  /** Metric keys left out because they do not apply to this kind of company. */
  excluded: string[]
  sector_profile?: string | null
  note?: string | null
}

export interface TrendPoint {
  year: string
  value: number
}

/** `GET /api/research/fundamental`. */
export interface FundamentalData {
  valuation: {
    pe_ratio: number | null
    pb_ratio: number | null
    ev_ebitda: number | null
    peg_ratio: number | null
    dividend_yield: number | null
    trailing_eps: number | null
    forward_pe: number | null
  }
  health: {
    roe: number | null
    roce: number | null
    debt_to_equity: number | null
    free_cash_flow: number | null
    profit_margin: number | null
    operating_margin: number | null
    revenue_growth: number | null
    earnings_growth: number | null
    promoter_holding: number | null
  }
  revenue_trend: TrendPoint[]
  profit_trend: TrendPoint[]
  score: FundamentalScore | null
  sector?: string | null
  industry?: string | null
}

export interface TechnicalSignal {
  name: string
  status: 'bullish' | 'bearish' | 'neutral'
  value: number | string | null
  label: string
}

/** `GET /api/research/technical`. */
export interface TechnicalData {
  symbol: string
  current_price: number
  avg_price: number | null
  indicators: {
    sma_20: number | null
    sma_50: number | null
    sma_200: number | null
    rsi: number | null
    macd: number | null
    macd_signal: number | null
    macd_histogram: number | null
    week52_high: number | null
    week52_low: number | null
    /** Percent of the way from the 52-week low to the high. */
    week52_position: number | null
    volume_ratio: number | null
  }
  signals: TechnicalSignal[]
  support_resistance: {
    pivot: number | null
    r1: number | null
    r2: number | null
    s1: number | null
    s2: number | null
  }
  chart_data: {
    dates: string[]
    /** `[open, high, low, close]` — note this is not ECharts' own candle order. */
    ohlc: Array<[number, number, number, number]>
    volume: number[]
    sma_50: (number | null)[]
    sma_200: (number | null)[]
    rsi: (number | null)[]
    macd_line: (number | null)[]
    macd_signal: (number | null)[]
    macd_histogram: (number | null)[]
  }
}

// --- Metric glossary (static/data/metric_glossary.json) ---

export interface GlossaryBand {
  max: number | null
  verdict: Verdict
  note: string
  points?: number
}

export interface GlossaryMetric {
  label: string
  full_name: string
  pillar: string
  unit: string
  weight: number
  formula: string
  plain: string
  ideal: string
  bands: GlossaryBand[]
  caveat: string
  watch_out: string
}

export interface Glossary {
  intro: Array<{ title: string; body: string }>
  pillars: Record<string, { label: string; tagline: string; body: string }>
  metrics: Record<string, GlossaryMetric>
  scoring: {
    grades: Array<{ min: number; grade: string; label: string }>
    how_it_works: string[]
    limits: string
  }
}

// --- Sectors ---

export interface SectorOverview {
  name: string
  weight: number
  invested: number
  holdings_count: number
  index_name?: string
  index_performance?: Record<string, number | null>
  holdings: Array<{ symbol: string; ltp: number; pnl_pct: number }>
  driver?: string
}

export interface MarketBreadth {
  india_vix: { current: number; change?: number }
  week52_highs: number
  week52_lows: number
  sector_heatmap: Array<{ name: string; change: number }>
  fii_dii: any[] | null
}

// --- Trading ---

/** The goals `services/risk_profile.build_profile_from_dict` accepts — note the space. */
export type InvestmentGoal = 'wealth creation' | 'income' | 'preservation' | 'speculation'
export type RiskTolerance = 'low' | 'medium' | 'high'
export type ProductType = 'DELIVERY' | 'INTRADAY'

export interface RiskProfile {
  age: number
  goal: InvestmentGoal
  horizon_years: number
  risk_tolerance: RiskTolerance
  tax_bracket: string
  max_single_order_value: number
  max_position_pct: number
  max_daily_trades: number
  allowed_products: ProductType[]
}

export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'executed' | 'failed'

export interface TradeProposal {
  proposal_id: string
  status: ProposalStatus
  summary: string
  order_params: Record<string, unknown>
  /** Epoch seconds. */
  created_at: number
  ttl_seconds: number
  order_id: string | null
  error: string | null
}

/**
 * The broker's answer to an approval. A risk or compliance block is still a
 * 200 — `ok: false` with the reason — so check `ok`, not the status code.
 */
export interface ExecutionResult {
  ok: boolean
  order_id?: string
  error?: string
}

/** `GET /api/briefing/schedule`. Removing a schedule only disables it. */
export interface BriefingSchedule {
  id: number
  enabled: boolean
  interval_minutes: number
  /** UTC ISO; its IST wall-clock time is the send time. */
  next_run: string | null
  last_run: string | null
  /** `pending` | `running` | … */
  status: string
}

export interface BriefingLog {
  id: number
  status: 'success' | 'failed' | 'running' | string
  message: string | null
  duration_ms: number | null
  created_at: string | null
}

/** One frame of `GET /api/market/stream`'s `tick` event. */
export interface MarketTick {
  symbol_token: string
  ltp: number
  volume: number | null
  ts: number
  bid: number | null
  ask: number | null
  source: 'ws' | 'poll'
}

/** A daily bar from `GET /api/portfolio/candles`: time, open, high, low, close, volume. */
export type Candle = [time: string, open: number, high: number, low: number, close: number, volume: number]

// --- Agent ---

export type AgentType = 'finance' | 'trading'

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  /** A failed send, shown inline instead of a reply. */
  error?: boolean
}

export interface ChatThread {
  id: number
  agent_type: AgentType
  title: string
  created_at: string | null
  updated_at: string | null
}

export interface ChatReply {
  reply: string
  /** Set when the message was an `APPROVE <id>` / `REJECT <id>` the server acted on. */
  approval_result?: string
  thread_id?: number
}

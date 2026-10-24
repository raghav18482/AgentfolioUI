import type { AcademyTerm, Source, TermCategory } from './types'

/** Category chips on the glossary page, in this order. */
export const TERM_CATEGORIES: TermCategory[] = [
  'Cash flow & planning',
  'Debt & protection',
  'Investing',
  'Funds',
  'Markets & risk',
]

const CHECKED = '2026-10-25'

const SEBI_MF_MASTER: Source = {
  label: 'SEBI — Master Circular for Mutual Funds (Mar 2026)',
  url: 'https://www.sebi.gov.in/sebi_data/attachdocs/mar-2026/1774024028162.pdf',
  asOf: CHECKED,
}

const RBI_PREPAYMENT: Source = {
  label: 'RBI — Reserve Bank of India (Pre-payment Charges on Loans) Directions, 2025',
  url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12878',
  asOf: CHECKED,
}

/**
 * The Academy glossary. Separate on purpose from `metric_glossary.json`, which
 * the stock scorer grades against; company ratios (P/E, ROE, …) live in the
 * metrics guide at `/learn/metrics`. Rates in examples are illustrative.
 */
export const TERMS: AcademyTerm[] = [
  // ── Cash flow & planning ──────────────────────────────────────────────────
  {
    id: 'ctc-vs-take-home',
    term: 'CTC vs take-home pay',
    aka: ['CTC', 'Cost to company', 'In-hand salary', 'Net salary'],
    category: 'Cash flow & planning',
    definition:
      'CTC (cost to company) is everything an employer spends on you in a year, including components you never receive as monthly cash — employer PF contributions, gratuity, insurance and variable pay. Take-home (in-hand) pay is what is credited to your account after TDS, your own PF contribution and professional tax where it applies. Plan on take-home pay.',
    example:
      'An ₹18 lakh CTC is ₹1.5 lakh a month on paper; the monthly credit is noticeably lower once employer contributions, variable pay and deductions come out.',
    related: ['monthly-surplus', 'savings-rate'],
  },
  {
    id: 'monthly-surplus',
    term: 'Monthly surplus',
    category: 'Cash flow & planning',
    definition:
      'Take-home pay minus fixed commitments, average variable spending and annual irregular costs spread over twelve months — the amount you can sustainably commit to reserves, debt repayment and investing.',
    example: '₹1,10,000 take-home − ₹52,000 fixed − ₹30,000 variable − ₹12,000 (annual costs ÷ 12) = ₹16,000 a month.',
    related: ['ctc-vs-take-home', 'savings-rate', 'sinking-fund'],
  },
  {
    id: 'savings-rate',
    term: 'Savings rate',
    category: 'Cash flow & planning',
    definition:
      'The share of take-home pay you do not spend, measured over a year: (take-home pay − spending) ÷ take-home pay. The progress metric you control most directly.',
    example: 'Take-home pay of ₹15 lakh and spending of ₹11.4 lakh is a savings rate of 24%.',
    related: ['monthly-surplus', 'net-worth', 'cash-flow'],
  },
  {
    id: 'cash-flow',
    term: 'Cash flow',
    category: 'Cash flow & planning',
    definition:
      'Money in and out over a period. A personal cash-flow statement shows income, fixed and variable spending, and what was left to save or invest — the movie to the balance sheet’s snapshot.',
    example: 'A quarterly review shows a January surplus that was consumed by annual insurance premiums in March.',
    related: ['net-worth', 'savings-rate'],
  },
  {
    id: 'net-worth',
    term: 'Net worth',
    aka: ['Liquid net worth', 'Balance sheet'],
    category: 'Cash flow & planning',
    definition:
      'What you own minus what you owe, at current values: bank balances, investments at market value, EPF and PPF, gold and property, minus outstanding loans. Liquid net worth counts only what you could access within days.',
    example: '₹94 lakh of assets and ₹51 lakh of outstanding loans is a net worth of ₹43 lakh.',
    related: ['cash-flow', 'savings-rate', 'liquidity'],
  },
  {
    id: 'emergency-fund',
    term: 'Emergency fund',
    category: 'Cash flow & planning',
    definition:
      'Cash held for safety and quick access to cover essential outflows if income stops or a large unplanned cost arrives. Sized in months of essential outflows — more for single earners, people with dependants and those with uneven income.',
    example: 'Essential outflows of ₹95,000 a month and an 8-month target gives an emergency fund of ₹7.6 lakh.',
    related: ['sinking-fund', 'liquid-fund', 'liquidity'],
  },
  {
    id: 'sinking-fund',
    term: 'Sinking fund',
    aka: ['Goal-based cash reserve', 'Cash reserve'],
    category: 'Cash flow & planning',
    definition:
      'Money set aside in instalments for a known, scheduled expense, kept separate from the emergency fund so each can be checked on its own.',
    example: '₹15,000 a month for 10 months towards a ₹1.5 lakh school fee.',
    related: ['emergency-fund', 'monthly-surplus'],
  },
  {
    id: 'inflation',
    term: 'Inflation',
    category: 'Cash flow & planning',
    definition:
      'The general rise in prices over time. For planning, what matters is the inflation rate of the specific expense — education and healthcare costs can rise at a different pace from general prices.',
    example: 'At an assumed 8% a year, a cost of ₹20 lakh today becomes about ₹50.4 lakh in 12 years.',
    related: ['real-return', 'compound-interest'],
  },
  {
    id: 'real-return',
    term: 'Real return',
    category: 'Cash flow & planning',
    definition:
      'Return after allowing for inflation: (1 + return) ÷ (1 + inflation) − 1, roughly return minus inflation. The figure that tells you whether purchasing power is actually growing.',
    example: 'An 8% return with 6% inflation is a real return of about 1.9%.',
    related: ['inflation', 'cagr'],
  },
  {
    id: 'compound-interest',
    term: 'Compounding',
    aka: ['Compound interest'],
    category: 'Cash flow & planning',
    definition:
      'Growth on both the original amount and the growth already earned. It is why early contributions carry so much weight in long-term goals — and why expensive debt left unpaid grows quickly.',
    example: '₹5 lakh at an assumed 10% a year is about ₹13 lakh after 10 years and about ₹33.6 lakh after 20.',
    related: ['cagr', 'real-return'],
  },

  // ── Debt & protection ─────────────────────────────────────────────────────
  {
    id: 'emi',
    term: 'EMI (Equated Monthly Instalment)',
    aka: ['Equated Monthly Instalment'],
    category: 'Debt & protection',
    definition:
      'The fixed monthly payment on a loan. Early EMIs are mostly interest; the share going to principal grows over the life of the loan.',
    example: 'A ₹40 lakh loan at an assumed 8.5% over 20 years has an EMI of about ₹34,713.',
    related: ['emi-to-income-ratio', 'loan-prepayment', 'floating-vs-fixed-rate'],
  },
  {
    id: 'emi-to-income-ratio',
    term: 'EMI-to-income ratio',
    aka: ['FOIR', 'Fixed obligations to income ratio', 'Debt-to-income'],
    category: 'Debt & protection',
    definition:
      'Total monthly EMIs as a share of income. Lenders use a version of it (often called FOIR) when deciding how much more to lend; for your own plan, measure EMIs against take-home pay and treat any rule of thumb as a ceiling.',
    example: 'EMIs of ₹42,000 on take-home pay of ₹1,20,000 is a ratio of 35%.',
    related: ['emi', 'credit-score'],
  },
  {
    id: 'loan-prepayment',
    term: 'Loan prepayment',
    aka: ['Part-prepayment', 'Foreclosure'],
    category: 'Debt & protection',
    definition:
      'Repaying part or all of a loan ahead of schedule. You can usually keep the EMI and shorten the tenure (saves more interest) or keep the tenure and lower the EMI (eases cash flow). Under RBI rules, lenders cannot charge pre-payment penalties on floating-rate loans taken by individuals for non-business purposes.',
    example:
      'Prepaying ₹5 lakh after year 3 of a ₹40 lakh, 20-year loan at an assumed 8.5%, keeping the EMI, closes it 50 months early and saves about ₹12.6 lakh of interest.',
    related: ['emi', 'floating-vs-fixed-rate'],
    sources: [RBI_PREPAYMENT],
  },
  {
    id: 'floating-vs-fixed-rate',
    term: 'Floating vs fixed rate',
    aka: ['Floating rate', 'Fixed rate'],
    category: 'Debt & protection',
    definition:
      'A floating-rate loan’s interest rate moves with the benchmark the lender links it to, so the EMI or tenure can change at each reset. A fixed-rate loan’s rate is set for an agreed period. The difference also matters for prepayment charges.',
    example: 'If the linked benchmark rises by 0.5 percentage points, a floating-rate loan typically reprices by the same amount at its next reset.',
    related: ['loan-prepayment', 'emi'],
    sources: [RBI_PREPAYMENT],
  },
  {
    id: 'credit-score',
    term: 'Credit score',
    aka: ['CIBIL score'],
    category: 'Debt & protection',
    definition:
      'A three-digit score from a credit information company, such as CIBIL, summarising repayment history and credit use. Lenders use it to decide whether to lend and at what rate. Missed EMIs, high card utilisation and many recent applications tend to lower it.',
    example: 'Paying card bills in full and on time, and keeping balances well below the limit, supports a stronger score.',
    related: ['emi-to-income-ratio', 'emi'],
  },
  {
    id: 'term-insurance',
    term: 'Term insurance',
    aka: ['Term life insurance', 'Term plan'],
    category: 'Debt & protection',
    definition:
      'Life insurance that pays a fixed sum if the insured dies during the policy term and nothing otherwise. With no savings component, it is the lowest-cost way to buy a large amount of cover.',
    example: 'Cover of about ₹2.3 crore sized to replace living costs, clear a home loan and fund a child’s education.',
    related: ['health-insurance', 'emergency-fund'],
  },
  {
    id: 'health-insurance',
    term: 'Health insurance',
    aka: ['Mediclaim', 'Family floater'],
    category: 'Debt & protection',
    definition:
      'Cover for hospitalisation and related costs up to the sum insured, subject to the policy’s terms, waiting periods and exclusions. Employer group cover usually ends when you leave the job.',
    example: 'A family floater covering two adults and two children under one shared sum insured, held alongside employer cover.',
    related: ['term-insurance', 'emergency-fund'],
  },

  // ── Investing ─────────────────────────────────────────────────────────────
  {
    id: 'equity',
    term: 'Equity',
    aka: ['Stocks', 'Shares'],
    category: 'Investing',
    definition:
      'Ownership in companies, held directly as shares or through funds. It offers higher long-term growth potential than debt, with much larger and longer falls along the way, so it suits money with a long horizon.',
    example: 'A goal portfolio holding 70% in equity funds accepts that its value can fall sharply in some years.',
    related: ['asset-allocation', 'market-capitalisation', 'drawdown'],
  },
  {
    id: 'bond',
    term: 'Bonds and G-Secs',
    aka: ['Bond', 'Debt', 'Government securities', 'G-Sec'],
    category: 'Investing',
    definition:
      'Loans to a government or company that pay interest and return the principal at maturity, provided the issuer does not default. Bonds issued by the Government of India are government securities (G-Secs). Bond prices move inversely to interest rates, so longer-maturity bonds and funds can fall when rates rise.',
    example: 'A fund holding long-maturity government bonds can lose value when interest rates rise, even with no default risk.',
    related: ['fixed-deposit', 'asset-allocation'],
  },
  {
    id: 'fixed-deposit',
    term: 'Fixed deposit (FD)',
    aka: ['FD', 'Term deposit'],
    category: 'Investing',
    definition:
      'A deposit for a fixed term at a rate agreed upfront. Predictable, but the interest is taxed as income and breaking it early usually carries a penalty.',
    example: 'Splitting a ₹6 lakh reserve across FDs maturing every few months keeps part of it accessible without breaking deposits.',
    related: ['emergency-fund', 'liquid-fund', 'bond'],
  },
  {
    id: 'dividend',
    term: 'Dividend',
    category: 'Investing',
    definition:
      'A share of a company’s profit paid to shareholders. Companies are not obliged to pay one, and the amount can change; a high past dividend is not a promise.',
    example: 'A dividend of ₹5 a share on 100 shares pays ₹500 before tax.',
    related: ['equity', 'tri-benchmark'],
  },
  {
    id: 'cagr',
    term: 'CAGR (Compound Annual Growth Rate)',
    aka: ['Compound Annual Growth Rate'],
    category: 'Investing',
    definition:
      'The steady yearly rate that takes a single investment from its starting to its ending value. It smooths out the path, so it hides volatility — and it is the wrong measure for SIPs, where money goes in at different dates.',
    example: '₹10 lakh growing to ₹20 lakh over 5 years is a CAGR of about 14.9%.',
    related: ['xirr', 'compound-interest', 'rolling-returns'],
  },
  {
    id: 'xirr',
    term: 'XIRR',
    category: 'Investing',
    definition:
      'The annualised return on cash flows made at different dates, such as SIP instalments and redemptions. Use it for SIPs; CAGR suits a single lump sum.',
    example: 'Twelve monthly SIP instalments of ₹10,000 worth ₹1.3 lakh a year after the first one have an XIRR of about 16%.',
    related: ['cagr', 'sip'],
  },
  {
    id: 'asset-allocation',
    term: 'Asset allocation',
    category: 'Investing',
    definition:
      'How a portfolio is split between asset classes — mainly equity, debt and cash, sometimes gold. It drives most of a portfolio’s risk and return, and should follow each goal’s horizon and your risk capacity.',
    example: 'A 60:40 equity–debt split for goals more than seven years away.',
    related: ['rebalancing', 'risk-capacity', 'diversification'],
  },
  {
    id: 'rebalancing',
    term: 'Rebalancing',
    category: 'Investing',
    definition:
      'Bringing a portfolio back to its target allocation after markets move it — on a calendar, or when an asset class drifts beyond a set band. It means trimming what has risen and adding to what has lagged.',
    example: 'A 60:40 target that drifts to 70:30 after an equity rally is rebalanced by moving 10% of the portfolio from equity to debt.',
    related: ['asset-allocation', 'drawdown'],
  },
  {
    id: 'diversification',
    term: 'Diversification',
    category: 'Investing',
    definition:
      'Spreading money across assets, sectors and issuers that do not move in lockstep, so one failure cannot sink the portfolio. It reduces company-specific risk; it cannot remove market-wide risk.',
    example: 'Holding a broad index fund instead of a few stocks — and not keeping a large share of net worth in your employer’s shares.',
    related: ['correlation', 'asset-allocation', 'index-fund'],
  },
  {
    id: 'correlation',
    term: 'Correlation',
    category: 'Investing',
    definition:
      'How closely two investments move together, from +1 (in lockstep) to −1 (opposite). Diversification works best across holdings with low correlation.',
    example: 'Two large-cap funds holding mostly the same stocks are highly correlated; owning both adds little diversification.',
    related: ['diversification'],
  },
  {
    id: 'risk-capacity',
    term: 'Risk capacity',
    category: 'Investing',
    definition:
      'How much loss your finances can absorb without derailing a goal, set by the goal’s horizon, your income stability, your reserves and your obligations. Distinct from risk tolerance; plan for the lower of the two.',
    example: 'A stable earner with a 20-year goal has high risk capacity for that goal even if a 30% fall would feel uncomfortable.',
    related: ['risk-tolerance', 'asset-allocation'],
  },
  {
    id: 'risk-tolerance',
    term: 'Risk tolerance',
    category: 'Investing',
    definition:
      'How much volatility you can live with without abandoning the plan — your behavioural comfort with losses, as opposed to your financial capacity for them.',
    example: 'Someone who stopped every SIP in the last market fall has a lower tolerance than their allocation assumed.',
    related: ['risk-capacity', 'drawdown', 'volatility'],
  },
  {
    id: 'lump-sum',
    term: 'Lump-sum investing',
    aka: ['Lump sum'],
    category: 'Investing',
    definition:
      'Investing a large amount at once rather than in instalments. All the money is invested immediately, but the outcome depends heavily on the market level on that one day.',
    example: 'Investing a ₹6 lakh bonus in one go, versus spreading it over 6–12 months through an STP.',
    related: ['sip', 'stp'],
  },

  {
    id: 'loss-aversion',
    term: 'Loss aversion',
    category: 'Investing',
    definition:
      'The tendency for losses to feel much more painful than equal gains feel good. In investing it shows up as selling after falls, locking in the loss, or avoiding a suitable equity allocation altogether.',
    example: 'Selling an equity fund after a 20% fall “to stop the bleeding”, then waiting for prices to recover before buying back.',
    related: ['risk-tolerance', 'recency-bias', 'drawdown'],
  },
  {
    id: 'recency-bias',
    term: 'Recency bias',
    aka: ['Return chasing', 'Performance chasing'],
    category: 'Investing',
    definition:
      'Giving recent events too much weight — assuming the latest trend will continue. It drives buying last year’s top-performing fund or category, often just as its favourable phase ends.',
    example: 'Moving SIPs into whichever sector fund topped the one-year return table.',
    related: ['loss-aversion', 'rolling-returns'],
  },

  // ── Funds ─────────────────────────────────────────────────────────────────
  {
    id: 'mutual-fund',
    term: 'Mutual fund',
    aka: ['MF', 'AMC'],
    category: 'Funds',
    definition:
      'A pooled vehicle run by an asset management company (AMC) and regulated by SEBI. You own units whose value (NAV) tracks the fund’s holdings. SEBI-defined scheme categories make like-for-like comparisons possible.',
    example: 'Comparing two flexi-cap funds with each other, rather than a flexi-cap fund with a small-cap fund.',
    related: ['nav', 'expense-ratio', 'direct-vs-regular-plan', 'index-fund'],
  },
  {
    id: 'nav',
    term: 'NAV (Net Asset Value)',
    aka: ['Net Asset Value'],
    category: 'Funds',
    definition:
      'The value of one unit of a mutual fund — assets minus liabilities, divided by units outstanding — calculated at the end of each business day.',
    example: 'A fund with a ₹20 NAV is not “cheaper” than one at ₹200; what matters is how the holdings perform.',
    related: ['mutual-fund', 'sip'],
  },
  {
    id: 'sip',
    term: 'SIP (Systematic Investment Plan)',
    aka: ['Systematic Investment Plan', 'Rupee-cost averaging'],
    category: 'Funds',
    definition:
      'A fixed amount invested in a mutual fund at regular intervals, usually monthly. It automates investing from salary and spreads purchases across market levels; it does not reduce the risk of the fund itself.',
    example: 'A ₹20,000 monthly SIP scheduled for the day after salary credit.',
    related: ['lump-sum', 'stp', 'xirr'],
  },
  {
    id: 'stp',
    term: 'STP (Systematic Transfer Plan)',
    aka: ['Systematic Transfer Plan'],
    category: 'Funds',
    definition:
      'A standing instruction to move a fixed amount at regular intervals from one scheme to another within the same fund house — commonly from a liquid or short-term debt fund into an equity fund, to deploy a lump sum gradually.',
    example: 'Parking a ₹6 lakh bonus in a liquid fund and transferring ₹50,000 a month into an equity fund for 12 months.',
    related: ['lump-sum', 'sip', 'liquid-fund'],
  },
  {
    id: 'liquid-fund',
    term: 'Liquid fund',
    category: 'Funds',
    definition:
      'A debt mutual fund that invests only in debt and money-market securities maturing within 91 days. It aims for low volatility and quick access — redemptions are usually paid the next business day — but returns are not guaranteed.',
    example: 'Holding part of an emergency fund, or a bonus waiting to be deployed through an STP.',
    related: ['emergency-fund', 'stp', 'fixed-deposit'],
    sources: [SEBI_MF_MASTER],
  },
  {
    id: 'etf',
    term: 'ETF (Exchange-Traded Fund)',
    aka: ['Exchange-Traded Fund'],
    category: 'Funds',
    definition:
      'A fund traded on a stock exchange like a share, usually tracking an index. You need a demat account, prices move through the day, and you pay brokerage and the bid–ask spread in addition to the expense ratio.',
    example: 'A Nifty 50 ETF bought through a broker during market hours.',
    related: ['index-fund', 'tracking-error', 'demat-account'],
  },
  {
    id: 'index-fund',
    term: 'Index fund',
    category: 'Funds',
    definition:
      'A mutual fund that holds the stocks of an index in the same proportions, aiming to match the index rather than beat it. Compare index funds on expense ratio and tracking error.',
    example: 'A Nifty 50 index fund bought by SIP at the fund’s end-of-day NAV, with no demat account needed.',
    related: ['etf', 'tracking-error', 'expense-ratio'],
  },
  {
    id: 'expense-ratio',
    term: 'Expense ratio',
    aka: ['TER', 'Total expense ratio'],
    category: 'Funds',
    definition:
      'The annual fee a fund charges as a percentage of assets, deducted from the NAV. Small differences compound into large amounts over long horizons.',
    example:
      '₹10 lakh for 20 years: at an assumed 10% net return it grows to about ₹67.3 lakh; if a fee 1 percentage point higher cuts that to 9%, about ₹56 lakh — a gap of roughly ₹11 lakh.',
    related: ['direct-vs-regular-plan', 'exit-load', 'tracking-error'],
  },
  {
    id: 'direct-vs-regular-plan',
    term: 'Direct vs regular plan',
    aka: ['Direct plan', 'Regular plan'],
    category: 'Funds',
    definition:
      'Every mutual fund scheme has a direct plan, bought straight from the fund house, and a regular plan, bought through a distributor. The regular plan pays the distributor’s commission from its expenses, so the same portfolio returns less.',
    example: 'If a regular plan’s expense ratio is 0.7 percentage points higher, its annual return is about 0.7 points lower than the direct plan’s.',
    related: ['expense-ratio', 'mutual-fund'],
  },
  {
    id: 'exit-load',
    term: 'Exit load',
    category: 'Funds',
    definition: 'A fee some funds charge when units are redeemed before a set period. Check it before using a fund for money you may need soon.',
    example: 'A 1% exit load within one year makes an early ₹5 lakh redemption cost ₹5,000.',
    related: ['expense-ratio', 'liquid-fund'],
  },
  {
    id: 'tri-benchmark',
    term: 'TRI (Total Return Index)',
    aka: ['Total Return Index', 'Benchmark'],
    category: 'Funds',
    definition:
      'A version of an index that assumes dividends are reinvested. SEBI requires mutual funds to benchmark scheme performance against the TRI variant, because a fund’s own returns include the dividends it receives.',
    example: 'Comparing a large-cap fund with the Nifty 50 TRI rather than the price-only index avoids flattering the fund by the dividend yield.',
    related: ['rolling-returns', 'tracking-error', 'dividend'],
    sources: [
      {
        label: 'SEBI circular — Benchmarking of scheme’s performance to Total Return Index (4 Jan 2018)',
        url: 'https://www.sebi.gov.in/legal/circulars/jan-2018/benchmarking-of-scheme-s-performance-to-total-return-index_37273.html',
        asOf: CHECKED,
      },
    ],
  },
  {
    id: 'tracking-error',
    term: 'Tracking error',
    category: 'Funds',
    definition:
      'How much an index fund’s or ETF’s returns deviate from its index over time. With the expense ratio, it is the main way to compare funds that track the same index.',
    example: 'Two Nifty 50 index funds with similar fees: the one with lower tracking error is following the index more faithfully.',
    related: ['index-fund', 'etf', 'tri-benchmark'],
  },
  {
    id: 'rolling-returns',
    term: 'Rolling returns',
    category: 'Funds',
    definition:
      'Returns measured over every window of a given length — every 3-year period across 10 years, say — rather than a single start and end date. They show consistency and how bad the worst periods were.',
    example: 'A fund whose 3-year rolling returns were negative in some windows has been less consistent than its latest 3-year figure suggests.',
    related: ['cagr', 'tri-benchmark'],
  },
  {
    id: 'riskometer',
    term: 'Riskometer',
    aka: ['Risk-o-meter'],
    category: 'Funds',
    definition:
      'A SEBI-mandated label showing a mutual fund scheme’s risk on six levels: Low, Low to Moderate, Moderate, Moderately High, High and Very High. It describes the portfolio’s risk, not whether the fund suits you.',
    example: 'Most equity funds sit at Very High; a liquid fund typically sits near the low end.',
    related: ['mutual-fund', 'volatility', 'drawdown'],
    sources: [
      {
        label: 'SEBI circular — Disclosure of expenses, half-yearly returns, yield and risk-o-meter of mutual fund schemes (Nov 2024)',
        url: 'https://www.sebi.gov.in/legal/circulars/nov-2024/disclosure-of-expenses-half-yearly-returns-yield-and-risk-o-meter-of-schemes-of-mutual-funds_88230.html',
        asOf: CHECKED,
      },
    ],
  },
  {
    id: 'portfolio-overlap',
    term: 'Portfolio overlap',
    aka: ['Fund overlap'],
    category: 'Funds',
    definition:
      'The share of holdings two funds have in common. High overlap means a second fund adds cost and complexity without adding diversification.',
    example: 'Two large-cap funds whose top holdings are largely the same companies behave almost like one fund.',
    related: ['diversification', 'correlation', 'mutual-fund'],
  },
  {
    id: 'sif',
    term: 'SIF (Specialized Investment Fund)',
    aka: ['Specialized Investment Fund', 'Specialised Investment Fund'],
    category: 'Funds',
    isNew: true,
    definition:
      'A newer product category offered by mutual fund companies (AMCs) under SEBI rules, sitting between regular mutual funds and Portfolio Management Services (PMS). It can use more advanced strategies — including limited unhedged short positions through derivatives — and so carries relatively higher risk. The minimum investment is ₹10 lakh, counted at the PAN level across all of a SIF’s investment strategies; accredited investors are exempt from this minimum.',
    example:
      'Equity-oriented SIF strategies may offer daily redemptions; debt-oriented ones can allow redemption at most once a week, and hybrid ones at most twice a week. Unlike PMS, you own units of a pooled strategy, not an individually managed portfolio.',
    related: ['mutual-fund', 'derivatives'],
    sources: [
      {
        label: 'SEBI — FAQs for Specialized Investment Funds, Part A (for investors)',
        url: 'https://www.sebi.gov.in/sebi_data/faqfiles/sep-2026/1790074512985.pdf',
        asOf: CHECKED,
      },
      {
        label: 'SEBI circular — Regulatory framework for Specialized Investment Funds (27 Feb 2025)',
        url: 'https://www.sebi.gov.in/legal/circulars/feb-2025/regulatory-framework-for-specialized-investment-funds-sif-_92299.html',
        asOf: CHECKED,
      },
    ],
  },

  // ── Markets & risk ────────────────────────────────────────────────────────
  {
    id: 'market-capitalisation',
    term: 'Market capitalisation',
    aka: ['Market cap', 'Large-cap', 'Mid-cap', 'Small-cap'],
    category: 'Markets & risk',
    definition:
      'Share price × number of shares. Under SEBI’s mutual fund categories, the 100 largest listed companies by market cap are large-caps, the next 150 are mid-caps, and the rest are small-caps.',
    example: 'A company with 10 crore shares at ₹500 each has a market cap of ₹5,000 crore.',
    related: ['equity', 'index-fund'],
  },
  {
    id: 'demat-account',
    term: 'Demat account',
    category: 'Markets & risk',
    definition:
      'An account holding shares, ETFs and other securities electronically, with a depository (NSDL or CDSL) through a depository participant such as your broker.',
    example: 'Shares and ETFs bought through a broker are credited to your demat account.',
    related: ['etf', 'equity'],
  },
  {
    id: 'liquidity',
    term: 'Liquidity',
    category: 'Markets & risk',
    definition: 'How quickly something can be turned into cash at a fair value. Reserves need it; long-term investments can trade some of it for return.',
    example: 'A liquid fund can usually be redeemed by the next business day; a flat can take months to sell at a fair price.',
    related: ['emergency-fund', 'net-worth', 'liquid-fund'],
  },
  {
    id: 'volatility',
    term: 'Volatility',
    category: 'Markets & risk',
    definition: 'How much and how quickly an investment’s value swings. Higher volatility means wider outcomes in both directions over short periods.',
    example: 'A small-cap fund typically swings more than a large-cap fund over the same months.',
    related: ['drawdown', 'risk-tolerance'],
  },
  {
    id: 'drawdown',
    term: 'Drawdown',
    aka: ['Maximum drawdown'],
    category: 'Markets & risk',
    definition:
      'A fall from a previous peak to a later low, as a percentage. The largest over a period is the maximum drawdown. Recovery needs a bigger gain than the fall: a 50% drawdown needs a 100% rise to get back to the peak.',
    example: 'A portfolio that grows to ₹1.2 crore and then falls to ₹90 lakh has had a 25% drawdown; it needs a 33% gain to recover.',
    related: ['volatility', 'risk-tolerance', 'rebalancing'],
  },
  {
    id: 'derivatives',
    term: 'Derivatives',
    aka: ['F&O', 'Futures', 'Options'],
    category: 'Markets & risk',
    definition:
      'Contracts whose value derives from something else — a share, an index, a commodity. Futures and options (F&O) are the most common. Many derivative trades use leverage, so losses can be large compared with the money put in, and for some positions larger than it. A SEBI study found that 93% of individual traders in equity F&O made losses between FY22 and FY24.',
    example: 'A small move in the Nifty 50 can mean a large gain or loss on the margin put up for a Nifty futures contract.',
    related: ['volatility', 'sif'],
    sources: [
      {
        label: 'SEBI press release — 93% of individual traders incurred losses in equity F&O, FY22–FY24 (23 Sep 2024)',
        url: 'https://www.sebi.gov.in/media-and-notifications/press-releases/sep-2024/updated-sebi-study-reveals-93-of-individual-traders-incurred-losses-in-equity-fando-between-fy22-and-fy24-aggregate-losses-exceed-1-8-lakh-crores-over-three-years_86906.html',
        asOf: CHECKED,
      },
    ],
  },
]

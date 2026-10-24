import type { Lesson, Source } from './types'

const CHECKED = '2026-10-25'

const SEBI_TRI: Source = {
  label: 'SEBI circular — Benchmarking of scheme’s performance to Total Return Index (4 Jan 2018)',
  url: 'https://www.sebi.gov.in/legal/circulars/jan-2018/benchmarking-of-scheme-s-performance-to-total-return-index_37273.html',
  asOf: CHECKED,
}

/** Making Investment Decisions, in reading order. Price paths in examples are made up. */
export const INVESTING_LESSONS: Lesson[] = [
  {
    slug: 'equity-debt-and-investment-vehicles',
    pathId: 'investing-decisions',
    title: 'Equity, debt and the vehicles that hold them',
    summary: 'Compare direct stocks, active funds, index funds, ETFs, FDs, debt funds and G-Secs — and give each a role.',
    level: 'intermediate',
    minutes: 8,
    objective:
      'Compare the main ways to hold equity and debt on risk, liquidity, cost and effort, and choose a sensible default for each role in your portfolio.',
    explanation: [
      'Most portfolios are built from two asset classes. **Equity** is ownership: higher long-term growth potential, with deep and sometimes long falls. **Debt** is lending: lower expected return and steadier value, with risks from interest-rate moves and from borrowers failing to repay. The asset class sets the risk; the **vehicle** you hold it through sets the cost, the convenience and how much of the work falls on you.',
      '**Direct stocks** give full control and no fund fees, but you carry the research, the concentration risk and the behaviour risk. A handful of stocks is not a diversified equity portfolio.',
      '**Actively managed funds** pay a manager to try to beat a benchmark. You pay a higher expense ratio for that attempt, and many funds do not beat their benchmark consistently after costs — which is why judging them against the right benchmark matters.',
      '**Index funds and ETFs** hold an index at low cost and aim only to match it. Index funds are bought from the fund house at the end-of-day NAV, need no demat account and suit SIPs. ETFs trade on the exchange through the day, need a demat account, and add brokerage and the bid–ask spread to the expense ratio.',
      'On the debt side, **FDs** offer a fixed rate and simplicity, with interest taxed as income. **Debt funds** hold bonds and money-market instruments; their value moves with interest rates and the credit quality of what they own, and returns are not guaranteed. **Government securities (G-Secs)** carry no default risk from the government, and individuals can buy them directly through RBI Retail Direct — but their market price still moves with interest rates before maturity.',
      'A practical default for many earners: core equity through low-cost index or diversified funds; debt through FDs and debt funds matched to each goal’s timing; and direct stocks, if any, as a deliberate and capped satellite rather than the core.',
    ],
    example: {
      title: "Neha's ₹40,000 a month (illustrative)",
      body: '- **Retirement, 20 years away — ₹25,000 a month:** SIPs into a Nifty 50 index fund and a diversified flexi-cap fund. Low cost, low effort, broad exposure.\n- **Home renovation in 3 years — ₹10,000 a month:** a recurring deposit and a short-duration debt fund. Stability matters more than growth over three years.\n- **Direct stocks — ₹5,000 a month:** a few companies she follows closely, capped at 10% of her equity. Enough to learn from; not enough to derail the plan.',
    },
    misconception: {
      myth: 'Picking my own stocks is cheaper than funds, so it must be better.',
      reality:
        'Direct stocks avoid an expense ratio but concentrate risk and demand time and discipline. For most earners the larger costs are under-diversification and behaviour mistakes, not a modest annual fee.',
    },
    quiz: [
      {
        prompt: 'Which of these needs a demat account?',
        options: ['An index fund bought from the fund house', 'An ETF', 'A fixed deposit', 'A debt mutual fund'],
        correctIndex: 1,
        explanation: 'ETFs trade on the exchange like shares, so they are held in a demat account.',
      },
      {
        prompt: 'What are you mainly paying for in an actively managed fund?',
        options: ['Guaranteed returns', 'A manager’s attempt to beat the benchmark', 'Protection from losses', 'Lower taxes'],
        correctIndex: 1,
        explanation: 'The higher expense ratio pays for active management — which may or may not beat the benchmark after costs.',
      },
      {
        prompt: 'Why can a fund holding government securities lose value even though the government will not default?',
        options: ['Bond prices fall when interest rates rise', 'The government can skip interest payments', 'G-Secs are a kind of equity', 'It cannot lose value'],
        correctIndex: 0,
        explanation: 'Existing bonds become less valuable when new ones pay higher rates; longer maturities are hit harder.',
      },
      {
        prompt: 'Which is a sensible role for direct stocks in an earner’s portfolio?',
        options: ['The whole equity allocation', 'A capped satellite alongside a diversified core', 'The emergency fund', 'Money for short-term goals'],
        correctIndex: 1,
        explanation: 'A cap keeps concentration risk and behaviour risk from deciding the outcome of the whole plan.',
      },
    ],
    takeaways: [
      'The asset class sets the risk; the vehicle sets cost, convenience and effort.',
      'Index funds and ETFs make a low-cost core; ETFs need a demat account and trade during the day.',
      'Debt carries interest-rate and credit risk — FDs, debt funds and G-Secs differ in how.',
    ],
    relatedLessons: ['risk-capacity-and-asset-allocation', 'evaluating-a-fund', 'drawdowns-and-diversification'],
    relatedTerms: ['equity', 'bond', 'fixed-deposit', 'mutual-fund', 'index-fund', 'etf', 'demat-account'],
    sources: [
      {
        label: 'RBI — Retail Direct Scheme FAQs',
        url: 'https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3337',
        asOf: CHECKED,
      },
    ],
  },
  {
    slug: 'risk-capacity-and-asset-allocation',
    pathId: 'investing-decisions',
    title: 'Risk capacity, risk tolerance and asset allocation',
    summary: 'Set an allocation by goal, check it against what you can actually sit through, and keep it there.',
    level: 'intermediate',
    minutes: 8,
    objective:
      'Set an equity–debt allocation for each goal from its horizon and your capacity for loss, check it against your tolerance, and keep it on track with a rebalancing rule.',
    explanation: [
      '**Risk capacity** is financial: how large a fall a goal can absorb without failing, given its horizon, your income stability, your reserves and your obligations. **Risk tolerance** is behavioural: how large a fall you can sit through without selling. Plan for the lower of the two — a portfolio abandoned in a downturn delivers the worst of both.',
      'Allocate **by goal**, not by age alone. Money for a goal two years away has little capacity for equity risk at any age; money for retirement 25 years away has a lot. Rules such as “100 minus your age in equity” ignore goals, income and reserves, so treat them as a sanity check at most.',
      'Test tolerance in rupees, not percentages. A 30% fall on a ₹20 lakh portfolio is ₹6 lakh — perhaps several months of take-home pay. If watching that would push you to sell, choose a lower equity share now rather than discover it in the next downturn.',
      'Your overall allocation is the sum of your goal buckets. Write it down — for example 60% equity, 40% debt — with a band around it.',
      '**Rebalance** when an asset class drifts beyond its band (say ±5 percentage points) or once a year. It keeps risk where you set it, and makes you trim what has risen and add to what has fallen. Direct new SIP money to the underweight side first; selling to rebalance can trigger tax and exit loads, so check those before acting.',
    ],
    example: {
      title: "Priya's goal buckets (illustrative)",
      body: 'Priya, 35, has a stable salaried job and her emergency fund in place.\n\n- **Home down payment in 4 years** — ₹6 lakh so far, held 25% equity / 75% debt\n- **Child’s education in 13 years** — ₹5 lakh so far, 70% equity / 30% debt\n- **Retirement in 23 years** — ₹9 lakh so far, 80% equity / 20% debt\n\nTogether that is ₹12.2 lakh of equity in ₹20 lakh — an overall **61% equity / 39% debt**. With a ±5-point band she rebalances if equity rises above 66% or falls below 56%, using new SIP money first.',
    },
    misconception: {
      myth: 'For a long horizon, more equity is always better.',
      reality:
        'Only if you hold on through the falls. An allocation that looks right on paper but is abandoned in a downturn can end up worse than a more conservative one held steadily.',
    },
    quiz: [
      {
        prompt: 'Risk capacity depends mainly on:',
        options: ['How you feel about losses', 'The goal’s horizon, income stability, reserves and obligations', 'Last year’s market returns', 'Your CTC alone'],
        correctIndex: 1,
        explanation: 'Capacity is about what your finances can absorb; how you feel about it is tolerance.',
      },
      {
        prompt: 'Your capacity allows 80% equity, but you know you would sell after a 20% fall. What should you do?',
        options: ['Hold 80% and hope', 'Plan for a lower equity share you can hold through a fall', 'Move everything into equity', 'Ignore tolerance — capacity is what counts'],
        correctIndex: 1,
        explanation: 'Plan for the lower of capacity and tolerance; selling at the bottom is the costliest outcome.',
      },
      {
        prompt: 'Your target is 60% equity with a ±5-point band. After a rally, equity is 68%. What does your rule say?',
        options: ['Do nothing', 'Rebalance back towards 60%', 'Add more equity', 'Stop all SIPs permanently'],
        correctIndex: 1,
        explanation: '68% is outside the 55–65% band, so the rule triggers a rebalance.',
      },
      {
        prompt: 'What is usually the lowest-cost way to correct a small drift?',
        options: ['Sell and rebuy everything', 'Send new SIP money to the underweight asset', 'Borrow to buy the underweight asset', 'Wait for markets to fix it'],
        correctIndex: 1,
        explanation: 'Redirecting new money avoids selling, and with it any tax or exit load.',
      },
    ],
    takeaways: [
      'Plan for the lower of risk capacity and risk tolerance.',
      'Allocate by goal horizon; age-based rules are only a sanity check.',
      'Write down a target with a band, and rebalance by rule — new money first.',
    ],
    relatedLessons: ['equity-debt-and-investment-vehicles', 'drawdowns-and-diversification', 'investor-behaviour'],
    relatedTerms: ['risk-capacity', 'risk-tolerance', 'asset-allocation', 'rebalancing', 'exit-load'],
  },
  {
    slug: 'sip-vs-lump-sum',
    pathId: 'investing-decisions',
    title: 'SIP vs lump sum: deploying a windfall',
    summary: 'Invest a bonus at once or stagger it through an STP — what each trades away.',
    level: 'intermediate',
    minutes: 7,
    objective:
      'Decide how to invest a bonus or other lump sum — at once, or staggered through an STP — by weighing expected return against the risk of a fall soon after investing.',
    explanation: [
      'A monthly SIP from salary is not really a choice: you invest money as you earn it. The real decision comes with a **lump sum** — a bonus, maturity proceeds, an inheritance.',
      'If the money belongs to a long-horizon goal and the equity share fits your allocation, investing it **at once** puts all of it to work immediately. Because equity is expected to rise over time, investing earlier has the higher expected outcome on average — but the result depends heavily on what happens in the months right after you invest.',
      '**Staggering** — parking the money in a liquid fund and moving a fixed amount into equity each month through a **Systematic Transfer Plan (STP)** — gives up some expected return in exchange for less regret if markets fall soon after. It is a risk-management choice, not a return-maximising one.',
      'Size matters. A bonus that is small next to your existing investments can usually go in at once. One that would double your equity exposure overnight is where staggering over 6–12 months earns its keep — especially if a sharp early fall would make you abandon the plan.',
      'Two things do not change: money for short-term goals stays out of equity whichever method you use, and an STP runs on a fixed schedule decided upfront. “Waiting for a dip” is market timing under another name.',
    ],
    example: {
      title: 'A ₹6 lakh bonus on two made-up price paths',
      body: 'Invested at once at a price of 100, or ₹1 lakh a month for six months through an STP. Values after six months, ignoring the small return on money waiting in the liquid fund:\n\n- **Path A — a steady rise to 112:** at once **₹6.72 lakh**; STP **₹6.41 lakh**. Investing at once wins: every rupee was in the market for the whole rise.\n- **Path B — a fall to 82, then back to 100:** at once **₹6.00 lakh**; STP **₹6.62 lakh**. Staggering wins: later instalments bought units cheaply.\n\nNeither path is knowable in advance. The choice is about which regret you can live with.',
    },
    misconception: {
      myth: 'Staggering into the market always gets a better average price.',
      reality:
        'It gets a better result only when prices fall during the staggering period. When they rise, investing at once finishes ahead. Staggering reduces regret; it does not reliably improve returns.',
    },
    quiz: [
      {
        prompt: 'Prices rise steadily during a 6-month STP. Compared with investing at once, the STP typically ends:',
        options: ['Higher', 'Lower', 'Exactly the same', 'Impossible to say, even in hindsight'],
        correctIndex: 1,
        explanation: 'Later instalments buy at higher prices, so less of the money benefits from the full rise.',
      },
      {
        prompt: 'What does an STP mainly offer?',
        options: ['A guaranteed better price', 'Less regret if markets fall soon after investing', 'Tax-free returns', 'A higher expected return'],
        correctIndex: 1,
        explanation: 'It spreads the entry risk; it does not raise the expected return.',
      },
      {
        prompt: 'Which plan is market timing in disguise?',
        options: ['Investing at once', 'A 12-month STP on a fixed schedule', 'Holding the money until “the dip comes”', 'A monthly SIP from salary'],
        correctIndex: 2,
        explanation: 'There is no rule for when the dip has come, so the money can sit uninvested indefinitely.',
      },
      {
        prompt: 'A ₹1 lakh bonus arrives. Your equity portfolio is ₹40 lakh and the goal is 15 years away. What is usually reasonable?',
        options: ['Stagger it over 24 months', 'Invest it at once in line with your allocation', 'Hold it in savings until markets fall', 'Put it all into a single stock'],
        correctIndex: 1,
        explanation: 'At 2.5% of the portfolio, entry timing barely changes the outcome — staggering adds effort for little benefit.',
      },
    ],
    takeaways: [
      'Investing at once has the higher expected outcome; staggering trades some of it for less regret.',
      'Stagger when the sum is large relative to your portfolio or an early fall would shake you out.',
      'Fix the STP schedule upfront — never “wait for the dip”.',
    ],
    relatedLessons: ['risk-capacity-and-asset-allocation', 'investor-behaviour', 'evaluating-a-fund'],
    relatedTerms: ['sip', 'lump-sum', 'stp', 'liquid-fund', 'xirr'],
    calculators: ['sip'],
  },
  {
    slug: 'evaluating-a-fund',
    pathId: 'investing-decisions',
    title: 'Evaluating a fund: benchmarks, costs and track record',
    summary: 'Judge a fund on its benchmark, costs, consistency and risk — not on last year’s return.',
    level: 'intermediate',
    minutes: 9,
    objective:
      'Judge a mutual fund on the evidence that matters — performance against the right benchmark and peers, costs, consistency and risk — rather than recent returns or ratings.',
    explanation: [
      'Start with the **category**. SEBI defines mutual fund scheme categories, so compare a fund with its own category peers — a small-cap fund’s returns say nothing about a large-cap fund.',
      'Compare against the benchmark’s **Total Return Index (TRI)**, which includes reinvested dividends. SEBI requires funds to show performance against the TRI variant, so the factsheet comparison should already be like-for-like — check that it is.',
      'Use **rolling returns** rather than one trailing figure. A 3- or 5-year return depends heavily on its start and end dates; rolling returns across many windows show how often a fund beat its benchmark and how weak its bad periods were.',
      '**Costs compound.** Compare expense ratios within the category, and use the **direct plan** unless you want a distributor’s service — the regular plan of the same fund pays commission from its expenses and returns less. Check the exit load if you may need the money early. For index funds and ETFs, compare **tracking error** as well as cost: you are paying for faithful replication and nothing more.',
      'Check **risk**, not just return: the scheme’s **riskometer** — six levels from Low to Very High under SEBI’s disclosure rules — its worst drawdowns, and whether the portfolio matches its stated style. Then check **overlap**: two funds holding mostly the same stocks add cost and complexity without adding diversification.',
      'Past performance does not predict future returns. A sound process — right category, honest benchmark comparison, low cost, a consistent record — improves the odds; it cannot guarantee the outcome.',
    ],
    example: {
      title: 'Two large-cap funds (made-up figures)',
      body: '- **Fund A (direct plan)** — expense ratio 0.9%. Beat the Nifty 100 TRI in 70% of 3-year rolling windows over 10 years; its worst window trailed the benchmark by 2 percentage points a year.\n- **Fund B (direct plan)** — expense ratio 1.6%. Top of the category on 1-year return, but beat the Nifty 100 TRI in only 35% of 3-year rolling windows.\n\nFund B leads this year’s return tables. Fund A has the stronger evidence: lower cost and a consistent record against the right benchmark.',
    },
    misconception: {
      myth: 'Last year’s best-performing fund is the best one to buy now.',
      reality:
        'Last year’s leaders often reflect a style or sector that happened to be in favour. Rank funds on cost, consistency against the TRI benchmark and risk — not on a single recent period.',
    },
    quiz: [
      {
        prompt: 'Why compare a fund with its benchmark’s TRI rather than the price-only index?',
        options: [
          'The TRI includes reinvested dividends, as the fund’s own returns do',
          'The TRI is always lower',
          'Price indices are not published',
          'It makes no difference',
        ],
        correctIndex: 0,
        explanation: 'Comparing against the price index would flatter the fund by the dividend yield.',
      },
      {
        prompt: 'Same fund, same portfolio. Which plan returns more?',
        options: ['The regular plan', 'The direct plan', 'They are identical', 'It depends on the NAV'],
        correctIndex: 1,
        explanation: 'The regular plan’s higher expense ratio, which funds the distributor’s commission, comes out of returns.',
      },
      {
        prompt: 'What do rolling returns show that a single 5-year return does not?',
        options: ['Future returns', 'How consistently the fund performed across many periods', 'The fund manager’s fees', 'Tax payable'],
        correctIndex: 1,
        explanation: 'One window can be flattered by a good start or end date; many windows show the pattern.',
      },
      {
        prompt: 'For two index funds tracking the same index, what should you compare?',
        options: ['Last year’s return and NAV level', 'Expense ratio and tracking error', 'Star ratings only', 'The number of stocks held'],
        correctIndex: 1,
        explanation: 'Both hold the same index; cost and how faithfully they follow it are what differ.',
      },
    ],
    takeaways: [
      'Compare within the category and against the TRI benchmark.',
      'Prefer evidence of consistency (rolling returns) and low cost over one strong year.',
      'Check the riskometer, drawdowns and overlap — risk is part of the evaluation.',
    ],
    relatedLessons: ['equity-debt-and-investment-vehicles', 'sip-vs-lump-sum', 'drawdowns-and-diversification'],
    relatedTerms: ['tri-benchmark', 'rolling-returns', 'expense-ratio', 'direct-vs-regular-plan', 'tracking-error', 'riskometer', 'portfolio-overlap'],
    sources: [
      {
        label: 'SEBI circular — Categorization and Rationalization of Mutual Fund Schemes (6 Oct 2017)',
        url: 'https://www.sebi.gov.in/legal/circulars/oct-2017/categorization-and-rationalization-of-mutual-fund-schemes_36199.html',
        asOf: CHECKED,
      },
      SEBI_TRI,
      {
        label: 'SEBI circular — Disclosure of expenses, half-yearly returns, yield and risk-o-meter of mutual fund schemes (Nov 2024)',
        url: 'https://www.sebi.gov.in/legal/circulars/nov-2024/disclosure-of-expenses-half-yearly-returns-yield-and-risk-o-meter-of-schemes-of-mutual-funds_88230.html',
        asOf: CHECKED,
      },
    ],
  },
  {
    slug: 'drawdowns-and-diversification',
    pathId: 'investing-decisions',
    title: 'Drawdowns and diversification',
    summary: 'Why losses cost more than equal gains repay, and how allocation and diversification limit the damage.',
    level: 'intermediate',
    minutes: 8,
    objective:
      'Understand why losses hurt more than equal gains help, plan for deep drawdowns as normal events, and use diversification and allocation to limit them — including concentration outside your portfolio.',
    explanation: [
      'A **drawdown** is a fall from a peak. The maths is asymmetric: a 20% fall needs a 25% gain to recover, a 50% fall needs 100%. Large losses do not just hurt — they cost years of compounding.',
      'Equity markets have had deep drawdowns, and recoveries have sometimes taken years. Treat them as normal events rather than surprises: an equity-heavy portfolio should be expected to fall sharply at some point while you hold it.',
      '**Diversification** limits how much any single company, sector or issuer can hurt you. It works when holdings do not move in lockstep — low **correlation**. Five large-cap funds holding the same stocks are not diversified; equity and high-quality debt usually are, because they often respond differently to the same shock.',
      'Diversification does not remove market-wide risk: in a broad sell-off most equities fall together. That is the job of **asset allocation** — the debt share sets how deep the overall drawdown can go.',
      'Look for concentration outside the portfolio too. Stock options or shares in your employer tie your investments to the company that pays your salary; a large share of net worth in one property or one stock carries the same kind of risk. Keep any single stock, including your employer’s, to a small slice of net worth.',
      '**Rebalancing** after a fall — moving money from debt back into equity — restores your allocation and buys at lower prices, which helps recovery. It is emotionally hard, which is why it works better as a rule set in advance.',
    ],
    example: {
      title: 'How allocation limits the damage (illustrative)',
      body: 'Suppose equity falls **40%** while high-quality debt gains **5%** over the same period.\n\n- **100% equity:** the portfolio falls 40% and needs a **66.7%** gain to recover.\n- **60:40 equity–debt:** 0.6 × (−40%) + 0.4 × (+5%) = **−22%**, needing about a **28%** gain to recover.\n\nThe 60:40 portfolio gives up some long-run growth, but its shallower drawdown is far easier to hold through — which is the real test.',
    },
    visual: 'drawdown-recovery',
    misconception: {
      myth: 'Owning many funds means I am diversified.',
      reality:
        'Diversification depends on what the funds hold, not how many there are. Several funds with overlapping portfolios add cost and complexity while keeping the same concentrated bets.',
    },
    quiz: [
      {
        prompt: 'A portfolio falls 50%. What gain does it need to get back to its peak?',
        options: ['50%', '75%', '100%', '150%'],
        correctIndex: 2,
        explanation: 'Halving ₹10 lakh leaves ₹5 lakh, which must double to get back to ₹10 lakh.',
      },
      {
        prompt: 'Equity falls 30% and debt is flat. How much does a 50:50 portfolio fall?',
        options: ['30%', '15%', '25%', '5%'],
        correctIndex: 1,
        explanation: '0.5 × (−30%) + 0.5 × 0% = −15%.',
      },
      {
        prompt: 'Which adds the most real diversification to a portfolio of equity funds?',
        options: ['A fifth large-cap fund', 'High-quality debt', 'More shares of your employer', 'A fund in a sector you already hold'],
        correctIndex: 1,
        explanation: 'Debt responds differently from equity; the other options add more of the same exposure.',
      },
      {
        prompt: 'What does diversification not remove?',
        options: ['Company-specific risk', 'Market-wide risk in a broad sell-off', 'Sector concentration', 'Single-stock risk'],
        correctIndex: 1,
        explanation: 'When most equities fall together, only allocation to other assets limits the damage.',
      },
    ],
    takeaways: [
      'Losses compound against you: a 50% fall needs a 100% gain.',
      'Diversify across holdings that do not move together; allocation limits market-wide drawdowns.',
      'Watch concentration in your employer’s stock and single assets, and rebalance by rule after falls.',
    ],
    relatedLessons: ['risk-capacity-and-asset-allocation', 'investor-behaviour', 'equity-debt-and-investment-vehicles'],
    relatedTerms: ['drawdown', 'diversification', 'correlation', 'rebalancing', 'volatility', 'asset-allocation'],
  },
  {
    slug: 'investor-behaviour',
    pathId: 'investing-decisions',
    title: 'Investor behaviour: closing the gap between plan and outcome',
    summary: 'The habits that most often derail a sound plan, and the rules that prevent them.',
    level: 'intermediate',
    minutes: 8,
    objective:
      'Recognise the behaviour patterns that most often derail a sound plan — chasing returns, loss aversion, stopping SIPs in a fall, overconfidence — and set rules in advance that make the right action the default.',
    explanation: [
      'A fund’s return and its investors’ returns can differ widely, because investors add and withdraw money at the wrong times. That gap comes from behaviour, not from the fund.',
      '**Recency bias and return-chasing:** buying whatever did best recently, often just as its favourable phase ends. Last year’s top category is not a forecast.',
      '**Loss aversion:** losses tend to feel much more painful than equal gains feel good, which pushes people to sell after falls and lock in the loss.',
      '**Stopping SIPs in a downturn** feels prudent, but it means buying fewer units exactly when they are cheapest — the opposite of what a SIP is for.',
      '**Overconfidence and over-activity:** frequent switching, trading on tips, or concentrating in a few “sure” stocks adds costs and taxes and tends to lower returns. **Herding** — investing in what colleagues or social media are discussing — often means arriving after much of the move.',
      'The remedy is structure, decided while calm: a written plan with goals, target allocation and rebalancing bands; SIPs automated for salary day; reviews once or twice a year rather than daily; and a short list of reasons that justify changing the plan — a change in goals, income or horizon. Market moves alone are not on that list.',
    ],
    example: {
      title: 'Pausing a SIP in a fall (made-up price path)',
      body: 'Two investors each run a **₹20,000** monthly SIP in the same fund for three years. The fund’s price falls 30% over the first year, returns to its starting level by the end of the second, and ends the third year 15% higher.\n\n- **Investor A keeps going:** invests ₹7.2 lakh; worth about **₹9.15 lakh** — a gain of **27%**.\n- **Investor B pauses** for twelve months once the fund is 15% down, restarting a year later at the same price: invests ₹4.8 lakh; worth about **₹5.58 lakh** — a gain of **16%**.\n\nB did not avoid the fall — B skipped the cheapest units.',
    },
    visual: 'sip-pause',
    misconception: {
      myth: 'Pausing my SIP during a fall protects my money.',
      reality:
        'Money already invested stays exposed either way; pausing only stops new purchases at lower prices. If a fall makes the SIP unaffordable, that is an emergency-fund question, not a market-timing one.',
    },
    quiz: [
      {
        prompt: 'Your fund is down 20% and the goal is 12 years away. What does pausing the SIP mainly do?',
        options: ['Protects the money already invested', 'Stops you buying units at lower prices', 'Guarantees a better return', 'Reduces the fund’s risk'],
        correctIndex: 1,
        explanation: 'The invested money is unaffected; only the cheaper purchases are lost.',
      },
      {
        prompt: 'Which is an example of recency bias?',
        options: ['Rebalancing once a year', 'Switching into last year’s best-performing category', 'Keeping SIPs automated', 'Writing down your goals'],
        correctIndex: 1,
        explanation: 'It treats the most recent period as if it predicted the next one.',
      },
      {
        prompt: 'Which is a sound reason to change your investment plan?',
        options: ['The market fell 10% this month', 'A colleague’s stock tip', 'A change in your goals, income or time horizon', 'A news headline'],
        correctIndex: 2,
        explanation: 'Plans should change when your circumstances do, not when markets move.',
      },
      {
        prompt: 'Why automate SIPs and review only periodically?',
        options: [
          'To make the planned action the default and reduce emotional decisions',
          'Automation guarantees returns',
          'Reviewing more often is not allowed',
          'It avoids tax',
        ],
        correctIndex: 0,
        explanation: 'Fewer decision points mean fewer chances for bias to override the plan.',
      },
    ],
    takeaways: [
      'Behaviour, not fund choice, often decides investors’ returns.',
      'Keep SIPs running through falls; pausing skips the cheapest units.',
      'Write the plan down, automate it, and change it only when your circumstances change.',
    ],
    relatedLessons: ['sip-vs-lump-sum', 'risk-capacity-and-asset-allocation', 'drawdowns-and-diversification'],
    relatedTerms: ['loss-aversion', 'recency-bias', 'sip', 'rebalancing', 'risk-tolerance'],
  },
]

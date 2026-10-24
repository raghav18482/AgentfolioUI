import { INVESTING_LESSONS } from './investingLessons'
import type { Lesson } from './types'

/** Managing Your Money, in reading order. */
const MANAGING_MONEY_LESSONS: Lesson[] = [
  {
    slug: 'take-home-pay-and-monthly-surplus',
    pathId: 'managing-money',
    title: 'From take-home pay to monthly surplus',
    summary: 'Find the surplus you can actually commit each month, and the order in which to deploy it.',
    level: 'core',
    minutes: 7,
    objective:
      'Work out the surplus you can commit every month — after fixed costs, EMIs and annual expenses spread across the year — and decide the order in which to deploy it.',
    explanation: [
      'Salary offers are quoted as **CTC (cost to company)**, which includes money you never receive as monthly cash: employer PF contributions, gratuity, insurance and variable pay that depends on performance. Planning starts from **take-home pay** — what is credited to your account after TDS, your own PF contribution and professional tax where it applies.',
      'Monthly outflows fall into three groups. **Fixed commitments**: rent, EMIs, school fees, support for family. **Variable spending**: groceries, fuel, dining, shopping. **Irregular annual costs**: insurance premiums, travel, festivals, gadget replacement, vehicle servicing. The third group is the one most plans miss, and the reason a healthy-looking surplus disappears in the months those bills arrive.',
      'Your **true monthly surplus** = take-home pay − fixed commitments − average variable spending − (annual irregular costs ÷ 12). Take the variable figure from three to six months of bank and card statements rather than memory; it is almost always higher than people estimate.',
      'Build the monthly plan on **fixed pay only**. Decide in advance what a bonus or variable payout will do — top up reserves, clear expensive debt, or fund a goal — so it is deployed deliberately instead of absorbed into lifestyle spending.',
      'Deploy the surplus in priority order: **(1)** an adequate emergency fund, **(2)** clearing high-cost debt such as rolled-over credit card balances and expensive personal loans, **(3)** adequate term and health cover, **(4)** cash reserves for goals due in the next few years, **(5)** long-term investing. Getting the order right matters more than precision — investing for a 15-year goal while carrying a credit card balance that costs far more than any realistic return rarely makes sense.',
      'Automate the result: schedule transfers and SIPs for the day after salary credit. Surplus that waits in a savings account tends to get spent.',
    ],
    example: {
      title: "Ankit's real surplus (illustrative figures)",
      body: '**Take-home pay:** ₹1,10,000 a month\n\n- Fixed commitments: rent ₹28,000 + car EMI ₹14,000 + support for parents ₹10,000 = **₹52,000**\n- Variable spending, averaged from six months of statements: **₹30,000**\n- Annual costs — insurance premiums ₹36,000, travel ₹60,000, festivals and gifts ₹30,000, other ₹18,000 = ₹1,44,000 a year, or **₹12,000 a month**\n\n**True monthly surplus:** ₹1,10,000 − ₹52,000 − ₹30,000 − ₹12,000 = **₹16,000**\n\nAnkit had planned to start ₹30,000 of SIPs, because that is roughly what his balance grew by in a good month. At ₹30,000 he would have had to pause them every time an annual bill arrived. ₹16,000 is the figure he can sustain.',
    },
    misconception: {
      myth: 'My surplus is whatever is left in my account at the end of the month.',
      reality:
        'End-of-month balances ignore annual costs and swing from month to month. Planning on them leads to over-committing in good months and breaking investments in expensive ones. Spread annual costs across the year before calling anything a surplus.',
    },
    quiz: [
      {
        prompt: 'Which figure should a monthly plan start from?',
        options: ['CTC divided by 12', 'Take-home pay after deductions', 'Gross salary including expected variable pay', 'Last month’s closing bank balance'],
        correctIndex: 1,
        explanation: 'CTC includes money you never receive monthly, and variable pay is not guaranteed. Plan on what is actually credited.',
      },
      {
        prompt:
          'Take-home pay is ₹90,000 a month, fixed commitments ₹40,000, average variable spending ₹25,000, and annual irregular costs ₹1,20,000. What is the true monthly surplus?',
        options: ['₹25,000', '₹15,000', '₹35,000', '₹5,000'],
        correctIndex: 1,
        explanation: '₹90,000 − ₹40,000 − ₹25,000 − (₹1,20,000 ÷ 12 = ₹10,000) = ₹15,000.',
      },
      {
        prompt:
          'Your emergency fund is in place. You receive a ₹2 lakh bonus and are rolling over a ₹60,000 credit card balance. What comes first?',
        options: ['Start a new equity SIP with the whole bonus', 'Clear the credit card balance', 'Upgrade the car', 'Leave it in the savings account until you decide'],
        correctIndex: 1,
        explanation: 'A rolled-over card balance is usually the most expensive money you owe; clearing it is a guaranteed saving no investment reliably beats.',
      },
      {
        prompt: 'Why build monthly commitments on fixed pay rather than including expected variable pay?',
        options: [
          'Variable pay is taxed differently from salary',
          'Variable pay is not guaranteed, so commitments based on it can become unaffordable',
          'Banks ignore variable pay when lending',
          'It makes no practical difference',
        ],
        correctIndex: 1,
        explanation: 'SIPs and EMIs sized on a bonus that does not arrive have to be broken or funded with debt.',
      },
    ],
    takeaways: [
      'Plan from take-home pay, not CTC, and on fixed pay, not expected bonuses.',
      'Spread annual costs across the year before calling anything a surplus.',
      'Deploy the surplus in priority order, and automate it the day after payday.',
    ],
    relatedLessons: ['emergency-fund-and-cash-reserves', 'debt-and-emi-decisions', 'financial-goals-and-time-horizons'],
    relatedTerms: ['ctc-vs-take-home', 'monthly-surplus', 'savings-rate', 'sinking-fund'],
  },
  {
    slug: 'emergency-fund-and-cash-reserves',
    pathId: 'managing-money',
    title: 'Emergency funds and goal-based cash reserves',
    summary: 'Size the emergency fund to your income risk, keep scheduled expenses separate, and hold each in the right place.',
    level: 'core',
    minutes: 7,
    objective:
      'Size an emergency fund to your income stability and obligations, separate it from reserves for known expenses, and choose where each should be held.',
    explanation: [
      'An emergency fund exists for events that would otherwise force you to borrow expensively or sell long-term investments at a bad time: job loss, a medical event insurance does not fully cover, an urgent family or home expense.',
      'Size it in months of **essential outflows**, not income: EMIs, rent, insurance premiums, groceries, utilities, school fees and support for dependants. Discretionary spending can be cut in an emergency; these cannot.',
      'How many months depends on how exposed your income is. Three to six months is a common range. A dual-income household with stable salaried jobs can sit at the lower end; a single earner with dependants, someone in a volatile industry, or a business owner with uneven income should hold more — often six to twelve months.',
      'Keep **goal-based cash reserves** (sinking funds) separate. A car down payment in 18 months, a school admission fee, next year’s insurance premiums — these are scheduled, not emergencies. Mixing them into the emergency fund makes it impossible to tell whether the emergency fund is still intact.',
      'Hold the emergency fund for safety and access, not return. Typical homes are a savings account for immediate needs; sweep-in or short fixed deposits for the bulk (FDs can usually be broken early, often with an interest penalty); and **liquid funds**, which invest only in debt and money-market securities maturing within 91 days and usually pay redemptions the next business day. Liquid fund returns are not guaranteed.',
      'Insurance and the emergency fund do different jobs: health cover pays large hospital bills; the fund covers income gaps, exclusions, waiting periods and everything else. If you draw on the fund, rebuilding it comes before new discretionary investing.',
    ],
    example: {
      title: 'Two households (illustrative figures)',
      body: '**Household A** — two salaried incomes, stable jobs, no loans, no dependants. Essential outflows ₹60,000 a month. A 4-month target gives **₹2,40,000**.\n\n**Household B** — one earner, a home loan EMI of ₹35,000, two children. Essential outflows ₹95,000 a month. An 8-month target gives **₹7,60,000**. Separately, B has a ₹1,50,000 school fee due in 10 months, so ₹15,000 a month goes into a **sinking fund** for it — not into the emergency fund.\n\nB might hold one month of essentials in the savings account and split the rest between sweep-in FDs and a liquid fund.',
    },
    misconception: {
      myth: 'An emergency fund is idle money — I’d be better off investing it.',
      reality:
        'Its return is the cost it avoids: selling investments in a downturn (when job losses are also more likely) or borrowing on a credit card or personal loan. Judge it as insurance, not as an investment.',
    },
    quiz: [
      {
        prompt: 'What should an emergency fund be sized against?',
        options: ['Gross annual salary', 'Essential monthly outflows', 'Total monthly spending, including discretionary', 'The value of your investment portfolio'],
        correctIndex: 1,
        explanation: 'In an emergency you can cut discretionary spending; the fund must cover what you cannot.',
      },
      {
        prompt: 'Who generally needs the larger emergency fund?',
        options: [
          'A dual-income couple with stable jobs and no dependants',
          'A single earner with dependants and a home loan EMI',
          'Someone with a large equity portfolio',
          'Someone with a high CTC',
        ],
        correctIndex: 1,
        explanation: 'One income supporting several people and a fixed EMI means a longer runway is needed if that income stops.',
      },
      {
        prompt: 'You know you will pay ₹1.2 lakh in admission fees in 8 months. Where does that money belong?',
        options: ['In the emergency fund', 'In a separate goal-based cash reserve', 'In an equity SIP', 'On a credit card, repaid later'],
        correctIndex: 1,
        explanation: 'A scheduled expense is not an emergency; keeping it separate shows whether the emergency fund is intact.',
      },
      {
        prompt: 'Liquid funds invest in:',
        options: ['Large-company shares', 'Debt and money-market securities maturing within 91 days', 'Gold', 'Long-term government bonds only'],
        correctIndex: 1,
        explanation: 'That short maturity limit is what keeps their value relatively stable and redemptions quick.',
      },
    ],
    takeaways: [
      'Size the emergency fund in months of essential outflows, adjusted for how exposed your income is.',
      'Keep scheduled expenses in separate sinking funds.',
      'Hold reserves for safety and access — savings account, short FDs, liquid funds — not for growth.',
    ],
    relatedLessons: ['take-home-pay-and-monthly-surplus', 'protect-before-you-invest', 'debt-and-emi-decisions'],
    relatedTerms: ['emergency-fund', 'sinking-fund', 'liquid-fund', 'fixed-deposit', 'liquidity'],
    sources: [
      {
        label: 'SEBI — Master Circular for Mutual Funds (Mar 2026): investments by liquid schemes',
        url: 'https://www.sebi.gov.in/sebi_data/attachdocs/mar-2026/1774024028162.pdf',
        asOf: '2026-10-25',
      },
    ],
  },
  {
    slug: 'debt-and-emi-decisions',
    pathId: 'managing-money',
    title: 'Debt and EMI decisions',
    summary: 'Rank loans by real cost, keep EMIs affordable, and decide when to prepay instead of invest.',
    level: 'core',
    minutes: 8,
    objective:
      'Rank your loans by true cost, keep total EMIs at a level your cash flow can absorb, and decide when prepaying a loan beats investing the money.',
    explanation: [
      'Rank debts by their **effective annual interest rate**, after any tax benefit you actually use. Rolled-over credit card balances and many personal loans sit at the top; secured loans such as home loans usually cost far less. Extra repayments go to the most expensive debt first.',
      '**EMI burden.** Lenders look at how much of your income already goes to EMIs before lending more. For your own plan, measure total EMIs against take-home pay. A common rule of thumb is to keep them within roughly 30–40% of take-home pay — treat that as a ceiling, not a target. Fixed costs and dependants matter more than any single ratio.',
      '**Prepay or invest?** Prepaying earns a **guaranteed** return equal to the loan’s interest rate, net of any tax benefit you give up. Investing the same money earns an **uncertain** return. Prepaying tends to win when the loan is expensive, when the alternative is a low-risk investment earning less than the loan costs, or when being debt-free sooner matters to you. Investing can make sense when the loan is cheap, the horizon is long, and you can tolerate the investment falling in value along the way.',
      'Keep the emergency fund intact before prepaying — money paid into a loan is hard to get back.',
      'When you prepay, lenders usually let you **keep the EMI and shorten the tenure**, or **keep the tenure and lower the EMI**. Shortening the tenure saves more interest; lowering the EMI eases monthly cash flow. If cash flow is comfortable, shortening the tenure is usually the cheaper choice.',
      'On charges: under RBI rules, lenders cannot levy pre-payment charges on floating-rate loans taken by individuals for purposes other than business, whatever the source of the money and without a lock-in. Fixed-rate loans may carry charges under the lender’s policy — check the sanction letter or Key Facts Statement.',
    ],
    example: {
      title: 'Prepaying a home loan (illustrative assumptions)',
      body: 'A ₹40 lakh home loan at an assumed **8.5%** for 20 years has an EMI of about **₹34,713**.\n\nAfter three years, the borrower prepays **₹5 lakh** and keeps the EMI unchanged. The loan now closes **50 months earlier**, and total interest falls by about **₹12.6 lakh**.\n\nInvesting the ₹5 lakh instead might end up worth more or less than that — the saving from prepaying is certain; the investment outcome is not. Which is better depends on the loan’s after-tax cost, your other debts and how much risk you can carry.',
    },
    visual: 'loan-prepayment',
    misconception: {
      myth: 'Never prepay a home loan — the tax benefit makes it nearly free.',
      reality:
        'A tax benefit lowers the effective cost; it does not remove it, and it only applies if you can use it under your tax regime. Compare the loan’s after-tax cost with the after-tax return you can realistically expect — and remember one is guaranteed and the other is not.',
    },
    quiz: [
      {
        prompt: 'You have a rolled-over credit card balance, a personal loan and a home loan. Which do you usually pay down first?',
        options: ['The home loan, because it is the largest', 'The debt with the highest effective interest rate', 'The loan with the longest tenure', 'Whichever lender contacts you most'],
        correctIndex: 1,
        explanation: 'Each rupee of extra repayment saves the most when it goes to the most expensive debt.',
      },
      {
        prompt: 'The return from prepaying a loan is:',
        options: [
          'Uncertain, like an equity investment',
          'Guaranteed, equal to the loan’s interest rate net of any tax benefit given up',
          'Always higher than investing',
          'Zero, because the money is gone',
        ],
        correctIndex: 1,
        explanation: 'Every rupee prepaid stops attracting interest at the loan rate, with certainty.',
      },
      {
        prompt: 'You prepay part of a loan and cash flow is comfortable. Which option usually saves more interest?',
        options: ['Keep the EMI and shorten the tenure', 'Keep the tenure and reduce the EMI', 'Both save exactly the same', 'Neither saves any interest'],
        correctIndex: 0,
        explanation: 'Keeping the EMI repays principal faster, so interest accrues on a smaller balance for fewer months.',
      },
      {
        prompt:
          'Under RBI rules, can a lender charge a pre-payment penalty on a floating-rate home loan taken by an individual for personal (non-business) use?',
        options: ['Yes, up to 2% of the amount prepaid', 'No', 'Only in the first year', 'Only if the money comes from a bonus'],
        correctIndex: 1,
        explanation: 'RBI’s directions bar pre-payment charges on such loans, whatever the source of funds and without a lock-in.',
      },
    ],
    takeaways: [
      'Rank debts by effective cost and repay the most expensive first.',
      'Keep total EMIs comfortably within your take-home pay — the ratio is a ceiling, not a target.',
      'Prepaying is a guaranteed return at the loan rate; weigh it against an uncertain investment return.',
    ],
    relatedLessons: ['take-home-pay-and-monthly-surplus', 'financial-goals-and-time-horizons', 'net-worth-and-cash-flow'],
    relatedTerms: ['emi', 'emi-to-income-ratio', 'loan-prepayment', 'floating-vs-fixed-rate', 'credit-score'],
    calculators: ['prepay'],
    sources: [
      {
        label: 'RBI — Reserve Bank of India (Pre-payment Charges on Loans) Directions, 2025',
        url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12878',
        asOf: '2026-10-25',
      },
    ],
  },
  {
    slug: 'protect-before-you-invest',
    pathId: 'managing-money',
    title: 'Protect before you invest: term and health cover',
    summary: 'Why income protection comes before long-term investing, how to size it, and why mixing it with investment rarely pays.',
    level: 'core',
    minutes: 7,
    objective:
      'Understand why adequate term life and health cover come before long-term investing, how to estimate cover, and why combining insurance with investment is usually a poor trade.',
    explanation: [
      'For most of a career, your future earnings are your largest financial asset. If others depend on that income, losing it is the risk to plan for first — before building an investment portfolio that would take years to replace it.',
      '**Term life insurance** pays a fixed sum if you die during the policy term and nothing otherwise. Because it has no savings component, it is the lowest-cost way to buy a large amount of cover.',
      'A needs-based estimate of cover: what your dependants would need for living costs over the years they rely on you, **plus** outstanding loans, **plus** major goals such as children’s education, **minus** investments that could be used. Multiples such as 10–15 times annual income are only a rough cross-check.',
      '**Health insurance** protects savings from large hospital bills. Employer group cover helps, but it usually ends when you leave the job and may be modest for a family, so many earners also hold a personal family policy that does not depend on employment.',
      'Products that bundle insurance with investment — such as traditional endowment or money-back plans — often give less cover and lower returns than buying term cover and investing the difference separately. Compare the policy’s benefit illustration against that alternative before buying.',
      'Disclose health history and habits fully when buying. Non-disclosure is a common reason claims are disputed.',
    ],
    example: {
      title: "Rohan's cover check (illustrative figures)",
      body: 'Rohan, 34, supports a spouse and a child on take-home pay of ₹1.4 lakh a month.\n\n- Family living costs ₹70,000 a month for about 20 years: ₹70,000 × 12 × 20 = **₹1.68 crore** (a first pass that ignores inflation and investment returns)\n- Outstanding home loan: **₹35 lakh**\n- Child’s education, at its estimated future cost: **₹40 lakh**\n- Less existing investments: **₹12 lakh**\n\nEstimated need: about **₹2.3 crore**. The cross-check of 15 × annual take-home pay (₹16.8 lakh) gives ₹2.5 crore — the same range, which is what a rough check is for. A detailed needs analysis would refine it.',
    },
    misconception: {
      myth: 'Insurance that pays nothing if I survive is money wasted.',
      reality:
        'You are paying to transfer a risk your family could not absorb. Plans that “return your money” build that refund into the price — usually through lower cover, lower returns, or both, compared with term cover plus separate investing.',
    },
    quiz: [
      {
        prompt: 'What does a pure term life policy pay?',
        options: ['A maturity amount whether or not you survive', 'A fixed sum only if you die during the term', 'Your premiums back with interest', 'Hospital bills'],
        correctIndex: 1,
        explanation: 'No survival benefit is what keeps term cover inexpensive for a large sum assured.',
      },
      {
        prompt: 'Why might a salaried employee also hold personal health cover?',
        options: [
          'Employer cover usually ends when you leave the job',
          'Employer cover is not allowed to cover families',
          'Personal cover is always cheaper',
          'There is no reason to',
        ],
        correctIndex: 0,
        explanation: 'Cover that depends on your job can disappear exactly when your income does.',
      },
      {
        prompt: 'In the order for deploying a surplus, where does adequate term and health cover usually sit?',
        options: [
          'After all long-term investing',
          'Before long-term investing, once the emergency fund and high-cost debt are handled',
          'Only after retirement',
          'It is optional for people with dependants',
        ],
        correctIndex: 1,
        explanation: 'Protection makes the rest of the plan survivable if the income stops.',
      },
      {
        prompt: 'What is the main drawback of combining insurance and investment in one product?',
        options: [
          'Such products are not permitted in India',
          'They often give less cover and lower returns than buying the two separately',
          'They have no premiums',
          'They cannot be surrendered',
        ],
        correctIndex: 1,
        explanation: 'Compare the cover and the illustrated maturity value against term cover plus investing the difference.',
      },
    ],
    takeaways: [
      'If others depend on your income, protect it before building long-term investments.',
      'Estimate cover from needs — living costs, loans and goals, less existing assets — and use income multiples only as a check.',
      'Keep insurance and investment separate unless a combined product clearly beats that alternative.',
    ],
    relatedLessons: ['emergency-fund-and-cash-reserves', 'take-home-pay-and-monthly-surplus', 'net-worth-and-cash-flow'],
    relatedTerms: ['term-insurance', 'health-insurance', 'emergency-fund'],
  },
  {
    slug: 'financial-goals-and-time-horizons',
    pathId: 'managing-money',
    title: 'Financial goals and time horizons',
    summary: 'Turn a goal into an amount, a date and a monthly number — and match the money to the horizon.',
    level: 'core',
    minutes: 8,
    objective:
      'Turn a goal into a target amount, date and priority; estimate its future cost; match the horizon to a suitable mix of investments; and work out the monthly amount it needs.',
    explanation: [
      'A plannable goal has four parts: **what** it is for, **when** you need the money, **how much** in today’s money, and **priority** — essential, important or aspirational. “Save for retirement” cannot be planned; “cover ₹80,000 a month of today’s expenses from age 58” can.',
      'Convert today’s cost to the cost at the target date using an assumed inflation rate for that kind of expense. Education and healthcare costs can rise faster than general prices, so test a higher assumption for them.',
      'Match the horizon to the investment. Money needed within about three years should not depend on equity markets, which can fall sharply and take years to recover. For goals three to seven years away a mix of debt and equity is common. Beyond about seven years, a higher equity share has more time to ride out downturns — with no guarantee that it will.',
      'Work backwards to a monthly number from three inputs: the future cost, what is already set aside, and an assumed return. Use conservative assumptions — a plan that only works at optimistic returns is not a plan.',
      'As a goal approaches, shift money gradually from equity to lower-risk options so a late market fall cannot derail it. When goals compete for the same surplus, fund essential goals first and let aspirational ones flex on timing or amount.',
    ],
    example: {
      title: 'A child’s higher education (illustrative assumptions)',
      body: 'Cost in today’s money: **₹20 lakh**, needed in **12 years**. At an assumed education inflation of **8%** a year, the future cost is about **₹50.4 lakh**.\n\n₹3 lakh is already invested. At an assumed return of **10%** a year it could grow to about ₹9.4 lakh, leaving a gap of about ₹40.9 lakh. Closing it needs roughly **₹15,150 a month**, invested at the start of each month.\n\nAt a more conservative assumed return of **8%**, the monthly figure rises to about **₹18,030**. Run both before committing — and revisit every year as actual returns replace assumptions.',
    },
    visual: 'goal-future-cost',
    misconception: {
      myth: 'If I invest regularly, my goals will take care of themselves.',
      reality:
        'Without a target amount and date you cannot tell whether you are investing enough — or taking too much risk with money you need in two years. Regular investing is the mechanism; the goal sets the amount and the mix.',
    },
    quiz: [
      {
        prompt: 'A goal is two years away. Which is the most suitable home for that money?',
        options: ['An all-equity fund, for maximum growth', 'Lower-risk options such as FDs or short-term debt funds', 'A few small-company stocks', 'Futures and options'],
        correctIndex: 1,
        explanation: 'Two years is too short to recover from a large equity fall.',
      },
      {
        prompt: 'Something costs ₹10 lakh today. At an assumed 7% annual inflation, roughly what will it cost in 10 years?',
        options: ['₹10.7 lakh', '₹17 lakh', '₹19.7 lakh', '₹27 lakh'],
        correctIndex: 2,
        explanation: '₹10 lakh × 1.07¹⁰ ≈ ₹19.7 lakh. Compounding nearly doubles the cost.',
      },
      {
        prompt: 'Why use conservative return assumptions when planning a goal?',
        options: [
          'Conservative assumptions guarantee the return',
          'So the plan still works if returns disappoint',
          'Higher assumptions are not permitted',
          'It makes no difference to the monthly amount',
        ],
        correctIndex: 1,
        explanation: 'Lower assumed returns mean a higher monthly amount now, and less risk of a shortfall later.',
      },
      {
        prompt: 'Money for a goal 18 months away is fully in equity funds. What is the usual approach?',
        options: ['Add more equity to catch up', 'Shift it gradually to lower-risk options', 'Stop tracking the goal', 'Borrow against the investments'],
        correctIndex: 1,
        explanation: 'De-risking near the deadline protects the goal from a late market fall.',
      },
    ],
    takeaways: [
      'Define each goal by amount, date and priority, and inflate today’s cost to the target date.',
      'Match the horizon to the investment: short-term money stays out of equity.',
      'Plan on conservative assumptions and de-risk as the date approaches.',
    ],
    relatedLessons: ['take-home-pay-and-monthly-surplus', 'net-worth-and-cash-flow', 'debt-and-emi-decisions'],
    relatedTerms: ['inflation', 'real-return', 'sip', 'asset-allocation', 'compound-interest'],
    calculators: ['goal', 'inflation'],
  },
  {
    slug: 'net-worth-and-cash-flow',
    pathId: 'managing-money',
    title: 'Net worth and cash flow',
    summary: 'The two statements that show whether you are actually making progress, and how to review them.',
    level: 'core',
    minutes: 7,
    objective:
      'Build a personal balance sheet and cash-flow view, track the few numbers that show real progress, and review them on a regular schedule.',
    explanation: [
      'Two statements describe your finances. The **balance sheet** is a snapshot — what you own minus what you owe. The **cash-flow statement** covers a period — what came in, what went out, and what was left to save or invest. Income alone tells you neither.',
      'List assets at realistic current values — bank balances, FDs, mutual funds and shares at market value, EPF and PPF balances, gold, property — and liabilities at the amount **outstanding**, not the original loan.',
      'Separate **liquid net worth** — what you could access within days without heavy penalties — from the total. A large net worth locked in a home and retirement accounts can coexist with a cash crunch. Your home is an asset, but unless you plan to sell or downsize it will not fund your goals, so it helps to track net worth with and without it.',
      'Track your **savings rate**: (take-home pay − spending) ÷ take-home pay, measured over a year. It is the number you control most directly, and early in a career it usually moves net worth more than investment returns do.',
      'Review the balance sheet once a year or after a major event, and cash flow monthly or quarterly. Watch the drivers, not just the total: net worth rising on new savings, falling debt and a steady allocation is durable; net worth rising only on a market rally can reverse.',
    ],
    example: {
      title: "Meera's annual review (illustrative figures)",
      body: '**Assets:** savings and FDs ₹4 lakh + mutual funds ₹9 lakh + EPF ₹6 lakh + flat at market value ₹75 lakh = **₹94 lakh**\n\n**Liabilities:** home loan outstanding ₹48 lakh + car loan ₹3 lakh = **₹51 lakh**\n\n**Net worth:** ₹94 lakh − ₹51 lakh = **₹43 lakh**. **Liquid net worth** — savings, FDs and mutual funds — is ₹13 lakh.\n\n**Savings rate:** take-home pay of ₹15 lakh for the year and spending of ₹11.4 lakh gives **24%**. Meera’s target for next year is 28%, which on the same income means spending about ₹10.8 lakh.',
    },
    misconception: {
      myth: 'A higher salary means I am building wealth.',
      reality:
        'Wealth is what you keep and invest, not what you earn. If spending and EMIs rise with every raise, net worth stalls at any income. Track savings rate and net worth, not CTC.',
    },
    quiz: [
      {
        prompt: 'Your assets total ₹60 lakh, including a ₹45 lakh flat, and your loans outstanding total ₹30 lakh. What is your net worth?',
        options: ['₹90 lakh', '₹30 lakh', '₹15 lakh', '₹60 lakh'],
        correctIndex: 1,
        explanation: 'Net worth = assets − liabilities = ₹60 lakh − ₹30 lakh. (Excluding the flat, your remaining assets are ₹15 lakh.)',
      },
      {
        prompt: 'Take-home pay is ₹12 lakh a year and spending is ₹9 lakh. What is the savings rate?',
        options: ['9%', '25%', '33%', '75%'],
        correctIndex: 1,
        explanation: '(₹12 lakh − ₹9 lakh) ÷ ₹12 lakh = 25%.',
      },
      {
        prompt: 'Which is the best example of liquid net worth?',
        options: ['Your flat', 'Your EPF balance', 'Savings account and liquid fund balances', 'Your car'],
        correctIndex: 2,
        explanation: 'These can be accessed within days without heavy penalties; a home or EPF balance cannot.',
      },
      {
        prompt: 'Net worth rose 20% this year, entirely from a market rally, while your savings rate fell. What does that suggest?',
        options: [
          'Finances are improving on every front',
          'Progress depends on markets and could reverse; the savings habit has weakened',
          'Savings rate no longer matters',
          'You should stop investing',
        ],
        correctIndex: 1,
        explanation: 'Market gains can reverse; a falling savings rate is a trend you control and should address.',
      },
    ],
    takeaways: [
      'Keep a balance sheet and a cash-flow view; income alone shows neither.',
      'Track liquid net worth and savings rate, not just the headline total.',
      'Review yearly, and check whether progress comes from saving or from markets.',
    ],
    relatedLessons: ['take-home-pay-and-monthly-surplus', 'debt-and-emi-decisions', 'financial-goals-and-time-horizons'],
    relatedTerms: ['net-worth', 'cash-flow', 'savings-rate', 'liquidity'],
  },
]

/**
 * Every lesson, path by path, in reading order. Written for people who already
 * earn and want to decide better. Every rate or price in an example is an
 * illustrative assumption, labelled as one — never a forecast or a live figure.
 */
export const LESSONS: Lesson[] = [...MANAGING_MONEY_LESSONS, ...INVESTING_LESSONS]

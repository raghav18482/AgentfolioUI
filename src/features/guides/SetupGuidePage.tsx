import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Play, Settings2 } from 'lucide-react'
import { PageMeta } from '@/components/layout/PageMeta'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { InlineCode } from '@/components/ui/InlineCode'
import { LINKS } from '@/lib/links'
import { CredentialResult, GuideNote } from './GuideNote'
import { GuideTable } from './GuideTable'
import { StepCard } from './StepCard'
import { StepItem, StepList } from './StepList'

const credentials = [
  { name: 'API Key', desc: 'Identifies your app' },
  { name: 'Client ID', desc: 'Your account ID' },
  { name: 'PIN', desc: 'Your trading PIN' },
  { name: 'TOTP Secret', desc: 'For 2FA login' },
]

const summaryRows = [
  ['API Key', 'SmartAPI → My Apps → Your App', '4XDUeA4C'],
  ['Client ID', 'Your Angel One account number', 'AB1234'],
  ['PIN', 'Your trading PIN', '1234'],
  ['TOTP Secret', 'SmartAPI → Profile → Enable TOTP', 'FP4O3EVU...'],
].map(([name, source, example]) => [
  <strong key="name" className="text-white">{name}</strong>,
  source,
  <InlineCode key="example">{example}</InlineCode>,
])

const nextSteps = [
  {
    to: '/enroll',
    icon: Play,
    title: 'Use the Web Dashboard',
    desc: 'Save these four once, then log in with just a number and password',
  },
  {
    to: '/connect',
    icon: Settings2,
    title: 'Connect via MCP',
    desc: 'Set up Claude, ChatGPT, or Cursor to manage your portfolio with AI',
  },
]

const externalLink = 'font-semibold text-brand-400 hover:text-brand-300'

export function SetupGuidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <PageMeta
        title="Get your Angel One SmartAPI credentials"
        description="Step-by-step guide to generating the four Angel One SmartAPI credentials Agentfolio needs: API key, client ID, PIN and TOTP secret."
      />
      <header className="animate-fade-in text-center">
        <span className="inline-flex rounded-full border border-brand-500/20 bg-brand-500/5 px-3 py-1 text-xs font-medium text-brand-300">
          Setup Guide
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
          Get Your Angel One API Credentials
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-surface-200/60 sm:text-base">
          To use Agentfolio &mdash; whether through the web dashboard, Claude, ChatGPT, or Cursor &mdash;
          you need 4 credentials from Angel One's SmartAPI portal. This guide walks you through generating
          each one.
        </p>
      </header>

      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="The four credentials">
        {credentials.map((c, i) => (
          <li key={c.name} className="rounded-2xl border border-surface-800 bg-surface-900/60 p-4 text-center">
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/15 font-display text-sm font-semibold text-brand-300">
              {i + 1}
            </span>
            <p className="mt-2 text-sm font-semibold text-white">{c.name}</p>
            <p className="text-xs text-surface-200/50">{c.desc}</p>
          </li>
        ))}
      </ol>

      <StepCard step={1} title="Sign in to SmartAPI">
        <p>Open the Angel One SmartAPI portal and log in with your Angel One trading account credentials.</p>
        <ButtonLink href={LINKS.smartApiPortal}>
          Open SmartAPI Portal <ExternalLink className="h-4 w-4" aria-hidden />
        </ButtonLink>
        <p>
          If you don't have an Angel One account yet, you'll need to{' '}
          <a href={LINKS.angelOneSignup} target="_blank" rel="noopener noreferrer" className={externalLink}>
            open a free Demat account
          </a>{' '}
          first.
        </p>
      </StepCard>

      <StepCard step={2} title="Create an App & Get Your API Key">
        <p>Once logged in to SmartAPI:</p>
        <StepList>
          <StepItem bullet="a">
            Go to <strong className="text-white">"My Apps"</strong> in the left sidebar
          </StepItem>
          <StepItem bullet="b">
            Click <strong className="text-white">"Create App"</strong>
          </StepItem>
          <StepItem bullet="c">
            Fill in the details:
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-surface-200/60">
              <li>
                <strong className="text-surface-200/90">App Name:</strong> anything you like (e.g. "Agentfolio")
              </li>
              <li>
                <strong className="text-surface-200/90">App Type:</strong> select{' '}
                <strong className="text-surface-200/90">"Trading APIs"</strong>
              </li>
              <li>
                <strong className="text-surface-200/90">Redirect URL:</strong> enter{' '}
                <InlineCode>https://localhost</InlineCode>
              </li>
            </ul>
          </StepItem>
          <StepItem bullet="d">
            Click <strong className="text-white">Submit</strong> &mdash; your{' '}
            <strong className="text-white">API Key</strong> will appear on the app details page. Copy it.
          </StepItem>
        </StepList>
        <CredentialResult name="API Key" example="2XUDeA4C" />
      </StepCard>

      <StepCard step={3} title="Find Your Client ID">
        <p>
          Your Client ID is your Angel One <strong className="text-white">account number</strong>. You already
          have this &mdash; it's the ID you use to log in.
        </p>
        <p>You can find it in any of these places:</p>
        <StepList>
          <StepItem bullet="•">Top-right corner of the SmartAPI dashboard after login</StepItem>
          <StepItem bullet="•">Your Angel One mobile app &rarr; Profile section</StepItem>
          <StepItem bullet="•">The welcome email you received when you opened your account</StepItem>
        </StepList>
        <CredentialResult name="Client ID" example="AB1234" />
      </StepCard>

      <StepCard step={4} title="Your Trading PIN">
        <p>
          This is the <strong className="text-white">numeric PIN</strong> you use to log into the Angel One app
          or website. It's typically a 4-digit number that you set when you created your account.
        </p>
        <GuideNote>
          If you've forgotten your PIN, you can reset it from the Angel One app under{' '}
          <strong className="text-white">Settings &rarr; Security &rarr; Change PIN</strong>.
        </GuideNote>
        <CredentialResult name="PIN" example="1234" />
      </StepCard>

      <StepCard step={5} title="Generate Your TOTP Secret">
        <p>
          TOTP (Time-based One-Time Password) is needed for secure 2FA authentication. Here's how to enable it:
        </p>
        <StepList>
          <StepItem bullet="a">
            In the SmartAPI portal, go to <strong className="text-white">"My Profile"</strong> or click your
            name in the top-right
          </StepItem>
          <StepItem bullet="b">
            Look for <strong className="text-white">"Enable TOTP"</strong> or{' '}
            <strong className="text-white">"External TOTP"</strong> option
          </StepItem>
          <StepItem bullet="c">
            Click <strong className="text-white">"Enable"</strong> &mdash; a{' '}
            <strong className="text-white">Base32 secret key</strong> will be displayed (a long alphanumeric
            string)
          </StepItem>
          <StepItem bullet="d">
            <strong className="text-white">Copy this secret immediately</strong> and save it somewhere safe
          </StepItem>
        </StepList>
        <GuideNote tone="danger">
          <strong>Important:</strong> The TOTP secret is only shown <strong>once</strong> when you enable it. If
          you lose it, you'll have to disable TOTP and re-enable it to get a new one. Save it now.
        </GuideNote>
        <CredentialResult name="TOTP Secret" example="FA715TVTYXE5Q3WTF6I7..." />
      </StepCard>

      <StepCard title="All Set!">
        <p className="text-surface-200/60">You should now have all 4 credentials. Here's a quick reference:</p>
        <GuideTable
          caption="Where each credential comes from"
          columns={['Credential', 'Where You Got It', 'Looks Like']}
          rows={summaryRows}
        />
        <p className="pt-2">Now you can use these credentials to:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {nextSteps.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group flex gap-3 rounded-xl border border-surface-800 bg-surface-900/40 p-4 transition-colors hover:border-brand-500/40 hover:bg-surface-900/80"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600/15 text-brand-300">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 font-semibold text-white">
                  {title}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="mt-0.5 block text-xs text-surface-200/55">{desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </StepCard>
    </div>
  )
}

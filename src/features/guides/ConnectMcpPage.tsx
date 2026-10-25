import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { InlineCode } from '@/components/ui/InlineCode'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { useCurrentUser } from '@/hooks/useSession'
import { LINKS } from '@/lib/links'
import { SITE_URL } from '@/seo/routes'
import { GuideNote } from './GuideNote'
import { GuideTable } from './GuideTable'
import { AccessTokens, ConnectedApps } from './McpAccessPanels'
import { StepCard, StepHeading } from './StepCard'
import { StepItem, StepList } from './StepList'

/** Every tool the MCP server exposes. All of them only read. */
const MCP_TOOLS: Array<[string, string]> = [
  ['portfolio_summary', 'Overall portfolio: invested, current value, P&L'],
  ['get_holdings / get_all_holdings', 'Stock holdings with P&L per stock, and totals'],
  ['get_positions', 'Open intraday / delivery positions'],
  ['get_funds', 'Available cash, margin, and net value'],
  ['get_order_book / get_trade_book', "Today's orders and executed trades (history only)"],
  ['get_profile', 'Account profile'],
  ['search_scrip / get_ltp / get_market_depth', 'Find instruments, last price, order-book depth'],
  ['get_candle_data / get_stock_history', 'Historical OHLC data'],
  ['calculate_pnl', 'P&L for one symbol'],
  ['predict_price_direction', 'Technical-signal outlook (not advice)'],
]

const TOKEN_PLACEHOLDER = 'mfm_your_token_here'

const LOCAL_SETUP = `git clone ${LINKS.sourceRepo}
cd MyFinancesMCP
pip install -r requirements.txt
python main.py`

function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5 text-sm leading-relaxed text-surface-200/75">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const strong = 'text-white'
const link = 'font-semibold text-brand-400 hover:text-brand-300'

function SignInPrompt({ to }: { to: string }) {
  return (
    <p>
      <Link to="/login" className={link}>
        Log in
      </Link>{' '}
      to {to}.
    </p>
  )
}

export function ConnectMcpPage() {
  const user = useCurrentUser()
  // The page and the MCP endpoint share an origin, and the browser's view of it
  // is right behind a TLS-terminating proxy, where the server's own is not.
  // Prerendering has no browser, so it uses the public origin.
  const origin = typeof window === 'undefined' ? SITE_URL : window.location.origin
  const mcpUrl = `${origin}/mcp/mcp`

  const claudeDesktopConfig = `{
  "mcpServers": {
    "angelone-portfolio": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote", "${mcpUrl}",
        "--header", "Authorization:\${AUTH_HEADER}"
      ],
      "env": { "AUTH_HEADER": "Bearer ${TOKEN_PLACEHOLDER}" }
    }
  }
}`

  const cursorConfig = `{
  "mcpServers": {
    "angelone-portfolio": {
      "url": "${mcpUrl}",
      "headers": { "Authorization": "Bearer ${TOKEN_PLACEHOLDER}" }
    }
  }
}`

  const claudeCodeCommand = `claude mcp add --transport http angelone-portfolio ${mcpUrl}`

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <PageMeta
        title="Connect your Angel One portfolio to Claude, ChatGPT or Cursor"
        description="Add the Agentfolio MCP server to Claude, Claude Code, Cursor or any MCP client to analyse your Angel One portfolio and market data. Read-only: it cannot place orders."
      />
      <PageHeader
        title="Connect Agentfolio to Your AI Assistant"
        sub="Connect this MCP server to Claude, Claude Code, Cursor, or any MCP client. Your assistant can then read your Angel One portfolio and market data and help you analyse it. It is read-only: it cannot place, modify or cancel orders, and any trade idea it gives you is hypothetical."
      />

      <GuideNote>
        <strong className={strong}>Don't want to set up MCP?</strong> The{' '}
        <Link to="/login" className={link}>
          web dashboard
        </Link>{' '}
        has the same read-only assistant built in. No MCP configuration needed.
      </GuideNote>

      <StepCard step={1} title="Claude: add a custom connector (no token needed)">
        <p>Works in claude.ai, and in the Claude desktop and mobile apps once added.</p>
        <StepList>
          <StepItem bullet="a">
            In Claude, open <strong className={strong}>Settings &rarr; Connectors &rarr; Add custom connector</strong>.
          </StepItem>
          <StepItem bullet="b">
            Paste this URL and choose <strong className={strong}>Add</strong>:
          </StepItem>
        </StepList>
        <CodeBlock label="Connector URL" code={mcpUrl} highlight={[mcpUrl]} />
        <StepList>
          <StepItem bullet="c">
            Choose <strong className={strong}>Connect</strong>. A sign-in page from this site opens: enter your
            WhatsApp number and app password and approve{' '}
            <strong className={strong}>read-only portfolio access</strong>.
          </StepItem>
        </StepList>
        <p>
          Claude never sees your app password or Angel One credentials. It receives a read-only token (
          <InlineCode>portfolio:read</InlineCode>) that renews itself. You can disconnect from Claude or here at any
          time.
        </p>

        <StepHeading>Connected apps</StepHeading>
        {user ? <ConnectedApps /> : <SignInPrompt to="see and disconnect connected apps" />}
      </StepCard>

      <StepCard step={2} title="Other clients: create a personal access token">
        <p>
          Clients that send an HTTP header instead of signing in (Cursor, <InlineCode>mcp-remote</InlineCode>,
          scripts) identify you with a <strong className={strong}>personal access token</strong> that you create here
          and paste into the client. You never type Angel One credentials into an AI chat.
        </p>
        <Checklist
          items={[
            <>
              Shown <strong className={strong}>once</strong>. We store only a hash of it.
            </>,
            <>Expires after 30 days by default (up to 90), and you can revoke it here at any time.</>,
            <>
              Grants <InlineCode>portfolio:read</InlineCode> only. Anyone holding it can read your portfolio, so
              treat it like a password.
            </>,
          ]}
        />
        {user ? <AccessTokens /> : <SignInPrompt to="create a token" />}
      </StepCard>

      <StepCard step={3} title="Claude Code">
        <p>
          Add the server, then run <InlineCode>/mcp</InlineCode> in Claude Code and choose{' '}
          <strong className={strong}>Authenticate</strong>: it opens the same sign-in page as the connector.
        </p>
        <CodeBlock label="Terminal" code={claudeCodeCommand} highlight={[mcpUrl]} />
        <p>
          Prefer a token? Add <InlineCode>{`--header "Authorization: Bearer ${TOKEN_PLACEHOLDER}"`}</InlineCode> to
          the command instead.
        </p>
      </StepCard>

      <StepCard step={4} title="Claude Desktop with a token (mcp-remote)">
        <p>
          The connector in step 1 is the easiest route. To use a token instead, add this to{' '}
          <InlineCode>claude_desktop_config.json</InlineCode> (needs{' '}
          <a href={LINKS.nodeJs} target="_blank" rel="noopener noreferrer" className={link}>
            Node.js
          </a>
          ). The token goes in an environment variable, not on the command line:
        </p>
        <CodeBlock label="macOS" code="~/Library/Application Support/Claude/claude_desktop_config.json" />
        <CodeBlock label="Windows" code="%APPDATA%\Claude\claude_desktop_config.json" />
        <CodeBlock
          label="claude_desktop_config.json"
          code={claudeDesktopConfig}
          highlight={[mcpUrl, TOKEN_PLACEHOLDER]}
        />
        <p>
          Restart Claude Desktop, then ask things like <em>"Show my portfolio summary"</em> or{' '}
          <em>"How concentrated are my holdings?"</em>
        </p>
      </StepCard>

      <StepCard step={5} title="Cursor IDE">
        <p>
          Create or edit <InlineCode>.cursor/mcp.json</InlineCode>:
        </p>
        <CodeBlock label=".cursor/mcp.json" code={cursorConfig} highlight={[mcpUrl, TOKEN_PLACEHOLDER]} />
        <GuideNote>
          <strong className={strong}>Keep this file out of git</strong> &mdash; it contains your token.
        </GuideNote>
      </StepCard>

      <StepCard step={6} title="Other MCP Clients">
        <p>
          Any client that speaks the <strong className={strong}>Streamable HTTP</strong> transport works, either by
          signing in with OAuth (discovered automatically) or with a token header:
        </p>
        <CodeBlock label="Endpoint" code={`URL:    ${mcpUrl}\nHeader: Authorization: Bearer ${TOKEN_PLACEHOLDER}`} />
        <GuideNote>
          OAuth clients find the sign-in server at{' '}
          <InlineCode>{`${origin}/.well-known/oauth-protected-resource/mcp/mcp`}</InlineCode>. The old{' '}
          <InlineCode>/mcp/sse</InlineCode> endpoint has been removed.
        </GuideNote>
      </StepCard>

      <StepCard step={7} title="Run Locally (Self-Hosted)">
        <CodeBlock label="Terminal" code={LOCAL_SETUP} />
        <p>
          Open <InlineCode>http://localhost:8000</InlineCode>, enroll, create a token on the Connect page, and point
          your client at <InlineCode>http://localhost:8000/mcp/mcp</InlineCode> with the same header.
        </p>
      </StepCard>

      <StepCard step={8} title="Available Tools (all read-only)">
        <GuideTable
          caption="MCP tools"
          columns={['Tool', 'Description']}
          rows={MCP_TOOLS.map(([tool, desc]) => [<InlineCode key="tool">{tool}</InlineCode>, desc])}
        />
        <p>There are no order, login or account-changing tools.</p>
      </StepCard>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Security</h2>
        <Checklist
          items={[
            <>
              Your Angel One credentials are <strong className={strong}>encrypted at rest</strong> on the server and
              are never sent to, or typed into, the AI model
            </>,
            <>
              The MCP server is <strong className={strong}>read-only</strong>: no tool can place, modify or cancel an
              order
            </>,
            <>
              Connector sign-in is <strong className={strong}>OAuth 2.1 with PKCE</strong>; tokens are stored only as
              hashes and work only for this MCP endpoint
            </>,
            <>
              Each token sees <strong className={strong}>only its owner's</strong> data; revoking it takes effect on
              the next request
            </>,
            <>
              All traffic goes over <strong className={strong}>HTTPS</strong> when deployed
            </>,
          ]}
        />
      </Card>
    </div>
  )
}

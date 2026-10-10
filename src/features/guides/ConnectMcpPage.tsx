import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { InlineCode } from '@/components/ui/InlineCode'
import { PageHeader } from '@/components/layout/PageHeader'
import { LINKS } from '@/lib/links'
import { GuideNote } from './GuideNote'
import { GuideTable } from './GuideTable'
import { StepCard, StepHeading } from './StepCard'
import { StepItem, StepList } from './StepList'

/** Every tool the MCP server exposes once a client is connected and logged in. */
const MCP_TOOLS: Array<[string, string]> = [
  ['login', 'Authenticate with Angel One (must call first)'],
  ['logout', 'Discard session credentials from memory'],
  ['portfolio_summary', 'Overall portfolio: invested, current value, P&L'],
  ['get_holdings', 'All stock holdings with P&L per stock'],
  ['get_positions', 'Open intraday / delivery positions'],
  ['get_funds', 'Available cash, margin, and net value'],
  ['get_order_book', "Today's orders and their status"],
  ['get_trade_book', 'Executed trades for today'],
  ['search_scrip', 'Search stocks by name or symbol'],
  ['get_ltp', 'Last traded price for a stock'],
  ['get_candle_data', 'Historical OHLC candle data'],
  ['place_order', 'Place a buy/sell order (real money!)'],
  ['modify_order', 'Modify an existing open order'],
  ['cancel_order', 'Cancel an open order'],
]

const LOGIN_PROMPT = `Log in to my Angel One account with these credentials:
- API Key: YOUR_API_KEY
- Client ID: YOUR_CLIENT_ID
- Password: YOUR_PIN
- TOTP Secret: YOUR_TOTP_SECRET`

const LOCAL_SETUP = `git clone ${LINKS.sourceRepo}
cd MyFinancesMCP
pip install -r requirements.txt
python main.py`

const LOCAL_PYTHON_PATH = '/full/path/to/MyFinancesMCP/mcp_server.py'

const LOCAL_CLAUDE_CONFIG = `{
  "mcpServers": {
    "angelone-portfolio": {
      "command": "python3",
      "args": ["${LOCAL_PYTHON_PATH}"],
      "env": {
        "ANGELONE_API_KEY": "YOUR_API_KEY",
        "ANGELONE_CLIENT_ID": "YOUR_CLIENT_ID",
        "ANGELONE_PASSWORD": "YOUR_PIN",
        "ANGELONE_TOTP_SECRET": "YOUR_TOTP_SECRET"
      }
    }
  }
}`

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

export function ConnectMcpPage() {
  // The page and the MCP endpoint share an origin, and the browser's view of it
  // is right behind a TLS-terminating proxy, where the server's own is not.
  const sseUrl = `${window.location.origin}/mcp/sse`

  const claudeConfig = `{
  "mcpServers": {
    "angelone-portfolio": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${sseUrl}"]
    }
  }
}`

  const cursorConfig = `{
  "mcpServers": {
    "angelone-portfolio": {
      "url": "${sseUrl}"
    }
  }
}`

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <PageHeader
        title="Connect Agentfolio to Your AI Assistant"
        sub="Follow the steps below to connect this MCP server to Claude Desktop, ChatGPT, Cursor, or any MCP-compatible client. Once connected, you can track your Angel One portfolio and even place trades through your AI assistant."
      />

      <GuideNote>
        <strong className={strong}>Don't want to set up MCP?</strong> You can get AI-powered portfolio insights
        directly from the{' '}
        <Link to="/login" className={link}>
          web dashboard
        </Link>{' '}
        &mdash; just log in and add your OpenRouter API key. No MCP configuration needed.
      </GuideNote>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Before You Start</h2>
        <Checklist
          items={[
            <>
              Your Angel One <strong className={strong}>API Key</strong>,{' '}
              <strong className={strong}>Client ID</strong>, <strong className={strong}>PIN</strong>, and{' '}
              <strong className={strong}>TOTP Secret</strong> &mdash;{' '}
              <Link to="/setup" className={link}>
                learn how to generate them
              </Link>
            </>,
            <>
              <strong className={strong}>Node.js</strong> installed (required for Claude Desktop &mdash;{' '}
              <a href={LINKS.nodeJs} target="_blank" rel="noopener noreferrer" className={link}>
                download here
              </a>
              ). Not needed for ChatGPT or Cursor.
            </>,
          ]}
        />
      </Card>

      <StepCard step={1} title="Claude Desktop">
        <StepHeading>Find your config file</StepHeading>
        <p>Open the Claude Desktop config file at:</p>
        <CodeBlock label="macOS" code="~/Library/Application Support/Claude/claude_desktop_config.json" />
        <CodeBlock label="Windows" code="%APPDATA%\Claude\claude_desktop_config.json" />

        <StepHeading>Add the MCP server</StepHeading>
        <p>
          Add the following to the <InlineCode>mcpServers</InlineCode> object in the config file:
        </p>
        <CodeBlock label="claude_desktop_config.json" code={claudeConfig} highlight={[sseUrl]} />
        <GuideNote>
          <strong className={strong}>Note:</strong> Claude Desktop doesn't support SSE natively, so we use{' '}
          <InlineCode>mcp-remote</InlineCode> as a bridge. It is installed automatically via{' '}
          <InlineCode>npx</InlineCode>.
        </GuideNote>

        <StepHeading>Restart Claude Desktop</StepHeading>
        <p>
          Quit Claude Desktop completely and reopen it. You should see a hammer icon indicating MCP tools are
          available.
        </p>

        <StepHeading>Login</StepHeading>
        <p>In your first message, ask Claude to log in with your credentials:</p>
        <CodeBlock label="Example prompt" code={LOGIN_PROMPT} />
        <p>
          Claude will call the <InlineCode>login</InlineCode> tool, and then you can ask things like{' '}
          <em>"Show my portfolio summary"</em> or <em>"What are my holdings?"</em>
        </p>
      </StepCard>

      <StepCard step={2} title="ChatGPT">
        <StepHeading>Open Settings</StepHeading>
        <p>
          On{' '}
          <a href={LINKS.chatGpt} target="_blank" rel="noopener noreferrer" className={link}>
            chatgpt.com
          </a>
          , click your profile icon and go to <strong className={strong}>Settings &rarr; Connected apps</strong>.
        </p>

        <StepHeading>Add an MCP server</StepHeading>
        <p>
          Click <strong className={strong}>"Add"</strong> and fill in the following:
        </p>
        <StepList>
          <StepItem bullet="a">
            <strong className={strong}>Name:</strong> AngelOne Portfolio
          </StepItem>
          <StepItem bullet="b">
            <strong className={strong}>Description:</strong> Angel One portfolio tracker via MCP
          </StepItem>
          <StepItem bullet="c">
            <strong className={strong}>MCP Server URL:</strong>
          </StepItem>
        </StepList>
        <CodeBlock label="MCP Server URL" code={sseUrl} highlight={[sseUrl]} />
        <StepList>
          <StepItem bullet="d">
            <strong className={strong}>Authentication:</strong> select <strong className={strong}>None</strong>
          </StepItem>
          <StepItem bullet="e">
            Check the <strong className={strong}>"I understand and want to continue"</strong> checkbox
          </StepItem>
          <StepItem bullet="f">
            Click <strong className={strong}>Create</strong>
          </StepItem>
        </StepList>
        <GuideNote>
          <strong className={strong}>Note:</strong> MCP support is available on ChatGPT web (chatgpt.com). No
          desktop app or Node.js required.
        </GuideNote>

        <StepHeading>Login &amp; use</StepHeading>
        <p>
          Start a new chat and ask ChatGPT to log in with your Angel One credentials, then ask about your
          portfolio, holdings, or place trades.
        </p>
      </StepCard>

      <StepCard step={3} title="Cursor IDE">
        <StepHeading>Add the MCP config</StepHeading>
        <p>
          Create or edit <InlineCode>.cursor/mcp.json</InlineCode> in your project root:
        </p>
        <CodeBlock label=".cursor/mcp.json" code={cursorConfig} highlight={[sseUrl]} />
        <GuideNote>
          <strong className={strong}>Note:</strong> Cursor supports the <InlineCode>url</InlineCode> field
          directly &mdash; no bridge needed.
        </GuideNote>

        <StepHeading>Login &amp; use</StepHeading>
        <p>
          Open Cursor's AI chat and ask it to log in with your Angel One credentials, then use any portfolio or
          trading tool.
        </p>
      </StepCard>

      <StepCard step={4} title="Other MCP Clients">
        <p>Any MCP-compatible client that supports SSE transport can connect using:</p>
        <CodeBlock label="SSE endpoint" code={sseUrl} />
        <p>
          If your client only supports stdio, use <InlineCode>mcp-remote</InlineCode> as a bridge:
        </p>
        <CodeBlock label="stdio bridge" code={`npx -y mcp-remote ${sseUrl}`} highlight={[sseUrl]} />
      </StepCard>

      <StepCard step={5} title="Run Locally (Self-Hosted)">
        <p>
          Don't want to use our hosted server? Clone the repo and run everything on your machine &mdash; no data
          leaves localhost.
        </p>

        <StepHeading>Clone &amp; install</StepHeading>
        <CodeBlock label="Terminal" code={LOCAL_SETUP} />
        <p>
          The server starts on <InlineCode>http://localhost:8000</InlineCode>. Open it in your browser for the
          web dashboard, or connect your AI assistant using the local MCP endpoint.
        </p>

        <StepHeading>Claude Desktop &mdash; direct Python config (no Node.js needed)</StepHeading>
        <p>
          When running locally, you can skip <InlineCode>mcp-remote</InlineCode> entirely and point Claude
          Desktop straight at the Python server:
        </p>
        <CodeBlock
          label="claude_desktop_config.json"
          code={LOCAL_CLAUDE_CONFIG}
          highlight={['python3', LOCAL_PYTHON_PATH]}
        />
        <GuideNote>
          <strong className={strong}>Replace</strong> the highlighted paths and credential values with your own.
          On macOS/Linux you can find the full Python path by running <InlineCode>which python3</InlineCode> in
          your terminal. This config runs the MCP server as a subprocess of Claude Desktop using stdio transport
          &mdash; no extra dependencies needed.
        </GuideNote>

        <StepHeading>Cursor &amp; ChatGPT &mdash; local SSE</StepHeading>
        <p>
          With <InlineCode>python main.py</InlineCode> running, use the local URL in the configs shown in Steps
          1&ndash;3 above:
        </p>
        <CodeBlock label="Local SSE endpoint" code="http://localhost:8000/mcp/sse" />
      </StepCard>

      <StepCard step={6} title="Available Tools">
        <p>Once connected and logged in, your AI assistant can use these tools:</p>
        <GuideTable
          caption="MCP tools"
          columns={['Tool', 'Description']}
          rows={MCP_TOOLS.map(([tool, desc]) => [<InlineCode key="tool">{tool}</InlineCode>, desc])}
        />
      </StepCard>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Security</h2>
        <Checklist
          items={[
            <>
              Credentials you give an MCP client are <strong className={strong}>never stored on disk</strong>{' '}
              &mdash; they live only in server memory
            </>,
            <>
              Sessions <strong className={strong}>auto-expire after 8 hours</strong>
            </>,
            <>
              All traffic goes over <strong className={strong}>HTTPS</strong> when deployed (Railway/Render
              provide TLS)
            </>,
            <>
              Your OpenRouter API key (for dashboard AI insights) is{' '}
              <strong className={strong}>encrypted client-side</strong> and never stored on the server
            </>,
            <>
              You can call <InlineCode>logout</InlineCode> at any time to immediately discard your session
            </>,
          ]}
        />
      </Card>
    </div>
  )
}

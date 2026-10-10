import { ChatPanel } from '@/components/chat/ChatPanel'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAgentChat } from '@/hooks/useAgentChat'

/** Interim: Phase 8 adds the conversation sidebar and the finance/trading toggle. */
export function AgentPage() {
  const chat = useAgentChat('finance')
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8 sm:px-6">
      <PageHeader kicker="Portfolio assistant" title="Finance agent" />
      <ChatPanel
        height="calc(100vh - 16rem)"
        autoFocus
        messages={chat.messages}
        busy={chat.busy}
        loading={chat.historyLoading}
        onSend={(text) => void chat.send(text)}
        emptyTitle="What would you like to know?"
        emptyDescription="Try a starter below or type your own question."
        starters={[]}
        placeholder="Message your finance agent…"
      />
    </div>
  )
}

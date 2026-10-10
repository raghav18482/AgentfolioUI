import { MessageSquarePlus } from 'lucide-react'
import { ChatPanel, type ChatStarter } from '@/components/chat/ChatPanel'
import { Button } from '@/components/ui/Button'
import { InlineCode } from '@/components/ui/InlineCode'
import { useAgentChat } from '@/hooks/useAgentChat'

const STARTERS: ChatStarter[] = [
  { label: 'Suggest trades', prompt: 'What trades would you recommend based on my risk profile and current holdings?' },
  { label: 'Analyze RELIANCE', prompt: "Analyze RELIANCE-EQ technically and tell me if it's a good entry point." },
  { label: 'Pending proposals', prompt: 'Show my current pending proposals.' },
  { label: 'Check margin', prompt: 'What is my available margin and current exposure?' },
]

export function TradingChat() {
  const chat = useAgentChat('trading')

  return (
    <section aria-labelledby="trading-chat-heading" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="trading-chat-heading" className="text-base font-semibold text-white">
          Trading Assistant
        </h2>
        <Button size="sm" variant="secondary" onClick={() => void chat.newConversation()} disabled={chat.busy}>
          <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden />
          New conversation
        </Button>
      </div>
      <ChatPanel
        height="calc(100vh - 12rem)"
        messages={chat.messages}
        busy={chat.busy}
        loading={chat.historyLoading}
        onSend={(text) => void chat.send(text)}
        emptyTitle="Trading Assistant"
        emptyDescription={
          <>
            Ask for trade ideas or type <InlineCode>APPROVE &lt;id&gt;</InlineCode> to execute a proposal.
          </>
        }
        starters={STARTERS}
        placeholder="Message your trading agent..."
        footnote={
          <>
            Proposals must be approved before execution. Type <InlineCode>APPROVE &lt;id&gt;</InlineCode> or use
            the panel.
          </>
        }
      />
    </section>
  )
}

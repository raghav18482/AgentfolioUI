import { useCallback, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createThread,
  deleteThread,
  listThreads,
  renameThread,
  resetEphemeralChat,
  sendChat,
  threadMessages,
} from '@/api/agent'
import type { AgentType, ChatMessage } from '@/types'

/** `undefined` = follow the most recent saved thread; `null` = a blank new conversation. */
type Selection = number | null | undefined

const threadsKey = (agentType: AgentType) => ['agent-threads', agentType] as const

const messagesKey = (agentType: AgentType, threadId: number | null) =>
  ['agent-messages', agentType, threadId ?? 'unsaved'] as const

/**
 * One conversation with the finance or trading agent, shared by the Agent and
 * Trading pages.
 *
 * Premium users get saved threads: the latest is resumed on arrival, and a new
 * one is created on the first message rather than on "New conversation", so
 * the history never fills with empty entries. Everyone else gets the server's
 * cookie-scoped conversation, which is not kept.
 *
 * Every conversation's messages live in the query cache, keyed by thread, so
 * moving between threads never loses what was said this visit.
 */
export function useAgentChat(agentType: AgentType) {
  const queryClient = useQueryClient()
  const threads = useQuery({ queryKey: threadsKey(agentType), queryFn: () => listThreads(agentType) })
  const premium = threads.data?.premium ?? false
  const threadList = threads.data?.threads ?? []

  const [selection, setSelection] = useState<Selection>(undefined)
  const [busy, setBusy] = useState(false)

  const activeThreadId: number | null =
    selection !== undefined ? selection : premium ? (threadList[0]?.id ?? null) : null

  const history = useQuery({
    queryKey: messagesKey(agentType, activeThreadId),
    queryFn: () => (activeThreadId === null ? Promise.resolve<ChatMessage[]>([]) : threadMessages(activeThreadId)),
    // Wait for the thread list, or a resumed thread would briefly show as blank.
    enabled: threads.isSuccess,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const append = useCallback(
    (threadId: number | null, ...added: ChatMessage[]) => {
      queryClient.setQueryData<ChatMessage[]>(messagesKey(agentType, threadId), (old = []) => [...old, ...added])
    },
    [agentType, queryClient],
  )

  const send = useCallback(
    async (text: string) => {
      const message = text.trim()
      if (!message || busy) return
      setBusy(true)
      let threadId = activeThreadId
      try {
        if (premium && threadId === null) {
          const thread = await createThread(agentType)
          threadId = thread.id
          queryClient.setQueryData<ChatMessage[]>(messagesKey(agentType, threadId), [])
          setSelection(threadId)
        }
        append(threadId, { role: 'user', text: message })
        const result = await sendChat(message, agentType, threadId)
        append(threadId, { role: 'assistant', text: result.reply })
      } catch (err) {
        append(threadId, {
          role: 'assistant',
          text: err instanceof Error ? err.message : 'Could not reach the server.',
          error: true,
        })
      } finally {
        setBusy(false)
        // A reply can rename a thread, and a trading reply can create or settle a proposal.
        if (premium) void queryClient.invalidateQueries({ queryKey: threadsKey(agentType) })
        if (agentType === 'trading') void queryClient.invalidateQueries({ queryKey: ['proposals'] })
      }
    },
    [activeThreadId, agentType, append, busy, premium, queryClient],
  )

  const newConversation = useCallback(async () => {
    setSelection(null)
    queryClient.setQueryData<ChatMessage[]>(messagesKey(agentType, null), [])
    if (!premium) {
      try {
        await resetEphemeralChat(agentType)
      } catch {
        // The next message simply continues the old server-side context.
      }
    }
  }, [agentType, premium, queryClient])

  const openThread = useCallback((id: number) => setSelection(id), [])

  const rename = useCallback(
    async (id: number, title: string) => {
      await renameThread(id, title)
      await queryClient.invalidateQueries({ queryKey: threadsKey(agentType) })
    },
    [agentType, queryClient],
  )

  const remove = useCallback(
    async (id: number) => {
      await deleteThread(id)
      queryClient.removeQueries({ queryKey: messagesKey(agentType, id) })
      if (id === activeThreadId) setSelection(null)
      await queryClient.invalidateQueries({ queryKey: threadsKey(agentType) })
    },
    [activeThreadId, agentType, queryClient],
  )

  return {
    premium,
    threads: threadList,
    threadsLoading: threads.isPending,
    activeThreadId,
    messages: history.data ?? [],
    historyLoading: history.isPending && threads.isSuccess && activeThreadId !== null,
    busy,
    send,
    newConversation,
    openThread,
    rename,
    remove,
  }
}

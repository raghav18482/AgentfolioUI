import api from './client'
import type { AgentType, ChatMessage, ChatReply, ChatThread } from '@/types'

/** Saved conversations. `premium: false` means history is not kept for this user. */
export async function listThreads(agentType: AgentType): Promise<{ premium: boolean; threads: ChatThread[] }> {
  const { data } = await api.get('/api/agent/threads', { params: { agent_type: agentType } })
  return data
}

export async function createThread(agentType: AgentType): Promise<ChatThread> {
  const { data } = await api.post<{ ok: true; thread: ChatThread }>('/api/agent/threads', {
    agent_type: agentType,
  })
  return data.thread
}

export async function threadMessages(threadId: number): Promise<ChatMessage[]> {
  const { data } = await api.get<{ messages: ChatMessage[] }>(`/api/agent/threads/${threadId}/messages`)
  return data.messages
}

export async function renameThread(threadId: number, title: string): Promise<ChatThread> {
  const { data } = await api.patch<{ ok: true; thread: ChatThread }>(`/api/agent/threads/${threadId}`, { title })
  return data.thread
}

export async function deleteThread(threadId: number): Promise<void> {
  await api.delete(`/api/agent/threads/${threadId}`)
}

export async function sendChat(message: string, agentType: AgentType, threadId: number | null): Promise<ChatReply> {
  const { data } = await api.post<ChatReply>('/api/agent/chat', {
    message,
    agent_type: agentType,
    ...(threadId !== null ? { thread_id: threadId } : {}),
  })
  return data
}

/** Forget the cookie-scoped conversation of a user whose history is not saved. */
export async function resetEphemeralChat(agentType: AgentType): Promise<void> {
  await api.post('/api/agent/new-chat', { agent_type: agentType })
}

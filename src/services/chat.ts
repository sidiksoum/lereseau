import type {
  ChatConversation,
  SendMessagePayload,
  SendMessageResponse,
  ConversationMessagesResponse
} from '../types/api'
import { apiRequest } from './api'

export async function getConversations(): Promise<ChatConversation[]> {
  return apiRequest<ChatConversation[]>('/api/chat/', {
    method: 'GET',
    auth: true,
  })
}

export async function sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
  return apiRequest<SendMessageResponse>('/api/chat/', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

interface ConversationMessagesParams {
  limit?: number
  cursor?: string
}

export async function getConversationMessages(conversationId: string, params?: ConversationMessagesParams): Promise<ConversationMessagesResponse> {
  const qs = new URLSearchParams()
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.cursor) qs.set('cursor', params.cursor)
  const suffix = qs.toString() ? `?${qs.toString()}` : ''
  return apiRequest<ConversationMessagesResponse>(`/api/chat/${conversationId}/messages${suffix}`, {
    method: 'GET',
    auth: true,
  })
}
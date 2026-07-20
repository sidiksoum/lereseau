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

export async function getConversationMessages(conversationId: string): Promise<ConversationMessagesResponse> {
  return apiRequest<ConversationMessagesResponse>(`/api/chat/${conversationId}/messages`, {
    method: 'GET',
    auth: true,
  })
}
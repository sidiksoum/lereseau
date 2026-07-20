import { apiRequest } from './api'

export interface ChatbotHistory {
  [key: string]: string
}

export interface ChatbotAskPayload {
  question: string
  history?: ChatbotHistory[]
}

export interface ChatbotAskResponse {
  answer: string
}

export async function askChatbot(payload: ChatbotAskPayload): Promise<ChatbotAskResponse> {
  return apiRequest<ChatbotAskResponse>('/api/chatbot/ask', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

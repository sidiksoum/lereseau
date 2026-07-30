import { apiRequest } from './api'
import type { Document } from '../types/api'

interface DocumentListParams {
  q?: string
  category?: string
  isPremium?: boolean | null
  limit?: number
  cursor?: string
}

export async function getDocuments(params?: DocumentListParams): Promise<Document[]> {
  const query = new URLSearchParams()
  if (params?.q) query.set('q', params.q)
  if (params?.category) query.set('category', params.category)
  if (params?.isPremium !== undefined && params?.isPremium !== null) query.set('isPremium', String(params.isPremium))
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.cursor) query.set('cursor', params.cursor)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest<Document[]>(`/api/documents/${suffix}`, {
    method: 'GET',
    auth: true,
  })
}

export async function getDocument(id: string): Promise<Document> {
  return apiRequest<Document>(`/api/documents/${id}/`, {
    method: 'GET',
    auth: true,
  })
}
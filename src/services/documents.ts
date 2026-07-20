import { apiRequest } from './api'
import type { Document } from '../types/api'

export async function getDocuments(): Promise<Document[]> {
  return apiRequest<Document[]>('/api/documents/', {
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
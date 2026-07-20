import { apiRequest } from './api'
import type { FeedPost, Document } from '../types/api'

// Feed Publishing
export async function createPremiumFeed(formData: FormData): Promise<FeedPost> {
  return apiRequest('/api/publishing/feed', {
    method: 'POST',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function getPremiumFeeds(): Promise<FeedPost[]> {
  return apiRequest('/api/publishing/feed', {
    method: 'GET',
    auth: true,
  })
}

export async function deletePremiumFeed(id: string): Promise<void> {
  return apiRequest(`/api/publishing/feed/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

// Document Publishing
export async function createPremiumDocument(formData: FormData): Promise<Document> {
  return apiRequest('/api/publishing/documents', {
    method: 'POST',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function getPremiumDocuments(): Promise<Document[]> {
  return apiRequest('/api/publishing/documents', {
    method: 'GET',
    auth: true,
  })
}

export async function updatePremiumDocument(id: string, formData: FormData): Promise<Document> {
  return apiRequest(`/api/publishing/documents/${id}`, {
    method: 'PUT',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function deletePremiumDocument(id: string): Promise<void> {
  return apiRequest(`/api/publishing/documents/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

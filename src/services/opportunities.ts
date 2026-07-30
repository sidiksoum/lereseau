import { apiRequest } from './api'
import type { Opportunity } from '../types/api'

interface OpportunityListParams {
  q?: string
  domain?: string
  limit?: number
  cursor?: string
}

export async function getOpportunities(params?: OpportunityListParams): Promise<Opportunity[]> {
  const query = new URLSearchParams()
  if (params?.q) query.set('q', params.q)
  if (params?.domain) query.set('domain', params.domain)
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.cursor) query.set('cursor', params.cursor)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest<Opportunity[]>(`/api/opportunities/${suffix}`, {
    method: 'GET',
    auth: true,
  })
}

export async function getOpportunity(id: string): Promise<Opportunity> {
  return apiRequest<Opportunity>(`/api/opportunities/${id}/`, {
    method: 'GET',
    auth: true,
  })
}
import { apiRequest } from './api'
import type { Opportunity } from '../types/api'

export async function getOpportunities(): Promise<Opportunity[]> {
  return apiRequest<Opportunity[]>('/api/opportunities/', {
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
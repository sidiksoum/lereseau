import type { User, IncomingRequest, OutgoingRequest, AcceptedConnection } from '../types/api'
import { apiRequest } from './api'

export interface NetworkRelationship {
  id: string
  status?: string
  type?: string
  user?: User
  fromUser?: User
  toUser?: User
  requester?: User
  requestedTo?: User
}

export async function getIncomingRequests(): Promise<IncomingRequest[]> {
  return apiRequest<IncomingRequest[]>('/api/network/incoming', {
    method: 'GET',
    auth: true,
  })
}

export async function getUsers(params?: { q?: string; limit?: number }): Promise<User[]> {
  const query = new URLSearchParams()
  if (params?.q) query.set('q', params.q)
  if (params?.limit) query.set('limit', String(params.limit))

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest<User[]>(`/api/users/${suffix}`, {
    method: 'GET',
    auth: true,
  })
}

export async function getSmartSuggestions(limit = 12): Promise<User[]> {
  return apiRequest<User[]>(`/api/network/suggestions?limit=${limit}`, {
    method: 'GET',
    auth: true,
  })
}

export async function getInstitutions(): Promise<User[]> {
  return apiRequest<User[]>('/api/users/institutions', {
    method: 'GET',
    auth: true,
  })
}

export async function getNetworkConnections(): Promise<NetworkRelationship[]> {
  return apiRequest<NetworkRelationship[]>('/api/network/', {
    method: 'GET',
    auth: true,
  })
}

export async function getOutgoingRequests(): Promise<OutgoingRequest[]> {
  return apiRequest<OutgoingRequest[]>('/api/network/outgoing', {
    method: 'GET',
    auth: true,
  })
}

export async function getAcceptedConnections(): Promise<AcceptedConnection[]> {
  return apiRequest<AcceptedConnection[]>('/api/network/accepted', {
    method: 'GET',
    auth: true,
  })
}

export async function getAcceptedProfessionals(): Promise<AcceptedConnection[]> {
  return apiRequest<AcceptedConnection[]>('/api/network/accepted/professionals', {
    method: 'GET',
    auth: true,
  })
}

export async function getAcceptedMentors(): Promise<AcceptedConnection[]> {
  return apiRequest<AcceptedConnection[]>('/api/network/accepted/mentors', {
    method: 'GET',
    auth: true,
  })
}

export type ConnectionRequestType = 'FRIEND' | 'MENTORSHIP' | 'FOLLOWING'

export async function sendConnectionRequest(toUserId: string, type: ConnectionRequestType = 'FRIEND'): Promise<void> {
  return apiRequest<void>(`/api/network/request/${toUserId}?type=${type}`, {
    method: 'POST',
    auth: true,
  })
}

export async function acceptConnectionRequest(connectionId: string): Promise<void> {
  return apiRequest<void>(`/api/network/accept/${connectionId}`, {
    method: 'PUT',
    auth: true,
  })
}


export async function declineConnectionRequest(connectionId: string): Promise<void> {
  return apiRequest<void>(`/api/network/reject/${connectionId}`, {
    method: 'PUT',
    auth: true,
  })
}

export async function followInstitution(institutionId: string): Promise<void> {
  return apiRequest<void>(`/api/network/follow/${institutionId}`, {
    method: 'POST',
    auth: true,
  })
}

import { apiRequest } from './api'
import type { User } from '../types/api'

export async function createAdminFeedPost(formData: FormData): Promise<unknown> {
  return apiRequest('/api/admin/publishing/feed', {
    method: 'POST',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function createAdminDocument(formData: FormData): Promise<unknown> {
  return apiRequest('/api/admin/publishing/documents', {
    method: 'POST',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function createAdminOpportunity(formData: FormData): Promise<unknown> {
  return apiRequest('/api/admin/publishing/opportunities', {
    method: 'POST',
    body: formData,
    auth: true,
    formData: true,
  })
}

export interface AdminUserStats {
  totalUsers: number
  totalStudents: number
  totalProfessionals: number
  totalInstitutions: number
  totalCertifiedMentors: number
}

export async function getAdminUsers(skip: number = 0, limit: number = 50, role?: string): Promise<User[]> {
  const query = new URLSearchParams()
  query.append('skip', skip.toString())
  query.append('limit', limit.toString())
  if (role) query.append('role', role)

  return apiRequest<User[]>(`/api/admin/users/?${query.toString()}`, {
    method: 'GET',
    auth: true,
  })
}

export async function getAdminUserStats(): Promise<AdminUserStats> {
  return apiRequest<AdminUserStats>('/api/admin/users/stats', {
    method: 'GET',
    auth: true,
  })
}

export async function changeUserStatus(id: string, newStatus: string): Promise<unknown> {
  return apiRequest(`/api/admin/users/${id}/status?new_status=${newStatus}`, {
    method: 'PATCH',
    auth: true,
  })
}

export async function deleteUser(id: string): Promise<void> {
  return apiRequest<void>(`/api/admin/users/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export interface AdminDashboardStats {
  kpis: {
    mau: string
    revenue: string
    engagementRate: string
    criticalAlerts: string
  }
  weeklyData: {
    day: string
    newUsers: number
    activeUsers: number
  }[]
  forumTrends: {
    tag: string
    count: string
  }[]
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  return apiRequest<AdminDashboardStats>('/api/admin/dashboard/stats', {
    method: 'GET',
    auth: true,
  })
}

export async function getAdminFeeds(): Promise<any[]> {
  return apiRequest<any[]>('/api/feed/', {
    method: 'GET',
    auth: true,
  })
}

export async function getAdminOpportunities(): Promise<any[]> {
  return apiRequest<any[]>('/api/opportunities/', {
    method: 'GET',
    auth: true,
  })
}

export async function getAdminDocuments(): Promise<any[]> {
  return apiRequest<any[]>('/api/documents/', {
    method: 'GET',
    auth: true,
  })
}

// ---- CMS UPDATE & DELETE ENDPOINTS ----

export async function updateAdminFeed(id: string, formData: FormData): Promise<unknown> {
  return apiRequest(`/api/admin/publishing/feed/${id}`, {
    method: 'PUT',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function deleteAdminFeed(id: string): Promise<void> {
  return apiRequest<void>(`/api/admin/publishing/feed/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function updateAdminDocument(id: string, formData: FormData): Promise<unknown> {
  return apiRequest(`/api/admin/publishing/documents/${id}`, {
    method: 'PUT',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function deleteAdminDocument(id: string): Promise<void> {
  return apiRequest<void>(`/api/admin/publishing/documents/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function updateAdminOpportunity(id: string, formData: FormData): Promise<unknown> {
  return apiRequest(`/api/admin/publishing/opportunities/${id}`, {
    method: 'PUT',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function deleteAdminOpportunity(id: string): Promise<void> {
  return apiRequest<void>(`/api/admin/publishing/opportunities/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

// --- Certifications & Premium ---

export async function getAdminCertifications(): Promise<{ mentors: any[], institutions: any[] }> {
  return apiRequest<{ mentors: any[], institutions: any[] }>('/api/admin/certifications/', {
    method: 'GET',
    auth: true,
  })
}

export async function processAdminCertification(userId: string, isApproved: boolean): Promise<any> {
  return apiRequest<any>(`/api/admin/certifications/${userId}/certify?is_approved=${isApproved}`, {
    method: 'PATCH',
    auth: true,
  })
}

export async function getAdminPendingPremium(): Promise<any[]> {
  return apiRequest<any[]>('/api/admin/users/premium/pending', {
    method: 'GET',
    auth: true,
  })
}

export async function approveAdminPremium(userId: string): Promise<any> {
  return apiRequest<any>(`/api/admin/users/premium/${userId}/approve`, {
    method: 'PATCH',
    auth: true,
  })
}

export async function rejectAdminPremium(userId: string): Promise<any> {
  return apiRequest<any>(`/api/admin/users/premium/${userId}/reject`, {
    method: 'PATCH',
    auth: true,
  })
}


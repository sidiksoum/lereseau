import type { AppNotification } from '../types/api'
import { apiRequest } from './api'

export async function getNotifications(): Promise<AppNotification[]> {
  return apiRequest<AppNotification[]>('/api/notifications/', {
    method: 'GET',
    auth: true,
  })
}

export async function markAsRead(id: string): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>(`/api/notifications/${id}/read`, {
    method: 'PATCH',
    auth: true,
  })
}

export async function markAllAsRead(): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>('/api/notifications/read-all', {
    method: 'POST',
    auth: true,
  })
}

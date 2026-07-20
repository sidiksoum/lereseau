import type { User, UserEducation, UserExperience } from '../types/api'
import { apiRequest } from './api'

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/api/users/me', {
    method: 'GET',
    auth: true,
  })
}

export async function getPremiumMentors(): Promise<User[]> {
  return apiRequest<User[]>('/api/users/premium-mentors', {
    method: 'GET',
    auth: true,
  })
}

export async function getUserById(userId: string): Promise<User> {
  return apiRequest<User>(`/api/users/${userId}`, {
    method: 'GET',
    auth: true,
  })
}

export async function updateCurrentUser(formData: FormData): Promise<User> {
  return apiRequest<User>('/api/users/me', {
    method: 'PATCH',
    body: formData,
    auth: true,
    formData: true,
  })
}

export async function createUserExperience(payload: Omit<UserExperience, 'id' | 'user_id'>): Promise<UserExperience> {
  return apiRequest<UserExperience>('/api/users/me/experiences', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export async function createUserEducation(payload: Omit<UserEducation, 'id' | 'user_id'>): Promise<UserEducation> {
  return apiRequest<UserEducation>('/api/users/me/educations', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export async function updateUserExperience(id: number, payload: Omit<UserExperience, 'id' | 'user_id'>): Promise<UserExperience> {
  return apiRequest<UserExperience>(`/api/users/me/experiences/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  })
}

export async function updateUserEducation(id: number, payload: Omit<UserEducation, 'id' | 'user_id'>): Promise<UserEducation> {
  return apiRequest<UserEducation>(`/api/users/me/educations/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  })
}

export async function deleteUserExperience(id: number): Promise<void> {
  return apiRequest<void>(`/api/users/me/experiences/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function deleteUserEducation(id: number): Promise<void> {
  return apiRequest<void>(`/api/users/me/educations/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

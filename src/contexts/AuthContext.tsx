import { createContext, useContext } from 'react'
import type { LoginPayload, RegisterPayload, User, UserEducation, UserExperience } from '../types/api'

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<User | null>
  register: (payload: RegisterPayload) => Promise<any>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  updateProfile: (formData: FormData) => Promise<User>
  createExperience: (payload: Omit<UserExperience, 'id' | 'user_id'>) => Promise<UserExperience>
  createEducation: (payload: Omit<UserEducation, 'id' | 'user_id'>) => Promise<UserEducation>
  unreadNotificationsCount: number
  unreadMessagesCount: number
  clearUnreadNotifications: () => void
  clearUnreadMessages: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { LoginPayload, RegisterPayload, User, UserEducation, UserExperience } from '../types/api'
import { loginRequest, logoutRequest, registerUser } from '../services/auth'
import { clearTokens, getAccessToken, getRefreshToken, refreshTokenRequest, setTokens } from '../services/api'
import { createUserEducation, createUserExperience, getCurrentUser, updateCurrentUser } from '../services/user'
import { connectSocket, disconnectSocket } from '../services/socket'
import { AuthContext } from './AuthContext'
import { getNotifications } from '../services/notifications'
import { getConversations } from '../services/chat'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

  const fetchInitialCounts = async () => {
    try {
      const notifications = await getNotifications()
      const unreadNotifs = notifications.filter(n => !n.isRead).length
      setUnreadNotificationsCount(unreadNotifs)

      const conversations = await getConversations()
      const unreadMsgs = conversations.reduce((acc, c) => acc + (c.myUnreadCount || 0), 0)
      setUnreadMessagesCount(unreadMsgs)
    } catch (err) {
      console.warn("Failed to load initial counts:", err)
    }
  }

  useEffect(() => {
    if (user) {
      fetchInitialCounts()
    } else {
      setUnreadNotificationsCount(0)
      setUnreadMessagesCount(0)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    const socket = connectSocket(getAccessToken() || undefined, user.id)
    if (!socket) return

    const handleNewMessage = () => {
      setUnreadMessagesCount(prev => prev + 1)
    }

    const handleNewNotification = () => {
      setUnreadNotificationsCount(prev => prev + 1)
    }

    socket.on('new_message', handleNewMessage)
    socket.on('new_notification', handleNewNotification)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('new_notification', handleNewNotification)
    }
  }, [user])

  const clearUnreadNotifications = () => {
    setUnreadNotificationsCount(0)
  }

  const clearUnreadMessages = () => {
    setUnreadMessagesCount(0)
  }

  const refreshSession = async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await refreshTokenRequest(refreshToken)
    setTokens(response.access_token, refreshToken)
    return response.access_token
  }

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      const token = getAccessToken()
      if (token) {
        connectSocket(token, currentUser.id)
      }
    } catch (originalError) {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        setUser(null)
        throw originalError
      }

      try {
        const token = await refreshSession()
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        connectSocket(token, currentUser.id)
      } catch (refreshError) {
        clearTokens()
        setUser(null)
        throw refreshError
      }
    }
  }

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        await fetchCurrentUser()
      } catch (error) {
        console.warn('Unable to restore user session:', error)
      } finally {
        setLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  const login = async (payload: LoginPayload) => {
    setLoading(true)
    setError(null)
    console.log('[Auth] Attempting login with', payload.email)

    try {
      const response = await loginRequest(payload)
      console.log('[Auth] Login response:', response)
      setTokens(response.access_token, response.refresh_token)
      connectSocket(response.access_token, response.user?.id)
      
      // Toujours récupérer les infos complètes de l'utilisateur
      console.log('[Auth] Fetching full user profile from /api/users/me')
      try {
        const currentUser = await getCurrentUser()
        console.log('[Auth] Fetched full current user:', currentUser)
        setUser(currentUser)
        // Ensure connected with fully loaded user info
        connectSocket(response.access_token, currentUser.id)
        return currentUser
      } catch (userErr) {
        console.error('[Auth] Could not fetch full current user, falling back to login response:', userErr)
        if (response.user) {
          setUser(response.user)
          return response.user
        }
        setUser(null)
        return null
      }
    } catch (err) {
      console.error('[Auth] Login error:', err)
      setError((err as Error).message || 'Erreur de connexion')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    setLoading(true)
    setError(null)

    try {
      const user = await registerUser(payload)
      return user
    } catch (err) {
      setError((err as Error).message || 'Erreur lors de l’inscription')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } catch {
      // ignore logout errors and clear local state anyway
    }
    disconnectSocket()
    clearTokens()
    setUser(null)
  }

  const updateProfile = async (formData: FormData) => {
    const updatedUser = await updateCurrentUser(formData)
    setUser(updatedUser)
    return updatedUser
  }

  const createExperience = async (payload: Omit<UserExperience, 'id' | 'user_id'>) => {
    const experience = await createUserExperience(payload)
    setUser((current) => {
      if (!current) return current
      return {
        ...current,
        experiences: [...(current.experiences ?? []), experience],
      }
    })
    return experience
  }

  const createEducation = async (payload: Omit<UserEducation, 'id' | 'user_id'>) => {
    const education = await createUserEducation(payload)
    setUser((current) => {
      if (!current) return current
      return {
        ...current,
        educations: [...(current.educations ?? []), education],
      }
    })
    return education
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      fetchCurrentUser,
      updateProfile,
      createExperience,
      createEducation,
      unreadNotificationsCount,
      unreadMessagesCount,
      clearUnreadNotifications,
      clearUnreadMessages
    }),
    [user, loading, error, unreadNotificationsCount, unreadMessagesCount]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

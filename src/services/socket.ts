import { io, type Socket } from 'socket.io-client'
import { getAccessToken } from './api'

const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://lereseau-back-end.onrender.com').replace(/\/+$/, '')
let socket: Socket | null = null
let currentUserId: string | null = null

export function connectSocket(accessToken?: string, userId?: string) {
  if (userId) {
    currentUserId = userId
  }

  if (socket && socket.connected) {
    if (currentUserId) {
      socket.emit('join_user_room', { userId: currentUserId })
    }
    return socket
  }

  const s = io(SOCKET_URL, {
    transports: ['websocket'],
    auth: {
      token: accessToken ?? getAccessToken() ?? undefined,
    },
    reconnectionAttempts: 5,
    autoConnect: true,
  })

  socket = s

  s.on('connect', () => {
    console.log('[Socket.IO] connected', s.id)
    if (currentUserId) {
      console.log('[Socket.IO] Emitting join_user_room for', currentUserId)
      s.emit('join_user_room', { userId: currentUserId })
    }
  })

  s.on('connect_error', (error) => {
    console.warn('[Socket.IO] connect_error', error)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] disconnected', reason)
  })

  return socket
}

export function disconnectSocket() {
  if (!socket) return

  socket.disconnect()
  socket = null
}

export function getSocket() {
  return socket
}

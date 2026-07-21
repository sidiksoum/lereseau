import { io, type Socket } from 'socket.io-client'
import { getAccessToken } from './api'

const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://lereseau-back-end.onrender.com').replace(/\/+$/, '')
let socket: Socket | null = null

export function connectSocket(accessToken?: string) {
  if (socket && socket.connected) {
    return socket
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    auth: {
      token: accessToken ?? getAccessToken() ?? undefined,
    },
    reconnectionAttempts: 5,
    autoConnect: true,
  })

  socket.on('connect', () => {
    console.log('[Socket.IO] connected', socket?.id)
  })

  socket.on('connect_error', (error) => {
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

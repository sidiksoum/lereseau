import type { RefreshResponse } from '../types/api'

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8001'
const ACCESS_TOKEN_KEY = 'lereseau_access_token'
const REFRESH_TOKEN_KEY = 'lereseau_refresh_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: any
  auth?: boolean
  formData?: boolean
  json?: boolean
  headers?: HeadersInit
}

export async function apiRequest<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_API_URL}${path}`
  const headers: Record<string, string> = {
    ...((options.headers || {}) as Record<string, string>),
  }

  if (options.auth) {
    const token = getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let body = options.body
  if (body && !options.formData && options.json !== false && !(body instanceof URLSearchParams) && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
    credentials: 'include',
  })

  if (!response.ok) {
    const contentType = response.headers.get('content-type')
    let message = response.statusText || `Request failed with status ${response.status}`

    if (contentType?.includes('application/json')) {
      try {
        const errorData = await response.json()
        console.error('[API] Error JSON parsed:', errorData)
        message = errorData.detail || errorData.message || message
      } catch (e) {
        console.error('[API] Error parsing JSON error response:', e)
      }
    } else {
      const payload = await response.text().catch(() => '')
      message = payload || message
    }

    const error = new Error(message)
      ; (error as any).status = response.status
      ; (error as any).detail = message
    console.error(`[API] Throwing error for ${url}:`, error)
    throw error
  }

  if (response.status === 204) {
    console.log(`[API] ${url} returned 204 No Content`)
    return null as unknown as T
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    try {
      const data = await response.json()
      console.log(`[API] ${url} returned JSON:`, data)
      return data as T
    } catch (e) {
      console.error(`[API] Failed to parse JSON for ${url}:`, e)
      const text = await response.text()
      return { detail: text } as unknown as T
    }
  }

  const text = await response.text()
  console.log(`[API] ${url} returned text:`, text)
  // If it's not JSON, wrap the text in a detail object
  return { detail: text } as unknown as T
}

export async function refreshTokenRequest(refreshToken: string): Promise<RefreshResponse> {
  return apiRequest<RefreshResponse>('/api/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  })
}

import type { LoginPayload, LoginResponse, RegisterPayload, User } from '../types/api'
import { apiRequest } from './api'

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const formData = new URLSearchParams()
  formData.set('grant_type', 'password')
  formData.set('username', payload.email)
  formData.set('password', payload.password)
  formData.set('scope', '')
  formData.set('client_id', '')
  formData.set('client_secret', '')

  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: formData,
    json: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export async function registerUser(payload: RegisterPayload): Promise<{ detail: string; email: string; next_step: string }> {
  return apiRequest<{ detail: string; email: string; next_step: string }>('/api/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export async function verifyEmail(email: string, otpCode: string): Promise<{ detail: string; email: string }> {
  return apiRequest<{ detail: string; email: string }>('/api/auth/verify-email', {
    method: 'POST',
    body: { email, otp_code: otpCode },
  })
}

export async function resendOtp(email: string): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>('/api/auth/resend-otp', {
    method: 'POST',
    body: { email },
  })
}

export async function forgotPassword(email: string): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  })
}

export async function verifyResetOtp(email: string, otpCode: string): Promise<{ detail: string; reset_token?: string }> {
  return apiRequest<{ detail: string; reset_token?: string }>('/api/auth/verify-reset-otp', {
    method: 'POST',
    body: { email, otp_code: otpCode },
  })
}

export async function resetPassword(resetToken: string, newPassword: string): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: { reset_token: resetToken, new_password: newPassword },
  })
}

export async function logoutRequest() {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
    auth: true,
  })
}

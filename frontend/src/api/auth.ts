import { httpRequest } from './http'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth'

export function login(payload: LoginRequest): Promise<AuthResponse> {
  return httpRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: payload,
  })
}

export function register(payload: RegisterRequest): Promise<AuthResponse> {
  return httpRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    auth: false,
    body: payload,
  })
}

export function getMe(): Promise<User> {
  return httpRequest<User>('/auth/me')
}

export function logout(): Promise<void> {
  return httpRequest<void>('/auth/logout', {
    method: 'POST',
  })
}

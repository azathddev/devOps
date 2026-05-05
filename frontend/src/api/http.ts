import type { ApiErrorPayload } from '../types/auth'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

const API_BASE_URL = 'http://localhost:8000'
const TOKEN_STORAGE_KEY = 'accessToken'

let unauthorizedHandler: (() => void) | null = null

export class HttpError extends Error {
  status: number
  payload?: ApiErrorPayload

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

interface RequestOptions extends Omit<RequestInit, 'method' | 'body' | 'headers'> {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
}

export async function httpRequest<T>(
  path: string,
  { method = 'GET', body, headers = {}, auth = true, ...rest }: RequestOptions = {},
): Promise<T> {
  let requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (auth) {
    const token = getAccessToken()
    if (token) {
      requestHeaders = {
        ...requestHeaders,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    ...rest,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = (await response.json().catch(() => null)) as T | ApiErrorPayload | null

  if (!response.ok) {
    const payload = (data ?? undefined) as ApiErrorPayload | undefined
    const message = payload?.message ?? `HTTP ${response.status}`

    if (response.status === 401 && unauthorizedHandler) {
      unauthorizedHandler()
    }

    throw new HttpError(response.status, message, payload)
  }

  return data as T
}

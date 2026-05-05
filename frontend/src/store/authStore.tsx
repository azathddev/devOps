/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getMe, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../api/auth'
import {
  clearAccessToken,
  getAccessToken,
  HttpError,
  setAccessToken,
  setUnauthorizedHandler,
} from '../api/http'
import type { LoginRequest, RegisterRequest, User } from '../types/auth'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function extractErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.payload?.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(getAccessToken())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleUnauthorized = useCallback(() => {
    clearAccessToken()
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized)
    return () => setUnauthorizedHandler(null)
  }, [handleUnauthorized])

  useEffect(() => {
    async function bootstrapAuth() {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const profile = await getMe()
        setUser(profile)
      } catch {
        handleUnauthorized()
      } finally {
        setIsLoading(false)
      }
    }

    void bootstrapAuth()
  }, [token, handleUnauthorized])

  const login = useCallback(async (payload: LoginRequest) => {
    setError(null)
    const response = await loginRequest(payload).catch((requestError: unknown) => {
      const message = extractErrorMessage(requestError)
      setError(message)
      throw requestError
    })
    setAccessToken(response.accessToken)
    setToken(response.accessToken)
    setUser(response.user)
  }, [])

  const register = useCallback(async (payload: RegisterRequest) => {
    setError(null)
    const response = await registerRequest(payload).catch((requestError: unknown) => {
      const message = extractErrorMessage(requestError)
      setError(message)
      throw requestError
    })
    setAccessToken(response.accessToken)
    setToken(response.accessToken)
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // Logout endpoint is optional by contract; local cleanup is enough.
    } finally {
      handleUnauthorized()
    }
  }, [handleUnauthorized])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      error,
      login,
      register,
      logout,
      clearError: () => setError(null),
    }),
    [user, token, isLoading, error, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthStore(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthStore must be used inside AuthProvider')
  }

  return context
}

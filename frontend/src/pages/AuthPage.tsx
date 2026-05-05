import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthTabs } from '../components/auth/AuthTabs'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest, RegisterRequest } from '../types/auth'

type AuthTab = 'login' | 'register'

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const { isAuthenticated, login, register, error, clearError, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    clearError()
  }, [activeTab, clearError])

  const handleLogin = async (payload: LoginRequest) => {
    await login(payload)
  }

  const handleRegister = async (payload: RegisterRequest) => {
    await register(payload)
  }

  return (
    <main className="container auth-page">
      <section className="card auth-card">
        <h1>Личный бюджет</h1>
        <p className="subtitle">Войдите или создайте аккаунт, чтобы управлять доходами и расходами.</p>

        <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {error ? <p className="error-text">{error}</p> : null}

        {activeTab === 'login' ? (
          <LoginForm isLoading={isLoading} onSubmit={handleLogin} />
        ) : (
          <RegisterForm isLoading={isLoading} onSubmit={handleRegister} />
        )}
      </section>
    </main>
  )
}

import { useState, type FormEvent } from 'react'
import type { LoginRequest } from '../../types/auth'

interface LoginFormProps {
  isLoading: boolean
  onSubmit: (payload: LoginRequest) => Promise<void>
}

export function LoginForm({ isLoading, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({ email, password })
  }

  return (
    <form className="form-grid" onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label>
        Пароль
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          autoComplete="current-password"
        />
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Входим...' : 'Войти'}
      </button>
    </form>
  )
}

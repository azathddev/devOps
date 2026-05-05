import { useState, type FormEvent } from 'react'
import type { RegisterRequest } from '../../types/auth'

interface RegisterFormProps {
  isLoading: boolean
  onSubmit: (payload: RegisterRequest) => Promise<void>
}

export function RegisterForm({ isLoading, onSubmit }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({ name, email, password })
  }

  return (
    <form className="form-grid" onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Имя
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
        />
      </label>

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
          autoComplete="new-password"
        />
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
      </button>
    </form>
  )
}

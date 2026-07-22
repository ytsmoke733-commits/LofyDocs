import { useState } from 'react'
import { authenticate, saveSession, type AppUser } from '../lib/auth'

interface LoginProps {
  onLogin: (user: AppUser) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const user = authenticate(username, password)
    if (!user) {
      setError('Usuário ou senha inválidos')
      setLoading(false)
      return
    }

    saveSession(user)
    onLogin(user)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>LofyDocs</h1>
        <p className="subtitle">Portfólio de documentações</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

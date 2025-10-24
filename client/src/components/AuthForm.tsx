import { useState } from 'react'

interface AuthFormProps {
  onSubmit: (data: { email: string; password: string; username?: string }) => void
  isRegister?: boolean
}

export default function AuthForm({ onSubmit, isRegister = false }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password, ...(isRegister && { username }) })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      {isRegister && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
    </form>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'
import AuthForm from '../components/AuthForm.tsx'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AuthForm onSubmit={handleSubmit} isRegister={false} />
      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'
import AuthForm from '../components/AuthForm.tsx'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [error, setError] = useState('')

  const handleSubmit = async (data: { email: string; password: string; username?: string }) => {
    try {
      if (!data.username) {
        setError('Username is required')
        return
      }
      await register(data.email, data.username, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AuthForm onSubmit={handleSubmit} isRegister={true} />
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}
